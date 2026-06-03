import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { questionsApi } from '@/api/questions.api';
import { extractError } from '@/utils/format';
import type { QuestionInput, QuestionsQuery } from '@/types';

export const QUESTIONS_KEY = 'questions';

export function useQuestions(params?: QuestionsQuery) {
  return useQuery({
    queryKey: [QUESTIONS_KEY, params],
    queryFn: () => questionsApi.getAll(params),
  });
}

export function useQuestion(id: string) {
  return useQuery({
    queryKey: [QUESTIONS_KEY, id],
    queryFn: () => questionsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: QuestionInput) => questionsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUESTIONS_KEY] });
      toast.success('Question created');
    },
    onError: (err) => toast.error(extractError(err)),
  });
}

export function useUpdateQuestion(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<QuestionInput>) => questionsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUESTIONS_KEY] });
      toast.success('Question updated');
    },
    onError: (err) => toast.error(extractError(err)),
  });
}

export function useDeleteQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => questionsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUESTIONS_KEY] });
      toast.success('Question deleted');
    },
    onError: (err) => toast.error(extractError(err)),
  });
}