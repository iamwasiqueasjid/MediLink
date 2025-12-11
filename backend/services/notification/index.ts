import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, '../../../.env');
dotenv.config({ path: envPath });

import express from 'express';
import cors from 'cors';
import { connectToDatabase } from '../../shared/database';
import { eventBus, EVENTS } from '../../shared/eventBus';

const app = express();
const PORT = 3003;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

interface Notification {
  userId: string;
  userName: string;
  message: string;
  type: 'appointment_created' | 'appointment_approved' | 'appointment_rejected' | 'appointment_cancelled';
  read: boolean;
  createdAt: Date;
}

// Store notifications in database
async function createNotification(notification: Notification) {
  try {
    const { db } = await connectToDatabase();
    const notificationsCollection = db.collection('notifications');
    await notificationsCollection.insertOne(notification);
    console.log(`📬 Notification created: ${notification.message}`);
  } catch (error) {
    console.error('Create notification error:', error);
  }
}

// Event listeners - this is the event-driven part
eventBus.on(EVENTS.APPOINTMENT_CREATED, async (data: any) => {
  console.log('🔔 Event received: Appointment Created');
  
  // Notify doctor
  await createNotification({
    userId: data.doctorId,
    userName: data.doctorName,
    message: `New appointment request from ${data.patientName} on ${data.date} at ${data.time}`,
    type: 'appointment_created',
    read: false,
    createdAt: new Date(),
  });
  
  // Notify patient (confirmation)
  await createNotification({
    userId: data.patientId,
    userName: data.patientName,
    message: `Your appointment request with Dr. ${data.doctorName} has been submitted and is pending approval`,
    type: 'appointment_created',
    read: false,
    createdAt: new Date(),
  });
});

eventBus.on(EVENTS.APPOINTMENT_APPROVED, async (data: any) => {
  console.log('🔔 Event received: Appointment Approved');
  
  // Notify patient
  await createNotification({
    userId: data.patientId,
    userName: data.patientName,
    message: `Your appointment with Dr. ${data.doctorName} on ${data.date} at ${data.time} has been approved`,
    type: 'appointment_approved',
    read: false,
    createdAt: new Date(),
  });
});

eventBus.on(EVENTS.APPOINTMENT_REJECTED, async (data: any) => {
  console.log('🔔 Event received: Appointment Rejected');
  
  // Notify patient
  await createNotification({
    userId: data.patientId,
    userName: data.patientName,
    message: `Your appointment request with Dr. ${data.doctorName} on ${data.date} at ${data.time} has been rejected`,
    type: 'appointment_rejected',
    read: false,
    createdAt: new Date(),
  });
});

eventBus.on(EVENTS.APPOINTMENT_CANCELLED, async (data: any) => {
  console.log('🔔 Event received: Appointment Cancelled');
  
  // Notify doctor
  await createNotification({
    userId: data.doctorId,
    userName: data.doctorName,
    message: `Appointment with ${data.patientName} on ${data.date} at ${data.time} has been cancelled`,
    type: 'appointment_cancelled',
    read: false,
    createdAt: new Date(),
  });
});

// Get notifications for user
app.get('/api/notifications/:userId', async (req: any, res: any) => {
  try {
    const { userId } = req.params;

    const { db } = await connectToDatabase();
    const notificationsCollection = db.collection('notifications');

    const notifications = await notificationsCollection
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    res.json({ notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
app.patch('/api/notifications/:id/read', async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const { db } = await connectToDatabase();
    const notificationsCollection = db.collection('notifications');

    await notificationsCollection.updateOne(
      { _id: id },
      { $set: { read: true } }
    );

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Start server
app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`🔔 Notification Service running on http://localhost:${PORT}`);
  console.log('✅ Event listeners registered');
});
