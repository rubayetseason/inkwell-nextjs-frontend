import { api } from "@/utils/axios";

export const searchApi = {
  search: (q: string, type: "all" | "users" | "blogs" = "all") =>
    api.get(`/search?q=${encodeURIComponent(q)}&type=${type}`),
};
