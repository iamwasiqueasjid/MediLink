import { connectToDatabase } from '../backend/shared/database';

async function checkUsers() {
  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    
    const users = await usersCollection.find({}).toArray();
    
    console.log('\n=== Existing Users in Database ===');
    console.log(`Total users: ${users.length}\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Role: ${user.role}`);
      if (user.specialization) {
        console.log(`   Specialization: ${user.specialization}`);
      }
      console.log('');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUsers();
