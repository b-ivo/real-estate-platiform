import { MongoClient } from 'mongodb';

async function init() {
  const uri = 'mongodb://localhost:27018/?directConnection=true';
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const adminDb = client.db('admin');
    await adminDb.command({
      replSetInitiate: {
        _id: 'rs0',
        members: [{ _id: 0, host: 'localhost:27018' }]
      }
    });
    console.log('Replica set initialized successfully! You can now use Prisma.');
  } catch (error) {
    if (error.codeName === 'AlreadyInitialized') {
      console.log('Replica set is already initialized.');
    } else {
      console.error('Error initializing replica set:', error.message);
    }
  } finally {
    await client.close();
  }
}

init();
