import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { env } from '../config/env';
import { socketAuthMiddleware, AuthenticatedSocket } from './socket.auth';
import { registerRoomHandlers } from './room.socket';
import logger from '../config/logger';

let io: Server;

export function initializeSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    // Ping every 25s; drop connection after 60s of no response
    pingInterval: 25000,
    pingTimeout: 60000,
  });

  // ── Auth middleware — runs before any event for every connection ─────────

  io.use((socket, next) => {
    socketAuthMiddleware(socket, next);
  });

  // ── Connection handler ───────────────────────────────────────────────────

  io.on('connection', (socket: Socket) => {
    const authSocket = socket as AuthenticatedSocket;

    logger.info('Socket connected', {
      socketId: authSocket.id,
      userId: authSocket.user.id,
    });

    // Register all room event handlers for this socket
    registerRoomHandlers(io, authSocket);
  });

  logger.info('Socket.IO initialized');
  return io;
}

// Exported so services/tests can emit server-side if needed
export function getIO(): Server {
  if (!io) {
    throw new Error('Socket.IO not initialized — call initializeSocket first');
  }
  return io;
}
