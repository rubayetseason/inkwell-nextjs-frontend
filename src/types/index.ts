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
