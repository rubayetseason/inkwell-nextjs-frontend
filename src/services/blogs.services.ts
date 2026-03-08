import { api } from "@/utils/axios";

export const blogsApi = {
  create: (data: any) => api.post("/blogs", data),

  getFeed: (page = 1, limit = 10) =>
    api.get(`/blogs/feed?page=${page}&limit=${limit}`),

  getById: (id: string) => api.get(`/blogs/${id}`),

  update: (id: string, data: any) => api.patch(`/blogs/${id}`, data),
  delete: (id: string) => api.delete(`/blogs/${id}`),

  getByUser: (userId: string, page = 1, limit = 10) =>
    api.get(`/blogs/user/${userId}?page=${page}&limit=${limit}`),

  like: (id: string) => api.post(`/blogs/${id}/like`),

  dislike: (id: string) => api.post(`/blogs/${id}/dislike`),
};
