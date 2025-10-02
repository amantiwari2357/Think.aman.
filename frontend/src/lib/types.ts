
// Post related types
export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  industry: string;
  type: 'meme' | 'joke' | 'information';
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  likes: number;
  comments: Comment[];
  isArchived?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}
