import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/backend/shared/database';

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    const doctors = await usersCollection
      .find({ role: 'doctor' }, { projection: { password: 0 } })
      .toArray();

    return NextResponse.json({ doctors });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}
