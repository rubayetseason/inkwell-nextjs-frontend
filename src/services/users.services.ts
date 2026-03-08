import { api } from "@/utils/axios";

export const usersApi = {
  getUser: (id: string) => api.get(`/users/${id}`),

  updateProfile: (data: any) => api.patch("/users/profile", data),

  getFollowers: (id: string) => api.get(`/users/${id}/followers`),

  getFollowing: (id: string) => api.get(`/users/${id}/following`),

  follow: (id: string) => api.post(`/users/${id}/follow`),

  unfollow: (id: string) => api.post(`/users/${id}/unfollow`),
};
