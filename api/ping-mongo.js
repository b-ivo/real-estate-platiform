import { MongoClient } from 'mongodb';

async function ping() {
  const uri = 'mongodb://127.0.0.1:27018/?directConnection=true';
  console.log('Connecting to', uri);
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  try {
    await client.connect();
    console.log('Connected successfully');
    const adminDb = client.db('admin');
    const status = await adminDb.command({ ping: 1 });
    console.log('Ping status:', status);
  } catch (error) {
    console.error('Connection failed:', error.message);
  } finally {
    await client.close();
  }
}

ping();
