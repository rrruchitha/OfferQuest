import { z } from 'zod';
import { ProgressStatus } from '../../models/QuestionProgress.model';

const objectIdSchema = z
  .string({ required_error: 'Question ID is required' })
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid question ID');


// ─── Param schemas ────────────────────────────────────────────────────────────

export const questionIdParamSchema = z.object({
  params: z.object({
    questionId: objectIdSchema,
  }),
});


// ─── Upsert body schema ───────────────────────────────────────────────────────

export const upsertProgressSchema = z.object({
  params: z.object({
    questionId: objectIdSchema,
  }),

  body: z.object({
    status: z.nativeEnum(ProgressStatus, {
      errorMap: () => ({
        message: `Status must be one of: ${Object.values(ProgressStatus).join(', ')}`,
      }),
    }),

    notes: z
      .string()
      .max(2000, 'Notes cannot exceed 2000 characters')
      .trim()
      .optional()
      .nullable(),
  }),
});


// ─── Inferred types ───────────────────────────────────────────────────────────

export type UpsertProgressInput =
  z.infer<typeof upsertProgressSchema>['body'];