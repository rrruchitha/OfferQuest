import { z } from 'zod';
import { Difficulty } from '../../models/Question.model';

// ─── Reusable field definitions ───────────────────────────────────────────────

const titleField = z
  .string({ required_error: 'Title is required' })
  .min(3, 'Title must be at least 3 characters')
  .max(150, 'Title cannot exceed 150 characters')
  .trim();

const descriptionField = z
  .string({ required_error: 'Description is required' })
  .min(10, 'Description must be at least 10 characters')
  .trim();

const difficultyField = z.nativeEnum(Difficulty, {
  errorMap: () => ({ message: 'Difficulty must be EASY, MEDIUM, or HARD' }),
});

const topicField = z
  .string({ required_error: 'Topic is required' })
  .min(2, 'Topic must be at least 2 characters')
  .trim();

const tagsField = z
  .array(z.string().trim())
  .optional()
  .default([]);

// ─── Create schema ────────────────────────────────────────────────────────────

export const createQuestionSchema = z.object({
  body: z.object({
    title: titleField,
    description: descriptionField,
    difficulty: difficultyField,
    topic: topicField,
    tags: tagsField,
  }),
});

// ─── Update schema — all fields optional ─────────────────────────────────────

export const updateQuestionSchema = z.object({
  params: z.object({
    id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid question ID'),
  }),
  body: z
    .object({
      title: titleField.optional(),
      description: descriptionField.optional(),
      difficulty: difficultyField.optional(),
      topic: topicField.optional(),
      tags: tagsField,
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      { message: 'At least one field must be provided for update' }
    ),
});

// ─── Params schema ────────────────────────────────────────────────────────────

export const questionIdParamSchema = z.object({
  params: z.object({
    id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid question ID'),
  }),
});

// ─── Query schema — for GET /questions filtering ──────────────────────────────

export const getQuestionsQuerySchema = z.object({
  query: z.object({
    difficulty: z.nativeEnum(Difficulty).optional(),
    topic: z.string().trim().optional(),
    search: z.string().trim().optional(),
  }),
});

// ─── Inferred types ───────────────────────────────────────────────────────────

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>['body'];
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>['body'];
export type GetQuestionsQuery = z.infer<typeof getQuestionsQuerySchema>['query'];
