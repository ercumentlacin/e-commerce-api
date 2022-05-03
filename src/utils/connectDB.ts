import { connect } from 'mongoose';

export default function initializeDatabaseConnection(): void {
  const { MONGO_PATH } = process.env;
  if (!MONGO_PATH) {
    console.log('=== MONGO_PATH is not defined in .env file ===');
  } else {
    connect(MONGO_PATH);
    console.log('=== Connected to MongoDB ===');
  }
}
