import {
  QuestionProgress,
  IQuestionProgressDocument,
  ProgressStatus,
} from '../../models/QuestionProgress.model';

import { Question } from '../../models/Question.model';
import { ApiError } from '../../utils/ApiError';
import { UpsertProgressInput } from './progress.schema';


// ─── Attempt statuses ─────────────────────────────────────────────────────────

const ATTEMPT_STATUSES = new Set<ProgressStatus>([
  ProgressStatus.ATTEMPTED,
  ProgressStatus.SOLVED,
]);


// ─── Get all progress ─────────────────────────────────────────────────────────

export async function getUserProgress(
  userId: string
): Promise<IQuestionProgressDocument[]> {

  return QuestionProgress.find({ user: userId })
    .populate(
      'question',
      'title difficulty topic tags'
    )
    .sort({ updatedAt: -1 });
}


// ─── Get progress by question ─────────────────────────────────────────────────

export async function getProgressByQuestion(
  userId: string,
  questionId: string
): Promise<IQuestionProgressDocument> {

  const questionExists =
    await Question.exists({ _id: questionId });

  if (!questionExists) {
    throw ApiError.notFound('Question not found');
  }


  const progress =
    await QuestionProgress.findOne({
      user: userId,
      question: questionId,
    }).populate(
      'question',
      'title difficulty topic tags'
    );


  if (!progress) {
    throw ApiError.notFound(
      'No progress found for this question'
    );
  }


  return progress;
}


// ─── Create or update progress ────────────────────────────────────────────────

export async function upsertProgress(
  userId: string,
  questionId: string,
  input: UpsertProgressInput
): Promise<IQuestionProgressDocument> {


  const questionExists =
    await Question.exists({ _id: questionId });


  if (!questionExists) {
    throw ApiError.notFound('Question not found');
  }


  const existingProgress =
    await QuestionProgress.findOne({
      user: userId,
      question: questionId,
    });



  const updatePayload: Record<string, unknown> = {

    $set: {
      status: input.status,
    },

    $setOnInsert: {
      user: userId,
      question: questionId,
    },
  };


  if (input.notes !== undefined) {
    (updatePayload.$set as Record<string, unknown>).notes =
      input.notes;
  }


  /*
    Increase attempts only when:
    - first creating attempted/solved
    - moving from another status into attempted/solved

    Prevents:
    solved → solved → solved
    from increasing count repeatedly
  */

  const shouldIncreaseAttempt =
    ATTEMPT_STATUSES.has(input.status) &&
    (!existingProgress ||
      existingProgress.status !== input.status);


  if (shouldIncreaseAttempt) {
    updatePayload.$inc = {
      attemptCount: 1,
    };

    updatePayload.$currentDate = {
      lastAttemptedAt: true,
    };
  }


  const progress =
    await QuestionProgress.findOneAndUpdate(

      {
        user: userId,
        question: questionId,
      },

      updatePayload,

      {
        new: true,
        upsert: true,
        runValidators: true,
      }

    ).populate(
      'question',
      'title difficulty topic tags'
    );


  if (!progress) {
    throw ApiError.internal(
      'Failed to update progress'
    );
  }


  return progress;
}


// ─── Revision Queue ───────────────────────────────────────────────────────────

export async function getRevisionQueue(
  userId: string
): Promise<IQuestionProgressDocument[]> {


  return QuestionProgress.find({

    user: userId,

    status: ProgressStatus.REVISIT,

  })
    .populate(
      'question',
      'title difficulty topic tags'
    )

    .sort({
      updatedAt: -1,
    });
}