import mongoose from 'mongoose';
import { config } from '@/config';

class DatabaseConnector {
  private static instance: DatabaseConnector;
  private isConnected: boolean = false;

  public static getInstance(): DatabaseConnector {
    if (!DatabaseConnector.instance) {
      DatabaseConnector.instance = new DatabaseConnector();
    }
    return DatabaseConnector.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('Already connected to the database');
      return;
    }

    try {
      await mongoose.connect(config.MONGODB_URL);
      this.isConnected = true;
      console.log('Connected to the database successfully');
    } catch (error) {
      console.error('Error connecting to the database:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      console.log('Not connected to the database');
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('Disconnected from the database successfully');
    } catch (error) {
      console.error('Error disconnecting from the database:', error);
      throw error;
    }
  }

}

export default new DatabaseConnector;