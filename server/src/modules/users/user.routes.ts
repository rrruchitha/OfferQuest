import { Router } from 'express';
import * as userController from './user.controller';
import { validate } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import { updateProfileSchema } from './user.schema';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// GET /api/v1/users/me/stats
// IMPORTANT: declared before /me to prevent Express swallowing "stats" as a sub-path
router.get('/me/stats', userController.getMyStats);

// GET /api/v1/users/me
router.get('/me', userController.getMe);

// PATCH /api/v1/users/me
router.patch('/me', validate(updateProfileSchema), userController.updateMe);

// DELETE /api/v1/users/me
router.delete('/me', userController.deleteMe);

export default router;
