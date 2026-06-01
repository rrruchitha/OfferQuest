import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../types';
import logger from '../config/logger';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  // Log every error with request context
  logger.error(error.message, {
    stack: error.stack,
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    statusCode: error instanceof ApiError ? error.statusCode : 500,
  });

  if (error instanceof ApiError) {
    const response: ApiResponse = {
      success: false,
      message: error.message,
    };
    res.status(error.statusCode).json(response);
    return;
  }

  // Handle Mongoose duplicate key errors
  if ((error as NodeJS.ErrnoException).name === 'MongoServerError') {
    const mongoError = error as NodeJS.ErrnoException & { code?: number };
    if (mongoError.code === 11000) {
      const response: ApiResponse = {
        success: false,
        message: 'A record with this value already exists',
      };
      res.status(409).json(response);
      return;
    }
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (error.name === 'CastError') {
    const response: ApiResponse = {
      success: false,
      message: 'Invalid ID format',
    };
    res.status(400).json(response);
    return;
  }

  // Unhandled errors — do not leak internal details in production
  const response: ApiResponse = {
    success: false,
    message:
      process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : error.message,
  };

  res.status(500).json(response);
}
