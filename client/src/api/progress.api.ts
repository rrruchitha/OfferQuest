import api from './axios';

import type {
  ApiResponse,
  Progress,
  ProgressUpdateInput,
  ProgressListResponse,
} from '@/types';


// ─── Progress API ───────────────────────────────────────────────────────────

export const progressApi = {


  // GET /api/v1/progress

  getAll: async (): Promise<ProgressListResponse> => {

    const response = await api.get<
      ApiResponse<ProgressListResponse>
    >('/progress');


    return response.data.data;
  },



  // GET /api/v1/progress/revision

  getRevisionQueue: async (): Promise<ProgressListResponse> => {

    const response = await api.get<
      ApiResponse<ProgressListResponse>
    >('/progress/revision');


    return response.data.data;
  },



  // PATCH /api/v1/progress/:questionId

  update: async (
    questionId: string,
    data: ProgressUpdateInput
  ): Promise<Progress> => {


    const response = await api.patch<
      ApiResponse<{ progress: Progress }>
    >(
      `/progress/${questionId}`,
      data
    );


    return response.data.data.progress;
  },

};