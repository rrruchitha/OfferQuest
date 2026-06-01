import { z } from 'zod';


// ─── Reusable Mongo ObjectId Validator ────────────────────────────────────────

const objectIdSchema = z
  .string()
  .regex(
    /^[0-9a-fA-F]{24}$/,
    'Invalid MongoDB ObjectId'
  );


// ─── Create Room ──────────────────────────────────────────────────────────────

export const createRoomSchema = z.object({
  body: z.object({

    name: z
      .string({
        required_error: 'Room name is required',
      })
      .min(
        3,
        'Room name must be at least 3 characters'
      )
      .max(
        80,
        'Room name cannot exceed 80 characters'
      )
      .trim(),


    description: z
      .string()
      .max(
        300,
        'Description cannot exceed 300 characters'
      )
      .trim()
      .optional()
      .default(''),

  }),
});


// ─── Join Room ────────────────────────────────────────────────────────────────

export const joinRoomSchema = z.object({
  body: z.object({

    roomCode: z
      .string({
        required_error: 'Room code is required',
      })
      .min(
        1,
        'Room code cannot be empty'
      )
      .trim()
      .toUpperCase(),

  }),
});


// ─── Change Active Question ───────────────────────────────────────────────────

export const changeQuestionSchema = z.object({

  params: z.object({
    id: objectIdSchema,
  }),


  body: z.object({

    questionId: objectIdSchema,

  }),

});


// ─── Room ID Param ────────────────────────────────────────────────────────────

export const roomIdParamSchema = z.object({

  params: z.object({

    id: objectIdSchema,

  }),

});


// ─── Inferred Types ───────────────────────────────────────────────────────────

export type CreateRoomInput =
  z.infer<typeof createRoomSchema>['body'];


export type JoinRoomInput =
  z.infer<typeof joinRoomSchema>['body'];


export type ChangeQuestionInput =
  z.infer<typeof changeQuestionSchema>['body'];