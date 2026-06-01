import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';
import { JwtPayload } from '../types';
import { User } from '../models/User.model';
import logger from '../config/logger';


// ─── Authenticated Socket Type ────────────────────────────────────────────────

export interface AuthenticatedSocket extends Socket {
  user: {
    id: string;
    email: string;
  };
}


// ─── Socket Authentication Middleware ─────────────────────────────────────────

export async function socketAuthMiddleware(
  socket: Socket,
  next: (err?: Error) => void
): Promise<void> {

  try {

    const raw: unknown =
      socket.handshake.auth?.token ??
      socket.handshake.query?.token;


    if (!raw || typeof raw !== 'string') {

      logger.warn(
        'Socket rejected — missing token',
        {
          socketId: socket.id,
        }
      );

      return next(
        new Error('Authentication required')
      );
    }


    const token =
      raw.startsWith('Bearer ')
        ? raw.slice(7)
        : raw;


    const decoded =
      jwt.verify(
        token,
        env.JWT_SECRET
      ) as JwtPayload;


    // Important:
    // JWT may be valid but user may have been deleted
    const user =
      await User.findById(decoded.id)
        .select('email');


    if (!user) {

      logger.warn(
        'Socket rejected — user no longer exists',
        {
          userId: decoded.id,
        }
      );


      return next(
        new Error('User no longer exists')
      );
    }


    (socket as AuthenticatedSocket).user = {
      id: user._id.toString(),
      email: user.email,
    };


    logger.debug(
      'Socket authenticated',
      {
        socketId: socket.id,
        userId: user._id,
      }
    );


    next();

  } catch (error) {

    logger.warn(
      'Socket rejected — invalid token',
      {
        socketId: socket.id,
        error,
      }
    );


    next(
      new Error('Invalid or expired token')
    );
  }
}