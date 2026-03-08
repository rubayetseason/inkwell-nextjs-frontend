export interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  coverPhoto: string;
  bio: string;
  dateOfBirth?: string;
  followers: User[] | string[];
  following: User[] | string[];
  createdAt: string;
}

export interface Blog {
  _id: string;
  title: string;
  shortDescription: string;
  content: string;
  thumbnail: string;
  author: User;
  likes: string[];
  dislikes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  blogs: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export type KanbanColumn = 'backlog' | 'todo' | 'doing' | 'done';
export type KanbanPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface KanbanCard {
  _id: string;
  title: string;
  description: string;
  status: KanbanColumn;
  priority: KanbanPriority;
  owner: string;
  order: number;
  createdAt: string;
}
