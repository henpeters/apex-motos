import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/apex_motors';
    
    // Attempt standard connection with 3s timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] Connected to MongoDB at: ${mongoose.connection.host}`);
  } catch (error) {
    console.warn(`[Database] Could not connect to external MongoDB server. Starting in-memory MongoDB engine...`);
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[Database] In-memory MongoDB running at: ${memoryUri}`);
    } catch (memError) {
      console.error('[Database] Failed to start MongoDB server:', memError);
      process.exit(1);
    }
  }
};
