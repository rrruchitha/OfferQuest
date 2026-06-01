import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import crypto from 'crypto';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface IStudyRoom {
  name: string;
  description: string;
  roomCode: string;
  owner: Types.ObjectId;
  participants: Types.ObjectId[];
  currentQuestion: Types.ObjectId | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStudyRoomDocument extends IStudyRoom, Document {}

export interface IStudyRoomModel extends Model<IStudyRoomDocument> {
  generateRoomCode(): string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Generates an 8-character room code e.g. "A3BX9K2M"
function generateRoomCode(): string {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const studyRoomSchema = new Schema<IStudyRoomDocument, IStudyRoomModel>(
  {
    name: {
      type: String,
      required: [true, 'Room name is required'],
      trim: true,
      minlength: [3, 'Room name must be at least 3 characters'],
      maxlength: [80, 'Room name cannot exceed 80 characters'],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [300, 'Description cannot exceed 300 characters'],
      default: '',
    },

    roomCode: {
      type: String,
      uppercase: true,
      trim: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
    },

    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    currentQuestion: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

// roomCode lookup while joining rooms
studyRoomSchema.index(
  { roomCode: 1 },
  { unique: true }
);

// finding rooms created by user
studyRoomSchema.index({ owner: 1 });

// finding rooms user participates in
studyRoomSchema.index({ participants: 1 });

// active room filtering
studyRoomSchema.index({ isActive: 1 });


// ─── Pre-save middleware ──────────────────────────────────────────────────────

studyRoomSchema.pre('save', function (next) {
  if (this.isNew) {

    // Generate invite code automatically
    if (!this.roomCode) {
      this.roomCode = generateRoomCode();
    }

    // Owner automatically joins their own room
    const ownerAlreadyJoined = this.participants.some(
      (participantId) =>
        participantId.equals(this.owner)
    );

    if (!ownerAlreadyJoined) {
      this.participants.push(this.owner);
    }
  }

  next();
});


// ─── Static Methods ───────────────────────────────────────────────────────────

studyRoomSchema.statics.generateRoomCode = generateRoomCode;


// ─── Model ────────────────────────────────────────────────────────────────────

export const StudyRoom = mongoose.model<
  IStudyRoomDocument,
  IStudyRoomModel
>(
  'StudyRoom',
  studyRoomSchema
);