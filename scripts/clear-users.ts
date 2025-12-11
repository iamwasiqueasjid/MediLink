import { connectToDatabase } from '../backend/shared/database';

async function clearUsers() {
  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    
    console.log('⚠️  WARNING: This will delete ALL users from the database!');
    
    const result = await usersCollection.deleteMany({});
    
    console.log(`\n✅ Deleted ${result.deletedCount} users from the database.`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

clearUsers();
