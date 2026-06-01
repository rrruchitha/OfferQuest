import { Router } from 'express';
import * as progressController from './progress.controller';
import { validate } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import { questionIdParamSchema, upsertProgressSchema } from './progress.schema';

const router = Router();

// All progress routes require authentication
router.use(authenticate);

// GET /api/v1/progress
// Returns all progress records for the authenticated user
router.get('/', progressController.getUserProgress);

// GET /api/v1/progress/revision
// IMPORTANT: This literal route MUST be declared before /:questionId.
// Express matches routes in declaration order — if /:questionId came first,
// the string "revision" would be captured as a questionId param.
router.get('/revision', progressController.getRevisionQueue);

// GET /api/v1/progress/:questionId
router.get(
  '/:questionId',
  validate(questionIdParamSchema),
  progressController.getProgressByQuestion
);

// PATCH /api/v1/progress/:questionId
// Upsert — creates progress if it doesn't exist, updates if it does
router.patch(
  '/:questionId',
  validate(upsertProgressSchema),
  progressController.upsertProgress
);

export default router;
