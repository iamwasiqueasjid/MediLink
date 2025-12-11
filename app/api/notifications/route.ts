import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/backend/shared/database';
import { getAuthUser } from '../lib/auth';

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
    const notificationsCollection = db.collection('notifications');

    const notifications = await notificationsCollection
      .find({ userId: user.userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
