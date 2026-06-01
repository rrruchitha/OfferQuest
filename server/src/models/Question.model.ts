import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// ─── Difficulty Enum ──────────────────────────────────────────────────────────

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface IQuestion {
  title: string;
  description: string;
  difficulty: Difficulty;
  topic: string;
  tags: string[];
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuestionDocument extends IQuestion, Document {}

export interface IQuestionModel extends Model<IQuestionDocument> {}

// ─── Schema ───────────────────────────────────────────────────────────────────

const questionSchema = new Schema<IQuestionDocument, IQuestionModel>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
    },
    difficulty: {
      type: String,
      enum: {
        values: Object.values(Difficulty),
        message: 'Difficulty must be EASY, MEDIUM, or HARD',
      },
      required: [true, 'Difficulty is required'],
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      trim: true,
      minlength: [2, 'Topic must be at least 2 characters'],
    },
    tags: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'createdBy is required'],
    },
  },
  {
    timestamps: true,
  }
);
// Supports filtering by difficulty and topic
questionSchema.index({ difficulty: 1 });
questionSchema.index({ topic: 1 });
questionSchema.index({ createdBy: 1 });

// ─── Model ────────────────────────────────────────────────────────────────────

export const Question = mongoose.model<IQuestionDocument, IQuestionModel>(
  'Question',
  questionSchema
);
