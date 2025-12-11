import dotenv from 'dotenv';
import path from 'path';
import { MongoClient, Db } from 'mongodb';

// Load environment variables FIRST before reading any env vars
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

// MongoDB connection string - in production use environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'medilink';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  console.log('🔌 Connecting to MongoDB...');
  console.log('📍 URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));
  
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(DB_NAME);
  
  console.log('✅ Connected to database:', DB_NAME);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export function getDb(): Db {
  if (!cachedDb) {
    throw new Error('Database not initialized. Call connectToDatabase first.');
  }
  return cachedDb;
}
