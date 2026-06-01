import {
  User,
  IUserDocument,
} from '../../models/User.model';


import {
  QuestionProgress,
  ProgressStatus,
} from '../../models/QuestionProgress.model';


import {
  Question,
  Difficulty,
} from '../../models/Question.model';


import { StudyRoom } from '../../models/StudyRoom.model';

import { ApiError } from '../../utils/ApiError';

import { UpdateProfileInput } from './user.schema';


// ─── Stats Types ──────────────────────────────────────────────────────────────


export interface DifficultyStats {
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}


export interface RecentActivity {
  questionId: string;
  questionTitle: string;
  status: string;
  updatedAt: Date;
}


export interface UserStats {

  totalQuestions: number;

  solvedQuestions: number;

  attemptedQuestions: number;

  revisitQuestions: number;

  completionPercentage: number;

  difficultyStats: DifficultyStats;

  roomsJoined: number;

  recentActivity: RecentActivity[];

}


// ─── Get Profile ──────────────────────────────────────────────────────────────


export async function getProfile(
  userId: string
): Promise<IUserDocument> {


  const user =
    await User.findById(userId);


  if (
    !user ||
    !user.isActive
  ) {

    throw ApiError.notFound(
      'User not found'
    );

  }


  return user;
}


// ─── Update Profile ───────────────────────────────────────────────────────────


export async function updateProfile(

  userId: string,

  input: UpdateProfileInput

): Promise<IUserDocument> {


  const user =
    await User.findById(userId);


  if (
    !user ||
    !user.isActive
  ) {

    throw ApiError.notFound(
      'User not found'
    );

  }


  const updated =
    await User.findByIdAndUpdate(

      userId,

      {
        $set: input,
      },

      {
        new: true,
        runValidators: true,
      }

    );


  if (!updated) {

    throw ApiError.internal(
      'Failed to update profile'
    );

  }


  return updated;

}


// ─── Soft Delete Account ──────────────────────────────────────────────────────


export async function deactivateAccount(
  userId: string
): Promise<void> {


  const user =
    await User.findById(userId);


  if (
    !user ||
    !user.isActive
  ) {

    throw ApiError.notFound(
      'User not found'
    );

  }


  await User.findByIdAndUpdate(

    userId,

    {
      $set: {
        isActive: false,
      },
    }

  );

}


// ─── Dashboard Stats ──────────────────────────────────────────────────────────


export async function getUserStats(
  userId: string
): Promise<UserStats> {


  const [

    totalQuestions,

    allProgress,

    roomsJoined,

    recentProgressRecords,

  ] = await Promise.all([


    Question.countDocuments(),


    QuestionProgress
      .find({
        user: userId,
      })
      .populate(
        'question',
        'title difficulty'
      ),


    StudyRoom.countDocuments({
      participants: userId,
      isActive: true,
    }),


    QuestionProgress
      .find({
        user: userId,
      })
      .populate(
        'question',
        'title difficulty'
      )
      .sort({
        updatedAt: -1,
      })
      .limit(5),

  ]);


  let solvedQuestions = 0;

  let attemptedQuestions = 0;

  let revisitQuestions = 0;


  let easySolved = 0;

  let mediumSolved = 0;

  let hardSolved = 0;



  for (const record of allProgress) {


    const question =
      record.question as unknown as {
        difficulty?: Difficulty;
      };


    if (
      record.status ===
      ProgressStatus.SOLVED
    ) {

      solvedQuestions++;


      if (
        question?.difficulty ===
        Difficulty.EASY
      ) {
        easySolved++;
      }


      if (
        question?.difficulty ===
        Difficulty.MEDIUM
      ) {
        mediumSolved++;
      }


      if (
        question?.difficulty ===
        Difficulty.HARD
      ) {
        hardSolved++;
      }

    }


    else if (
      record.status ===
      ProgressStatus.ATTEMPTED
    ) {

      attemptedQuestions++;

    }


    else if (
      record.status ===
      ProgressStatus.REVISIT
    ) {

      revisitQuestions++;

    }

  }



  const completionPercentage =
    totalQuestions > 0

      ? Math.round(
          (
            solvedQuestions /
            totalQuestions
          ) * 100
        )

      : 0;



  const recentActivity =
    recentProgressRecords.map(
      (record) => {


        const question =
          record.question as unknown as {
            _id: string;
            title: string;
          };


        return {

          questionId:
            question?._id?.toString()
            ?? '',


          questionTitle:
            question?.title
            ?? 'Unknown',


          status:
            record.status,


          updatedAt:
            record.updatedAt,

        };

      }
    );



  return {

    totalQuestions,

    solvedQuestions,

    attemptedQuestions,

    revisitQuestions,

    completionPercentage,


    difficultyStats: {

      easySolved,

      mediumSolved,

      hardSolved,

    },


    roomsJoined,


    recentActivity,

  };

}