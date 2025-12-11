import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, '../../../.env');
console.log('📁 Loading .env from:', envPath);
dotenv.config({ path: envPath });

console.log('🔍 Environment variables loaded:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET ✅' : 'NOT SET ❌');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET ✅' : 'NOT SET ❌');
console.log('NODE_ENV:', process.env.NODE_ENV);

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../shared/database';

const app = express();
const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

interface User {
  email: string;
  password: string;
  name: string;
  role: 'patient' | 'doctor';
  specialization?: string;
}

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role, specialization } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Check if user exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
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

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Find user
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user._id.toString(), 
        email: user.email, 
        role: user.role,
        name: user.name,
        ...(user.specialization ? { specialization: user.specialization } : {})
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set httpOnly cookie
    res.cookie('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.json({ 
      message: 'Login successful',
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        ...(user.specialization ? { specialization: user.specialization } : {})
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Verify token endpoint
app.get('/api/auth/verify', async (req, res) => {
  try {
    const token = req.cookies['auth-token'];

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    res.json({
      user: {
        userId: decoded.userId,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
        ...(decoded.specialization ? { specialization: decoded.specialization } : {})
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('auth-token');
  res.json({ message: 'Logged out successfully' });
});

// Get all doctors (for appointment booking)
app.get('/api/auth/doctors', async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    const doctors = await usersCollection
      .find({ role: 'doctor' }, { projection: { password: 0 } })
      .toArray();

    res.json({ doctors });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

// Start server
app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`🔐 Auth Service running on http://localhost:${PORT}`);
});
