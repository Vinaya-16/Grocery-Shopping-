import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('MONGODB_URI is missing in .env');
}

const client = new MongoClient(uri);

const clientPromise = client.connect();

export default clientPromise;