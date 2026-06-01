import { Request } from 'express';
import { Types } from 'mongoose';

// Extends Express Request with authenticated user payload
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

// Standard API response envelope
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: unknown;
}

// JWT payload shape
export interface JwtPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

// Pagination query params
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

// Utility: MongoDB ObjectId as string
export type ObjectIdString = string;

// Utility: Make selected keys optional
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
