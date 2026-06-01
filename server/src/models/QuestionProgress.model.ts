import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// ─── Status Enum ──────────────────────────────────────────────────────────────

export enum ProgressStatus {
  UNSEEN = 'unseen',
  ATTEMPTED = 'attempted',
  SOLVED = 'solved',
  REVISIT = 'revisit',
}

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface IQuestionProgress {
  user: Types.ObjectId;
  question: Types.ObjectId;
  status: ProgressStatus;
  attemptCount: number;
  lastAttemptedAt: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuestionProgressDocument extends IQuestionProgress, Document {}

export interface IQuestionProgressModel extends Model<IQuestionProgressDocument> {}

// ─── Schema ───────────────────────────────────────────────────────────────────

const questionProgressSchema = new Schema<
  IQuestionProgressDocument,
  IQuestionProgressModel
>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: [true, 'Question is required'],
    },
    status: {
      type: String,
      enum: {
        values: Object.values(ProgressStatus),
        message: `Status must be one of: ${Object.values(ProgressStatus).join(', ')}`,
      },
      default: ProgressStatus.UNSEEN,
      required: true,
    },
    attemptCount: {
      type: Number,
      default: 0,
      min: [0, 'Attempt count cannot be negative'],
    },
    lastAttemptedAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

// Compound unique index — enforces one progress document per (user, question) pair
questionProgressSchema.index({ user: 1, question: 1 }, { unique: true });

// Supporting indexes for single-field queries
questionProgressSchema.index({ user: 1 });
questionProgressSchema.index({ question: 1 });

// ─── Model ────────────────────────────────────────────────────────────────────

export const QuestionProgress = mongoose.model<
  IQuestionProgressDocument,
  IQuestionProgressModel
>('QuestionProgress', questionProgressSchema);
