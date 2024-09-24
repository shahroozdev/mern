export interface User {
    username: string;
    profileImg: string;
    fullName: string;
  }
  
export  interface Comment {
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