import api from './axios';

import type {
  ApiResponse,
  Room,
  CreateRoomInput,
  JoinRoomInput,
} from '@/types';


// ─── Rooms API ──────────────────────────────────────────────────────────────

export const roomsApi = {


  // GET /api/v1/rooms

  getAll: async (): Promise<Room[]> => {

    const response = await api.get<
      ApiResponse<{
        rooms: Room[];
        count: number;
      }>
    >('/rooms');


    return response.data.data.rooms;
  },



  // GET /api/v1/rooms/:id

  getById: async (
    id: string
  ): Promise<Room> => {

    const response = await api.get<
      ApiResponse<{
        room: Room;
      }>
    >(`/rooms/${id}`);


    return response.data.data.room;
  },



  // POST /api/v1/rooms

  create: async (
    data: CreateRoomInput
  ): Promise<Room> => {

    const response = await api.post<
      ApiResponse<{
        room: Room;
      }>
    >(
      '/rooms',
      data
    );


    return response.data.data.room;
  },



  // POST /api/v1/rooms/join

  join: async (
    data: JoinRoomInput
  ): Promise<Room> => {

    const response = await api.post<
      ApiResponse<{
        room: Room;
      }>
    >(
      '/rooms/join',
      data
    );


    return response.data.data.room;
  },



  // PATCH /api/v1/rooms/:id/question

  setActiveQuestion: async (
    roomId: string,
    questionId: string
  ): Promise<Room> => {


    const response = await api.patch<
      ApiResponse<{
        room: Room;
      }>
    >(
      `/rooms/${roomId}/question`,
      {
        questionId,
      }
    );


    return response.data.data.room;
  },



  // DELETE /api/v1/rooms/:id/leave

  leave: async (
    roomId: string
  ): Promise<void> => {

    await api.delete(
      `/rooms/${roomId}/leave`
    );

  },

};