import { Server } from 'socket.io';
import { AuthenticatedSocket } from './socket.auth';
import * as roomService from '../modules/rooms/room.service';
import { Question } from '../models/Question.model';
import logger from '../config/logger';

// ─── Socket event constants ───────────────────────────────────────────────────

export const SOCKET_EVENTS = {
  // Client → Server
  JOIN_ROOM: 'join-room',
  LEAVE_ROOM: 'leave-room',
  SEND_MESSAGE: 'send-message',
  QUESTION_CHANGE: 'question-change',

  // Server → Client
  USER_JOINED: 'user-joined',
  USER_LEFT: 'user-left',
  NEW_MESSAGE: 'new-message',
  ACTIVE_QUESTION_UPDATED: 'active-question-updated',
  ROOM_USERS_UPDATED: 'room-users-updated',
  ERROR: 'error',
} as const;


// ─── Payload Types ────────────────────────────────────────────────────────────

interface JoinRoomPayload {
  roomId: string;
}

interface LeaveRoomPayload {
  roomId: string;
}

interface SendMessagePayload {
  roomId: string;
  message: string;
}

interface QuestionChangePayload {
  roomId: string;
  questionId: string;
}


// ─── Helper ───────────────────────────────────────────────────────────────────

function emitError(
  socket: AuthenticatedSocket,
  message: string
): void {
  socket.emit(SOCKET_EVENTS.ERROR, {
    message,
  });
}


// ─── Register Room Socket Handlers ────────────────────────────────────────────

export function registerRoomHandlers(
  io: Server,
  socket: AuthenticatedSocket
): void {

  const { user } = socket;


  // ─── Join Room ──────────────────────────────────────────────────────────────

  socket.on(
    SOCKET_EVENTS.JOIN_ROOM,
    async (payload: JoinRoomPayload) => {
      try {

        const { roomId } = payload;

        if (!roomId) {
          return emitError(socket, 'roomId is required');
        }


        // Security: user must already belong to this room
        await roomService.verifyParticipant(
          roomId,
          user.id
        );


        // Join Socket.IO room
        await socket.join(roomId);


        logger.debug('Socket joined room', {
          socketId: socket.id,
          userId: user.id,
          roomId,
        });


        socket.to(roomId).emit(
          SOCKET_EVENTS.USER_JOINED,
          {
            userId: user.id,
            email: user.email,
            timestamp: new Date().toISOString(),
          }
        );


        const socketsInRoom =
          await io.in(roomId).fetchSockets();


        const connectedUserIds =
          socketsInRoom.map(
            (s) =>
              (s as unknown as AuthenticatedSocket)
                .user.id
          );


        io.to(roomId).emit(
          SOCKET_EVENTS.ROOM_USERS_UPDATED,
          {
            roomId,
            connectedUserIds,
          }
        );

      } catch (error) {

        logger.error('join-room error', {
          userId: user.id,
          error,
        });

        emitError(
          socket,
          error instanceof Error
            ? error.message
            : 'Failed to join room'
        );
      }
    }
  );


  // ─── Leave Room ─────────────────────────────────────────────────────────────

  socket.on(
    SOCKET_EVENTS.LEAVE_ROOM,
    async (payload: LeaveRoomPayload) => {
      try {

        const { roomId } = payload;


        if (!roomId) {
          return emitError(socket, 'roomId is required');
        }


        await socket.leave(roomId);


        socket.to(roomId).emit(
          SOCKET_EVENTS.USER_LEFT,
          {
            userId: user.id,
            email: user.email,
            timestamp: new Date().toISOString(),
          }
        );


        const socketsInRoom =
          await io.in(roomId).fetchSockets();


        const connectedUserIds =
          socketsInRoom.map(
            (s) =>
              (s as unknown as AuthenticatedSocket)
                .user.id
          );


        io.to(roomId).emit(
          SOCKET_EVENTS.ROOM_USERS_UPDATED,
          {
            roomId,
            connectedUserIds,
          }
        );


      } catch (error) {

        logger.error('leave-room error', {
          userId: user.id,
          error,
        });


        emitError(
          socket,
          error instanceof Error
            ? error.message
            : 'Failed to leave room'
        );
      }
    }
  );


  // ─── Send Message ───────────────────────────────────────────────────────────

  socket.on(
    SOCKET_EVENTS.SEND_MESSAGE,
    async (payload: SendMessagePayload) => {
      try {

        const { roomId, message } = payload;


        if (!roomId || !message) {
          return emitError(
            socket,
            'roomId and message are required'
          );
        }


        const trimmed = message.trim();


        if (!trimmed) {
          return emitError(
            socket,
            'Message cannot be empty'
          );
        }


        if (trimmed.length > 1000) {
          return emitError(
            socket,
            'Message cannot exceed 1000 characters'
          );
        }


        await roomService.verifyParticipant(
          roomId,
          user.id
        );


        io.to(roomId).emit(
          SOCKET_EVENTS.NEW_MESSAGE,
          {
            roomId,
            senderId: user.id,
            senderEmail: user.email,
            message: trimmed,
            timestamp: new Date().toISOString(),
          }
        );


      } catch (error) {

        logger.error('send-message error', {
          userId: user.id,
          error,
        });


        emitError(
          socket,
          error instanceof Error
            ? error.message
            : 'Failed to send message'
        );
      }
    }
  );


  // ─── Change Active Question ─────────────────────────────────────────────────

  socket.on(
    SOCKET_EVENTS.QUESTION_CHANGE,
    async (payload: QuestionChangePayload) => {
      try {

        const { roomId, questionId } = payload;


        if (!roomId || !questionId) {
          return emitError(
            socket,
            'roomId and questionId are required'
          );
        }


        await roomService.changeCurrentQuestion(
          roomId,
          { questionId },
          user.id
        );


        const question =
          await Question.findById(questionId)
            .select(
              'title difficulty topic tags description'
            );


        io.to(roomId).emit(
          SOCKET_EVENTS.ACTIVE_QUESTION_UPDATED,
          {
            roomId,
            question,
            updatedBy: user.id,
            timestamp: new Date().toISOString(),
          }
        );


      } catch (error) {

        logger.error(
          'question-change error',
          {
            userId: user.id,
            error,
          }
        );


        emitError(
          socket,
          error instanceof Error
            ? error.message
            : 'Failed to change question'
        );
      }
    }
  );


  // ─── Disconnect Cleanup ─────────────────────────────────────────────────────

  socket.on(
    'disconnect',
    async (reason) => {

      logger.debug(
        'Socket disconnected',
        {
          socketId: socket.id,
          userId: user.id,
          reason,
        }
      );


      for (const roomId of socket.rooms) {

        if (roomId === socket.id) continue;


        socket.to(roomId).emit(
          SOCKET_EVENTS.USER_LEFT,
          {
            userId: user.id,
            email: user.email,
            timestamp: new Date().toISOString(),
          }
        );


        const socketsInRoom =
          await io.in(roomId).fetchSockets();


        const connectedUserIds =
          socketsInRoom.map(
            (s) =>
              (s as unknown as AuthenticatedSocket)
                .user.id
          );


        io.to(roomId).emit(
          SOCKET_EVENTS.ROOM_USERS_UPDATED,
          {
            roomId,
            connectedUserIds,
          }
        );
      }
    }
  );
}