export interface User {
  _id:string;
  username: string;
  profileImg: string;
  fullName: string;
  bio: string;
  coverImage: string;
  createdAt: Date;
  email: string;
  followers: string[];
  following: string[];
  link: string;
  profileImage: string;
  updatedAt: Date;
}

export interface Comment {
  _id: string;
  text: string;
  user: User;
}

export interface PostProps {
  _id: string;
  text: string;
  img?: string; // Optional, in case some posts don't have an image
  user: User;
  comments: Comment[];
  likes: string[]; // Array of user IDs who liked the post
}
