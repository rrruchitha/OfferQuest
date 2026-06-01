import { Response, NextFunction } from 'express';
import * as questionService from './question.service';
import { AuthRequest, ApiResponse } from '../../types';
import {
  CreateQuestionInput,
  UpdateQuestionInput,
  GetQuestionsQuery,
} from './question.schema';

// ─── POST /api/v1/questions ───────────────────────────────────────────────────

export async function createQuestion(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as CreateQuestionInput;
    const question = await questionService.createQuestion(body, req.user!.id);

    const response: ApiResponse = {
      success: true,
      message: 'Question created successfully',
      data: { question },
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

// ─── GET /api/v1/questions ────────────────────────────────────────────────────

export async function getQuestions(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query = req.query as GetQuestionsQuery;
    const questions = await questionService.getQuestions(query);

    const response: ApiResponse = {
      success: true,
      data: {
        questions,
        count: questions.length,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

// ─── GET /api/v1/questions/:id ────────────────────────────────────────────────

export async function getQuestionById(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const question = await questionService.getQuestionById(req.params.id);

    const response: ApiResponse = {
      success: true,
      data: { question },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

// ─── PATCH /api/v1/questions/:id ──────────────────────────────────────────────

export async function updateQuestion(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as UpdateQuestionInput;
    const question = await questionService.updateQuestion(
      req.params.id,
      body,
      req.user!.id
    );

    const response: ApiResponse = {
      success: true,
      message: 'Question updated successfully',
      data: { question },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

// ─── DELETE /api/v1/questions/:id ─────────────────────────────────────────────

export async function deleteQuestion(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await questionService.deleteQuestion(req.params.id, req.user!.id);

    const response: ApiResponse = {
      success: true,
      message: 'Question deleted successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}
