import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/backend/shared/database';
import { getAuthUser } from '../../lib/auth';
import { ObjectId } from 'mongodb';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (user.role !== 'doctor') {
      return NextResponse.json(
        { error: 'Only doctors can update appointment status' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const { id } = await params;
    
    console.log('=== PATCH Appointment Request ===');
    console.log('Appointment ID:', id);
    console.log('Doctor User ID:', user.userId);
    console.log('Status:', status);
    
    const { db } = await connectToDatabase();
    const appointmentsCollection = db.collection('appointments');

    // Find the appointment first
    const appointment = await appointmentsCollection.findOne({
      _id: new ObjectId(id),
    });

    console.log('Appointment found:', {
      exists: !!appointment,
      doctorId: appointment?.doctorId,
      doctorIdType: typeof appointment?.doctorId,
      userIdType: typeof user.userId,
      areEqual: appointment?.doctorId === user.userId,
      stringComparison: String(appointment?.doctorId) === String(user.userId),
    });

    if (!appointment) {
      console.log('ERROR: Appointment not found');
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Compare IDs as strings to handle any ObjectId vs string issues
    if (String(appointment.doctorId) !== String(user.userId)) {
      console.log('ERROR: Permission denied - IDs do not match');
      return NextResponse.json(
        { error: 'You do not have permission to update this appointment' },
        { status: 403 }
      );
    }

    console.log('Permission check passed, updating appointment...');

    // Update the appointment
    const result = await appointmentsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status } },
      { returnDocument: 'after' }
    );

    // Create notification for patient
    const notificationsCollection = db.collection('notifications');
    const message = status === 'approved'
      ? `Your appointment with Dr. ${user.name} has been approved`
      : `Your appointment with Dr. ${user.name} has been rejected`;

    await notificationsCollection.insertOne({
      userId: appointment.patientId,
      userName: appointment.patientName,
      message,
      type: `appointment_${status}`,
      read: false,
      createdAt: new Date(),
    });

    return NextResponse.json({
      message: 'Appointment updated successfully',
      appointment: result,
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
        { error: 'Only patients can cancel appointments' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const { db } = await connectToDatabase();
    const appointmentsCollection = db.collection('appointments');

    const result = await appointmentsCollection.findOneAndUpdate(
      { _id: new ObjectId(id), patientId: user.userId },
      { $set: { status: 'cancelled' } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Create notification for doctor
    const notificationsCollection = db.collection('notifications');
    await notificationsCollection.insertOne({
      userId: result.doctorId,
      userName: result.doctorName,
      message: `Appointment with ${user.name} has been cancelled`,
      type: 'appointment_cancelled',
      read: false,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel appointment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
