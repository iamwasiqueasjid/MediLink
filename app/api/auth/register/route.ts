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
    console.log('Registration request received');
    
    const body = await request.json();
    const { email, password, name, role, specialization } = body;

    console.log('Registration data:', { email, name, role, hasPassword: !!password });

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    console.log('Connecting to database...');
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    console.log('Checking if user exists...');
    // Check if user exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    console.log('Hashing password...');
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Creating user document...');
    // Create user
    const user: User = {
      email,
      password: hashedPassword,
      name,
      role,
      ...(role === 'doctor' && specialization ? { specialization } : {}),
    };

    console.log('Inserting user into database...');
    const result = await usersCollection.insertOne(user);
    console.log('User created successfully:', result.insertedId);

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Registration failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
