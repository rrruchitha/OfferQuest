import api from './axios';

import type {
  ApiResponse,
  Question,
  QuestionInput,
  QuestionsQuery,
  PaginatedQuestions,
} from '@/types';


// ─── Questions API ──────────────────────────────────────────────────────────

export const questionsApi = {


  // GET /api/v1/questions

  getAll: async (
    params?: QuestionsQuery
  ): Promise<PaginatedQuestions> => {

    const response = await api.get<
      ApiResponse<PaginatedQuestions>
    >(
      '/questions',
      { params }
    );


    return response.data.data;
  },



  // GET /api/v1/questions/:id

  getById: async (
    id: string
  ): Promise<Question> => {

    const response = await api.get<
      ApiResponse<{ question: Question }>
    >(`/questions/${id}`);


    return response.data.data.question;
  },



  // POST /api/v1/questions

  create: async (
    data: QuestionInput
  ): Promise<Question> => {

    const response = await api.post<
      ApiResponse<{ question: Question }>
    >(
      '/questions',
      data
    );


    return response.data.data.question;
  },



  // PATCH /api/v1/questions/:id

  update: async (
    id: string,
    data: Partial<QuestionInput>
  ): Promise<Question> => {

    const response = await api.patch<
      ApiResponse<{ question: Question }>
    >(
      `/questions/${id}`,
      data
    );


    return response.data.data.question;
  },



  // DELETE /api/v1/questions/:id

  delete: async (
    id: string
  ): Promise<void> => {

    await api.delete(`/questions/${id}`);

  },

};