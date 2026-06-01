import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  avatarUrl?: string;
  bio?: string;
  techStack: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDocument> {
  findByEmail(email: string): Promise<IUserDocument | null>;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const userSchema = new Schema<IUserDocument, IUserModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // Never returned in queries by default
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: [300, 'Bio cannot exceed 300 characters'],
      default: null,
    },
    techStack: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        // Never expose passwordHash in JSON output
        delete ret['passwordHash'];
        return ret;
      },
    },
  }
);

// ─── Instance methods ─────────────────────────────────────────────────────────

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// ─── Static methods ───────────────────────────────────────────────────────────

userSchema.statics.findByEmail = function (email: string) {
  // +passwordHash explicitly includes the field excluded by default
  return this.findOne({ email: email.toLowerCase() }).select('+passwordHash');
};

// ─── Model ────────────────────────────────────────────────────────────────────

export const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);
