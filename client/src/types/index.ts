// ─── Auth ──────────────────────────────────────────────────────────────────

export interface User {
  _id: string;
  id?: string;

  name: string;
  email: string;

  avatarUrl: string | null;
  bio: string | null;

  techStack: string[];

  githubUrl: string | null;
  linkedinUrl: string | null;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}


// ─── Questions ─────────────────────────────────────────────────────────────

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  _id: string;

  title: string;
  description: string;

  difficulty: Difficulty;

  topic: string;
  tags: string[];

  createdBy: string | User;

  createdAt: string;
  updatedAt: string;
}

export interface QuestionInput {
  title: string;
  description?: string;
  difficulty: Difficulty;
  topic: string;
  tags?: string[];
}

export interface QuestionsQuery {
  search?: string;
  difficulty?: Difficulty | '';
  topic?: string;
  tags?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedQuestions {
  questions: Question[];

  total: number;
  page: number;
  pages: number;
}


// ─── Progress ──────────────────────────────────────────────────────────────

export type ProgressStatus =
  | 'SOLVED'
  | 'ATTEMPTED'
  | 'REVISIT';

export interface Progress {
  _id: string;

  user: string | User;
  question: string | Question;

  status: ProgressStatus;

  attemptCount: number;

  notes?: string;

  solvedAt?: string;

  createdAt: string;
  updatedAt: string;
}


export interface ProgressUpdateInput {
  status: ProgressStatus;
  notes?: string;
}


export interface ProgressListResponse {
  progress: Progress[];
}


// ─── Study Rooms ───────────────────────────────────────────────────────────

export interface Room {

  _id: string;

  name: string;

  description: string;

  roomCode: string;

  owner: string | User;

  participants: (string | User)[];

  currentQuestion: string | Question | null;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}


export interface CreateRoomInput {
  name: string;
  description?: string;
}


export interface JoinRoomInput {
  roomCode: string;
}


// ─── Stats ─────────────────────────────────────────────────────────────────

export interface UserStats {

  total: number;

  solved: number;

  attempted: number;

  revisit: number;

  completionRate: number;


  byDifficulty: {

    easy: {
      solved:number;
      total:number;
    };

    medium:{
      solved:number;
      total:number;
    };

    hard:{
      solved:number;
      total:number;
    };
  };


  recentActivity: ActivityEntry[];

  roomsJoined:number;
}


export interface ActivityEntry {
  date:string;
  count:number;
}


// ─── API ──────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {

  success:boolean;

  message?:string;

  data:T;
}


export interface ApiError {

  message:string;

  statusCode?:number;
}