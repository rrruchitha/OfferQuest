import { Router } from 'express';
import * as questionController from './question.controller';
import { validate } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import {
  createQuestionSchema,
  updateQuestionSchema,
  questionIdParamSchema,
  getQuestionsQuerySchema,
} from './question.schema';

const router = Router();

// All question routes require authentication
router.use(authenticate);

// POST /api/v1/questions
router.post(
  '/',
  validate(createQuestionSchema),
  questionController.createQuestion
);

// GET /api/v1/questions?difficulty=EASY&topic=Arrays&search=two
router.get(
  '/',
  validate(getQuestionsQuerySchema),
  questionController.getQuestions
);

// GET /api/v1/questions/:id
router.get(
  '/:id',
  validate(questionIdParamSchema),
  questionController.getQuestionById
);

// PATCH /api/v1/questions/:id
router.patch(
  '/:id',
  validate(updateQuestionSchema),
  questionController.updateQuestion
);

// DELETE /api/v1/questions/:id
router.delete(
  '/:id',
  validate(questionIdParamSchema),
  questionController.deleteQuestion
);

export default router;
