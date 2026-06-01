import { FilterQuery } from 'mongoose';
import { Question, IQuestionDocument } from '../../models/Question.model';
import { ApiError } from '../../utils/ApiError';
import {
  CreateQuestionInput,
  UpdateQuestionInput,
  GetQuestionsQuery,
} from './question.schema';

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createQuestion(
  input: CreateQuestionInput,
  userId: string
): Promise<IQuestionDocument> {
  const question = await Question.create({
    ...input,
    createdBy: userId,
  });

  return question;
}

// ─── Get all (with optional filters) ─────────────────────────────────────────

export async function getQuestions(
  query: GetQuestionsQuery
): Promise<IQuestionDocument[]> {
  const filter: FilterQuery<IQuestionDocument> = {};

  if (query.difficulty) {
    filter.difficulty = query.difficulty;
  }

  if (query.topic) {
    // Case-insensitive partial match on topic
    filter.topic = { $regex: query.topic, $options: 'i' };
  }

  if (query.search) {
    // Title search — uses the text index for efficiency
    // Falls back to regex if text index isn't available (e.g. dev without index)
    filter.title = { $regex: query.search, $options: 'i' };
  }

  const questions = await Question.find(filter)
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  return questions;
}

// ─── Get by ID ────────────────────────────────────────────────────────────────

export async function getQuestionById(id: string): Promise<IQuestionDocument> {
  // Mongoose throws CastError for malformed ObjectIds — caught by error middleware
  const question = await Question.findById(id).populate('createdBy', 'name email');

  if (!question) {
    throw ApiError.notFound(`Question with ID '${id}' not found`);
  }

  return question;
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateQuestion(
  id: string,
  input: UpdateQuestionInput,
  userId: string
): Promise<IQuestionDocument> {
  const question = await Question.findById(id);

  if (!question) {
    throw ApiError.notFound(`Question with ID '${id}' not found`);
  }

  // Only the creator can update their question
  if (question.createdBy.toString() !== userId) {
    throw ApiError.forbidden('You do not have permission to update this question');
  }

  const updated = await Question.findByIdAndUpdate(
    id,
    { $set: input },
    {
      new: true,           // Return the updated document
      runValidators: true, // Run Mongoose schema validators on update
    }
  ).populate('createdBy', 'name email');

  // Should not happen — findById already confirmed it exists
  if (!updated) {
    throw ApiError.internal('Failed to update question');
  }

  return updated;
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteQuestion(
  id: string,
  userId: string
): Promise<void> {
  const question = await Question.findById(id);

  if (!question) {
    throw ApiError.notFound(`Question with ID '${id}' not found`);
  }

  // Only the creator can delete their question
  if (question.createdBy.toString() !== userId) {
    throw ApiError.forbidden('You do not have permission to delete this question');
  }

  await Question.findByIdAndDelete(id);
}
