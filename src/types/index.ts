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
