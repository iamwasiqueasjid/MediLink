import dotenv from 'dotenv';
dotenv.config();

import { connectToDatabase } from '../backend/shared/database';

async function testConnection() {
  try {
    console.log('\n=== Testing MongoDB Connection ===');
    console.log('MONGODB_URI:', process.env.MONGODB_URI?.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@') || 'NOT SET');
    console.log('');
    
    const { db } = await connectToDatabase();
    
    // Test the connection
    const adminDb = db.admin();
    const info = await adminDb.serverInfo();
    
    console.log('✅ Connected successfully!');
    console.log(`MongoDB Version: ${info.version}`);
    console.log(`Database: ${db.databaseName}`);
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log(`\nCollections (${collections.length}):`);
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    // Count users
    const usersCount = await db.collection('users').countDocuments();
    console.log(`\nTotal users in database: ${usersCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error);
    process.exit(1);
  }
}

testConnection();
