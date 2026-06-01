import mongoose from 'mongoose';
import { env } from './env';
import logger from './logger';

const RETRY_DELAY_MS = 5000;
const MAX_RETRIES = 5;

export async function connectDatabase(attempt = 1): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info('MongoDB connected', { uri: env.MONGODB_URI.split('@').pop() });
  } catch (error) {
    logger.error(`MongoDB connection failed (attempt ${attempt}/${MAX_RETRIES})`, { error });

    if (attempt >= MAX_RETRIES) {
      logger.error('Max retries reached. Exiting process.');
      process.exit(1);
    }

    logger.info(`Retrying in ${RETRY_DELAY_MS / 1000}s...`);
    await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
    return connectDatabase(attempt + 1);
  }
}

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB reconnected');
});
