import { MongoClient } from 'mongodb';

async function check() {
  const uri = 'mongodb://127.0.0.1:27018/?directConnection=true';
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const adminDb = client.db('admin');
    const status = await adminDb.command({ replSetGetStatus: 1 });
    console.log('Replica Set Status:', JSON.stringify(status, null, 2));
  } catch (error) {
    console.error('Check failed:', error.message);
  } finally {
    await client.close();
  }
}

check();
