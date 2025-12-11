import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/backend/shared/database';
import { getAuthUser } from '../lib/auth';

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

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (user.role !== 'patient') {
      return NextResponse.json(
        { error: 'Only patients can book appointments' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { doctorId, doctorName, date, time, reason } = body;

    if (!doctorId || !date || !time || !reason) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const appointmentsCollection = db.collection('appointments');

    const appointment: Appointment = {
      patientId: user.userId,
      patientName: user.name,
      doctorId,
      doctorName,
      date,
      time,
      reason,
      status: 'pending',
      createdAt: new Date(),
    };

    const result = await appointmentsCollection.insertOne(appointment);

    // Create notification for doctor
    const notificationsCollection = db.collection('notifications');
    await notificationsCollection.insertOne({
      userId: doctorId,
      userName: doctorName,
      message: `New appointment request from ${user.name} on ${date} at ${time}`,
      type: 'appointment_created',
      read: false,
      createdAt: new Date(),
    });

    return NextResponse.json(
      {
        message: 'Appointment created successfully',
        appointmentId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create appointment error:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    const appointmentsCollection = db.collection('appointments');

    let query = {};

    if (user.role === 'patient') {
      query = { patientId: user.userId };
    } else if (user.role === 'doctor') {
      query = { doctorId: user.userId };
    }

    const appointments = await appointmentsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error('Get appointments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}
