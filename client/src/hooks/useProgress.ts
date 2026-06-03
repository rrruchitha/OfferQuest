import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { progressApi } from '@/api/progress.api';
import { extractError } from '@/utils/format';
import type { ProgressUpdateInput } from '@/types';

export const PROGRESS_KEY = 'progress';

export function useProgress() {
  return useQuery({
    queryKey: [PROGRESS_KEY],
    queryFn: () => progressApi.getAll(),
  });
}

export function useRevisionQueue() {
  return useQuery({
    queryKey: [PROGRESS_KEY, 'revision'],
    queryFn: () => progressApi.getRevisionQueue(),
  });
}

export function useUpdateProgress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId, data }: { questionId: string; data: ProgressUpdateInput }) =>
      progressApi.update(questionId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PROGRESS_KEY] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Progress updated');
    },
    onError: (err) => toast.error(extractError(err)),
  });
}