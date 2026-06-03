import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { usersApi } from '@/api/users.api';
import { useAuthStore } from '@/store/auth.store';
import { extractError } from '@/utils/format';
import type { User } from '@/types';

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => usersApi.getStats(),
  });
}

export function useUpdateProfile() {
  const { setUser } = useAuthStore();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<User>) => usersApi.updateMe(data),
    onSuccess: (updated) => {
      setUser(updated);
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Profile updated');
    },
    onError: (err) => toast.error(extractError(err)),
  });
}