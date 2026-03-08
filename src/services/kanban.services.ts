import { api } from "@/utils/axios";

export const kanbanApi = {
  getBoard: () => api.get("/kanban/board"),

  createCard: (data: any) => api.post("/kanban/cards", data),

  updateCard: (id: string, data: any) => api.patch(`/kanban/cards/${id}`, data),

  deleteCard: (id: string) => api.delete(`/kanban/cards/${id}`),

  aiMove: (instruction: string) => api.post("/kanban/ai-move", { instruction }),
};