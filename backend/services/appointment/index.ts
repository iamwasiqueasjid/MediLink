import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, '../../../.env');
dotenv.config({ path: envPath });

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../shared/database';
import { eventBus, EVENTS } from '../../shared/eventBus';
import { ObjectId } from 'mongodb';

const app = express();
const PORT = 3002;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Auth middleware
const authenticate = (req: any, res: any, next: any) => {
  try {
    const token = req.cookies['auth-token'];
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

interface Appointment {
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  createdAt: Date;
}

// Create appointment (Patient)
app.post('/api/appointments', authenticate, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ error: 'Only patients can book appointments' });
    }

    const { doctorId, doctorName, date, time, reason } = req.body;

    if (!doctorId || !date || !time || !reason) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const { db } = await connectToDatabase();
    const appointmentsCollection = db.collection('appointments');

    const appointment: Appointment = {
      patientId: req.user.userId,
      patientName: req.user.name,
      doctorId,
      doctorName,
      date,
      time,
      reason,
      status: 'pending',
      createdAt: new Date(),
    };

    const result = await appointmentsCollection.insertOne(appointment);

    // Emit event for notification service
    eventBus.emit(EVENTS.APPOINTMENT_CREATED, {
      appointmentId: result.insertedId.toString(),
      ...appointment,
    });

    res.status(201).json({ 
      message: 'Appointment created successfully',
      appointmentId: result.insertedId 
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// Get appointments (Patient: own appointments, Doctor: appointments for them)
app.get('/api/appointments', authenticate, async (req: any, res: any) => {
  try {
    const { db } = await connectToDatabase();
    const appointmentsCollection = db.collection('appointments');

    let query = {};
    
    if (req.user.role === 'patient') {
      query = { patientId: req.user.userId };
    } else if (req.user.role === 'doctor') {
      query = { doctorId: req.user.userId };
    }

    const appointments = await appointmentsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ appointments });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Update appointment status (Doctor only)
app.patch('/api/appointments/:id', authenticate, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ error: 'Only doctors can update appointment status' });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { db } = await connectToDatabase();
    const appointmentsCollection = db.collection('appointments');

    const result = await appointmentsCollection.findOneAndUpdate(
      { _id: new ObjectId(id), doctorId: req.user.userId },
      { $set: { status } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Emit event for notification service
    const eventType = status === 'approved' 
      ? EVENTS.APPOINTMENT_APPROVED 
      : EVENTS.APPOINTMENT_REJECTED;
    
    eventBus.emit(eventType, {
      appointmentId: id,
      ...result,
    });

    res.json({ message: 'Appointment updated successfully', appointment: result });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// Cancel appointment (Patient only)
app.delete('/api/appointments/:id', authenticate, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ error: 'Only patients can cancel appointments' });
    }

    const { id } = req.params;

    const { db } = await connectToDatabase();
    const appointmentsCollection = db.collection('appointments');

    const result = await appointmentsCollection.findOneAndUpdate(
      { _id: new ObjectId(id), patientId: req.user.userId },
      { $set: { status: 'cancelled' } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Emit event for notification service
    eventBus.emit(EVENTS.APPOINTMENT_CANCELLED, {
      appointmentId: id,
      ...result,
    });

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
});

// Start server
app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`📅 Appointment Service running on http://localhost:${PORT}`);
});
