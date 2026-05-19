import { MongoClient } from 'mongodb';

async function check() {
  const uri = 'mongodb://127.0.0.1:27018/?directConnection=true';
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('realestate');
    const users = await db.collection('User').find().toArray();
    console.log('Total Users:', users.length);
    console.log('Users:', JSON.stringify(users.map(u => ({ username: u.username, email: u.email })), null, 2));
  } catch (error) {
    console.error('Check failed:', error.message);
  } finally {
    await client.close();
  }
}

check();
