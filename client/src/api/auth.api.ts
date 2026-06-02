import api from './axios';

import type {
  ApiResponse,
  AuthResponse,
  LoginInput,
  RegisterInput,
} from '@/types';


// ─── Auth API ───────────────────────────────────────────────────────────────

export const authApi = {

  // POST /api/v1/auth/login
  login: async (
    credentials: LoginInput
  ): Promise<AuthResponse> => {

    const response = await api.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials
    );


    return response.data.data;
  },


  // POST /api/v1/auth/register
  register: async (
    userData: RegisterInput
  ): Promise<AuthResponse> => {

    const response = await api.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      userData
    );


    return response.data.data;
  },

};