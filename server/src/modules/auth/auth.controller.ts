import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { AuthRequest, ApiResponse } from '../../types';
import { RegisterInput, LoginInput } from './auth.schema';

// ─── POST /auth/register ──────────────────────────────────────────────────────

export async function register(
  req: Request<{}, {}, RegisterInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { user, token } = await authService.registerUser(req.body);

    const response: ApiResponse = {
      success: true,
      message: 'Account created successfully',
      data: { user, token },
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

// ─── POST /auth/login ─────────────────────────────────────────────────────────

export async function login(
  req: Request<{}, {}, LoginInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { user, token } = await authService.loginUser(req.body);

    const response: ApiResponse = {
      success: true,
      message: 'Login successful',
      data: { user, token },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

// ─── GET /auth/me ─────────────────────────────────────────────────────────────

export async function getMe(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // req.user is guaranteed by authMiddleware before this runs
    const user = await authService.getCurrentUser(req.user!.id);

    const response: ApiResponse = {
      success: true,
      data: { user },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}
