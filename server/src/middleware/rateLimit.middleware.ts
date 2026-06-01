import rateLimit from 'express-rate-limit';
import { ApiResponse } from '../types';

// Strict limiter for auth endpoints — prevents brute force
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    const response: ApiResponse = {
      success: false,
      message: 'Too many attempts. Please try again in 15 minutes.',
    };
    res.status(429).json(response);
  },
});

// General limiter for all API routes
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    const response: ApiResponse = {
      success: false,
      message: 'Too many requests. Please slow down.',
    };
    res.status(429).json(response);
  },
});
