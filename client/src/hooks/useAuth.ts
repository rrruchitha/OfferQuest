import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/auth.store';
import { useSocketStore } from '@/store/socket.store';
import { extractError } from '@/utils/format';
import type { LoginInput, RegisterInput } from '@/types';

export function useLogin() {
  const { setAuth } = useAuthStore();
  const { connect } = useSocketStore();
  const navigate = useNavigate();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: (res) => {
      setAuth(res.token, res.user);
      connect(res.token);
      qc.clear();
      navigate('/dashboard');
      toast.success(`Welcome back, ${res.user.name.split(' ')[0]}!`);
    },
    onError: (err) => {
      toast.error(extractError(err));
    },
  });
}

export function useRegister() {
  const { setAuth } = useAuthStore();
  const { connect } = useSocketStore();
  const navigate = useNavigate();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterInput) => authApi.register(data),
    onSuccess: (res) => {
      setAuth(res.token, res.user);
      connect(res.token);
      qc.clear();
      navigate('/dashboard');
      toast.success(`Account created! Welcome, ${res.user.name.split(' ')[0]}!`);
    },
    onError: (err) => {
      toast.error(extractError(err));
    },
  });
}