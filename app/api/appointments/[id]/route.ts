import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/backend/shared/database';
import { getAuthUser } from '../../lib/auth';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return NextResponse.json({ message: 'Route working', id: params.id });
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const user = getAuthUser(request);
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    if (user.role !== 'doctor') return NextResponse.json({ error: 'Only doctors' }, { status: 403 });
    
    const body = await request.json();
    const { status } = body;
    if (!['approved', 'rejected'].includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    
    const { db } = await connectToDatabase();
    const appointment = await db.collection('appointments').findOne({ _id: new ObjectId(params.id) });
    
    if (!appointment) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (String(appointment.doctorId) !== String(user.userId)) return NextResponse.json({ error: 'No permission' }, { status: 403 });
    
    await db.collection('appointments').updateOne({ _id: new ObjectId(params.id) }, { $set: { status } });
    
    await db.collection('notifications').insertOne({
      userId: appointment.patientId,
      userName: appointment.patientName,
      message: `Appointment ${status}`,
      type: `appointment_${status}`,
      read: false,
      createdAt: new Date(),
    });
    
    return NextResponse.json({ message: 'Updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const user = getAuthUser(request);
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    
    const { db } = await connectToDatabase();
    const result = await db.collection('appointments').findOneAndUpdate(
      { _id: new ObjectId(params.id), patientId: user.userId },
      { $set: { status: 'cancelled' } }
    );
    
    if (!result) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Cancelled' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
