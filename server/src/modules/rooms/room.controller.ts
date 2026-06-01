import { Response, NextFunction } from 'express';

import * as roomService from './room.service';

import {
  AuthRequest,
  ApiResponse,
} from '../../types';

import {
  CreateRoomInput,
  JoinRoomInput,
  ChangeQuestionInput,
} from './room.schema';


// ─── POST /api/v1/rooms ───────────────────────────────────────────────────────

export async function createRoom(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {

    const room =
      await roomService.createRoom(
        req.body as CreateRoomInput,
        req.user!.id
      );


    const response: ApiResponse = {
      success: true,
      message: 'Study room created successfully',
      data: {
        room,
      },
    };


    res.status(201).json(response);

  } catch (error) {

    next(error);

  }
}


// ─── GET /api/v1/rooms ────────────────────────────────────────────────────────

export async function getUserRooms(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {

    const rooms =
      await roomService.getUserRooms(
        req.user!.id
      );


    const response: ApiResponse = {
      success: true,
      data: {
        rooms,
        count: rooms.length,
      },
    };


    res.status(200).json(response);

  } catch (error) {

    next(error);

  }
}


// ─── GET /api/v1/rooms/:id ────────────────────────────────────────────────────

export async function getRoomById(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {

    const room =
      await roomService.getRoomById(
        req.params.id,
        req.user!.id
      );


    const response: ApiResponse = {
      success: true,
      data: {
        room,
      },
    };


    res.status(200).json(response);

  } catch (error) {

    next(error);

  }
}


// ─── POST /api/v1/rooms/join ──────────────────────────────────────────────────

export async function joinRoom(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {

    const room =
      await roomService.joinRoom(
        req.body as JoinRoomInput,
        req.user!.id
      );


    const response: ApiResponse = {
      success: true,
      message: 'Joined room successfully',
      data: {
        room,
      },
    };


    res.status(200).json(response);

  } catch (error) {

    next(error);

  }
}


// ─── PATCH /api/v1/rooms/:id/question ─────────────────────────────────────────

export async function changeCurrentQuestion(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {

    const room =
      await roomService.changeCurrentQuestion(
        req.params.id,
        req.body as ChangeQuestionInput,
        req.user!.id
      );


    const response: ApiResponse = {
      success: true,
      message: 'Active question updated',
      data: {
        room,
      },
    };


    res.status(200).json(response);

  } catch (error) {

    next(error);

  }
}


// ─── DELETE /api/v1/rooms/:id/leave ───────────────────────────────────────────

export async function leaveRoom(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {

    const result =
      await roomService.leaveRoom(
        req.params.id,
        req.user!.id
      );


    const response: ApiResponse = {
      success: true,
      message: result.disbanded
        ? 'Room disbanded — you were the owner'
        : 'You have left the room',
    };


    res.status(200).json(response);

  } catch (error) {

    next(error);

  }
}