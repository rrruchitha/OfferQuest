import { Response, NextFunction } from 'express';
import * as userService from './user.service';
import { AuthRequest, ApiResponse } from '../../types';
import { UpdateProfileInput } from './user.schema';

// ─── GET /api/v1/users/me ─────────────────────────────────────────────────────

export async function getMe(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await userService.getProfile(req.user!.id);

    const response: ApiResponse = {
      success: true,
      data: { user },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

// ─── PATCH /api/v1/users/me ───────────────────────────────────────────────────

export async function updateMe(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await userService.updateProfile(
      req.user!.id,
      req.body as UpdateProfileInput
    );

    const response: ApiResponse = {
      success: true,
      message: 'Profile updated successfully',
      data: { user },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

// ─── DELETE /api/v1/users/me ──────────────────────────────────────────────────

export async function deleteMe(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await userService.deactivateAccount(req.user!.id);

    const response: ApiResponse = {
      success: true,
      message: 'Account deactivated successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

// ─── GET /api/v1/users/me/stats ───────────────────────────────────────────────

export async function getMyStats(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const stats = await userService.getUserStats(req.user!.id);

    const response: ApiResponse = {
      success: true,
      data: { stats },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}
