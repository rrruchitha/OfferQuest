import { Response, NextFunction } from 'express';
import * as progressService from './progress.service';
import { AuthRequest, ApiResponse } from '../../types';
import { UpsertProgressInput } from './progress.schema';

// ─── GET /api/v1/progress ─────────────────────────────────────────────────────

export async function getUserProgress(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const records = await progressService.getUserProgress(req.user!.id);

    const response: ApiResponse = {
      success: true,
      data: {
        progress: records,
        count: records.length,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

// ─── GET /api/v1/progress/revision ───────────────────────────────────────────

export async function getRevisionQueue(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const records = await progressService.getRevisionQueue(req.user!.id);

    const response: ApiResponse = {
      success: true,
      data: {
        revisionQueue: records,
        count: records.length,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

// ─── GET /api/v1/progress/:questionId ────────────────────────────────────────

export async function getProgressByQuestion(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const progress = await progressService.getProgressByQuestion(
      req.user!.id,
      req.params.questionId
    );

    const response: ApiResponse = {
      success: true,
      data: { progress },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

// ─── PATCH /api/v1/progress/:questionId ──────────────────────────────────────

export async function upsertProgress(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as UpsertProgressInput;
    const progress = await progressService.upsertProgress(
      req.user!.id,
      req.params.questionId,
      body
    );

    const response: ApiResponse = {
      success: true,
      message: 'Progress saved successfully',
      data: { progress },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}
