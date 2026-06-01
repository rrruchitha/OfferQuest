import { PopulateOptions, Types } from 'mongoose';

import {
  StudyRoom,
  IStudyRoomDocument,
} from '../../models/StudyRoom.model';

import { Question } from '../../models/Question.model';
import { ApiError } from '../../utils/ApiError';

import {
  CreateRoomInput,
  JoinRoomInput,
  ChangeQuestionInput,
} from './room.schema';


// ─── Populate Helper ──────────────────────────────────────────────────────────

const ROOM_POPULATE: PopulateOptions[] = [
  {
    path: 'owner',
    select: 'name email avatarUrl',
  },
  {
    path: 'participants',
    select: 'name email avatarUrl',
  },
  {
    path: 'currentQuestion',
    select: 'title difficulty topic tags',
  },
];


// ─── Create Room ──────────────────────────────────────────────────────────────

export async function createRoom(
  input: CreateRoomInput,
  userId: string
): Promise<IStudyRoomDocument> {

  const room = await StudyRoom.create({
    name: input.name,
    description: input.description,
    owner: userId,
  });


  const populated =
    await StudyRoom.findById(room._id)
      .populate(ROOM_POPULATE);


  if (!populated) {
    throw ApiError.internal(
      'Failed to create room'
    );
  }


  return populated;
}


// ─── Get Rooms For User ───────────────────────────────────────────────────────

export async function getUserRooms(
  userId: string
): Promise<IStudyRoomDocument[]> {

  return StudyRoom.find({
    participants: userId,
    isActive: true,
  })
    .populate(ROOM_POPULATE)
    .sort({
      updatedAt: -1,
    });
}


// ─── Get Single Room ──────────────────────────────────────────────────────────

export async function getRoomById(
  roomId: string,
  userId: string
): Promise<IStudyRoomDocument> {

  const room =
    await StudyRoom.findById(roomId)
      .populate(ROOM_POPULATE);


  if (!room) {
    throw ApiError.notFound(
      `Room with ID '${roomId}' not found`
    );
  }


  const isParticipant =
    room.participants.some(
      (participant) =>
        participant._id.toString() === userId
    );


  if (!isParticipant) {
    throw ApiError.forbidden(
      'You are not a participant in this room'
    );
  }


  return room;
}


// ─── Join Room ────────────────────────────────────────────────────────────────

export async function joinRoom(
  input: JoinRoomInput,
  userId: string
): Promise<IStudyRoomDocument> {

  const room =
    await StudyRoom.findOne({
      roomCode:
        input.roomCode.toUpperCase(),
      isActive: true,
    });


  if (!room) {
    throw ApiError.notFound(
      'Room not found. Check the room code and try again.'
    );
  }


  const alreadyJoined =
    room.participants.some(
      (participant) =>
        participant.toString() === userId
    );


  if (alreadyJoined) {
    throw ApiError.conflict(
      'You are already a participant in this room'
    );
  }


  room.participants.push(
    new Types.ObjectId(userId)
  );


  await room.save();


  const populated =
    await StudyRoom.findById(room._id)
      .populate(ROOM_POPULATE);


  if (!populated) {
    throw ApiError.internal(
      'Failed to join room'
    );
  }


  return populated;
}


// ─── Change Active Question ───────────────────────────────────────────────────

export async function changeCurrentQuestion(
  roomId: string,
  input: ChangeQuestionInput,
  userId: string
): Promise<IStudyRoomDocument> {

  const room =
    await StudyRoom.findById(roomId);


  if (!room) {
    throw ApiError.notFound(
      `Room with ID '${roomId}' not found`
    );
  }


  if (room.owner.toString() !== userId) {
    throw ApiError.forbidden(
      'Only the room owner can change the active question'
    );
  }


  const questionExists =
    await Question.exists({
      _id: input.questionId,
    });


  if (!questionExists) {
    throw ApiError.notFound(
      `Question with ID '${input.questionId}' not found`
    );
  }


  room.currentQuestion =
    new Types.ObjectId(
      input.questionId
    );


  await room.save();


  const populated =
    await StudyRoom.findById(room._id)
      .populate(ROOM_POPULATE);


  if (!populated) {
    throw ApiError.internal(
      'Failed to update question'
    );
  }


  return populated;
}


// ─── Leave Room ───────────────────────────────────────────────────────────────

export async function leaveRoom(
  roomId: string,
  userId: string
): Promise<{ disbanded: boolean }> {

  const room =
    await StudyRoom.findById(roomId);


  if (!room) {
    throw ApiError.notFound(
      `Room with ID '${roomId}' not found`
    );
  }


  const isParticipant =
    room.participants.some(
      (participant) =>
        participant.toString() === userId
    );


  if (!isParticipant) {
    throw ApiError.badRequest(
      'You are not a participant in this room'
    );
  }


  const isOwner =
    room.owner.toString() === userId;


  if (isOwner) {

    // Keep room history instead of deleting
    room.isActive = false;

    await room.save();

    return {
      disbanded: true,
    };
  }


  room.participants =
    room.participants.filter(
      (participant) =>
        participant.toString() !== userId
    ) as Types.ObjectId[];


  await room.save();


  return {
    disbanded: false,
  };
}


// ─── Verify Participant (Used By Socket Layer) ────────────────────────────────

export async function verifyParticipant(
  roomId: string,
  userId: string
): Promise<IStudyRoomDocument> {

  const room =
    await StudyRoom.findById(roomId);


  if (!room || !room.isActive) {
    throw ApiError.notFound(
      `Room with ID '${roomId}' not found`
    );
  }


  const isMember =
    room.participants.some(
      (participant) =>
        participant.toString() === userId
    );


  if (!isMember) {
    throw ApiError.forbidden(
      'You are not a participant in this room'
    );
  }


  return room;
}