import { Router } from 'express';

import * as roomController from './room.controller';

import { validate } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';

import {
  createRoomSchema,
  joinRoomSchema,
  changeQuestionSchema,
  roomIdParamSchema,
} from './room.schema';


const router = Router();


// ─── Authentication ───────────────────────────────────────────────────────────

// Every room route requires logged-in user

router.use(authenticate);


// ─── Create Room ──────────────────────────────────────────────────────────────
// POST /api/v1/rooms

router.post(
  '/',
  validate(createRoomSchema),
  roomController.createRoom
);


// ─── Get User Rooms ───────────────────────────────────────────────────────────
// GET /api/v1/rooms

router.get(
  '/',
  roomController.getUserRooms
);


// ─── Join Room ────────────────────────────────────────────────────────────────
// POST /api/v1/rooms/join
//
// Must stay before "/:id"

router.post(
  '/join',
  validate(joinRoomSchema),
  roomController.joinRoom
);


// ─── Get Room Details ─────────────────────────────────────────────────────────
// GET /api/v1/rooms/:id

router.get(
  '/:id',
  validate(roomIdParamSchema),
  roomController.getRoomById
);


// ─── Change Current Question ──────────────────────────────────────────────────
// PATCH /api/v1/rooms/:id/question

router.patch(
  '/:id/question',
  validate(changeQuestionSchema),
  roomController.changeCurrentQuestion
);


// ─── Leave Room ───────────────────────────────────────────────────────────────
// DELETE /api/v1/rooms/:id/leave

router.delete(
  '/:id/leave',
  validate(roomIdParamSchema),
  roomController.leaveRoom
);


export default router;