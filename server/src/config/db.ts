import { MongoClient } from 'mongodb';
import { config } from './configuration';

const MONGODB_URI = `${config.mongodb.uri}/${config.mongodb.dbName}?replicaSet=${config.mongodb.replicaSet}`;

export const client = new MongoClient(MONGODB_URI);

export async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db(config.mongodb.dbName);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
} 