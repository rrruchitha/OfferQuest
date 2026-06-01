import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { User, IUserDocument } from '../../models/User.model';
import { ApiError } from '../../utils/ApiError';
import { JwtPayload } from '../../types';
import { RegisterInput, LoginInput } from './auth.schema';

const SALT_ROUNDS = 12;

// ─── Token helpers ────────────────────────────────────────────────────────────

function signToken(user: IUserDocument): string {
  const payload: JwtPayload = {
    id: user._id.toString(),
    email: user.email,
  };
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

// ─── Service functions ────────────────────────────────────────────────────────

export async function registerUser(input: RegisterInput): Promise<{ user: IUserDocument; token: string }> {
  const existingUser = await User.findOne({ email: input.email });
  if (existingUser) {
    throw ApiError.conflict('An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await User.create({
  name: input.name,
  email: input.email.toLowerCase(),
  passwordHash,
  });

  const token = signToken(user);
  return { user, token };
}

export async function loginUser(input: LoginInput): Promise<{ user: IUserDocument; token: string }> {
  // Must use findByEmail static — it selects +passwordHash
  const user = await User.findByEmail(input.email);
  if (!user) {
    // Use identical message for both cases — prevents email enumeration
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isPasswordValid = await user.comparePassword(input.password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = signToken(user);
  return { user, token };
}

export async function getCurrentUser(userId: string): Promise<IUserDocument> {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  return user;
}
