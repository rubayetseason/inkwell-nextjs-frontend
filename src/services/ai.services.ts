import { api } from "@/utils/axios";

export const aiApi = {
  analyzeBlog: (content: string, title: string, mode: "tldr" | "tell_more") =>
    api.post("/ai/blog/analyze", { content, title, mode }),
};
