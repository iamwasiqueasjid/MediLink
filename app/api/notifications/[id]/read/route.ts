import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/backend/shared/database';
import { getAuthUser } from '../../../lib/auth';
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

    const { id } = await params;
    const { db } = await connectToDatabase();
    const notificationsCollection = db.collection('notifications');

    await notificationsCollection.updateOne(
      { _id: new ObjectId(id), userId: user.userId },
      { $set: { read: true } }
    );

    return NextResponse.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}
