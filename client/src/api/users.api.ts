import api from './axios';

import type {
  ApiResponse,
  User,
  UserStats,
} from '@/types';


// ─── Users API ──────────────────────────────────────────────────────────────

export const usersApi = {


  // GET /api/v1/users/me

  getMe: async (): Promise<User> => {

    const response = await api.get<
      ApiResponse<{ user: User }>
    >('/users/me');


    return response.data.data.user;
  },



  // PATCH /api/v1/users/me

  updateMe: async (
    data: Partial<User>
  ): Promise<User> => {

    const response = await api.patch<
      ApiResponse<{ user: User }>
    >(
      '/users/me',
      data
    );


    return response.data.data.user;
  },



  // GET /api/v1/users/me/stats

  getStats: async (): Promise<UserStats> => {

    const response = await api.get<
      ApiResponse<{ stats: UserStats }>
    >('/users/me/stats');


    return response.data.data.stats;
  },



  // DELETE /api/v1/users/me

  deleteMe: async (): Promise<void> => {

    await api.delete('/users/me');

  },

};