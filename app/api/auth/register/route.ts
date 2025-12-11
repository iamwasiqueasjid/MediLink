import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/backend/shared/database';

interface User {
  email: string;
  password: string;
  name: string;
  role: 'patient' | 'doctor';
  specialization?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role, specialization } = body;

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Check if user exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user: User = {
      email,
      password: hashedPassword,
      name,
      role,
      ...(role === 'doctor' && specialization ? { specialization } : {}),
    };

    await usersCollection.insertOne(user);

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
