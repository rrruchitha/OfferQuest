import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { roomsApi } from '@/api/rooms.api';
import { extractError } from '@/utils/format';
import type { CreateRoomInput, JoinRoomInput } from '@/types';

export const ROOMS_KEY = 'rooms';

export function useRooms() {
  return useQuery({
    queryKey: [ROOMS_KEY],
    queryFn: () => roomsApi.getAll(),
  });
}

export function useRoom(id: string) {
  return useQuery({
    queryKey: [ROOMS_KEY, id],
    queryFn: () => roomsApi.getById(id),
    enabled: !!id,
    refetchInterval: 5000,
  });
}

export function useCreateRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRoomInput) => roomsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ROOMS_KEY] });
      toast.success('Room created!');
    },
    onError: (err) => toast.error(extractError(err)),
  });
}

export function useJoinRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: JoinRoomInput) => roomsApi.join(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ROOMS_KEY] });
      toast.success('Joined room!');
    },
    onError: (err) => toast.error(extractError(err)),
  });
}

export function useLeaveRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (roomId: string) => roomsApi.leave(roomId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ROOMS_KEY] });
      toast.success('Left room');
    },
    onError: (err) => toast.error(extractError(err)),
  });
}

export function useSetActiveQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ roomId, questionId }: { roomId: string; questionId: string }) =>
      roomsApi.setActiveQuestion(roomId, questionId),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: [ROOMS_KEY, vars.roomId] });
    },
    onError: (err) => toast.error(extractError(err)),
  });
}