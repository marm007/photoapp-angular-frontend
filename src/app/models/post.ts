import { Comment } from './comment';
import { Like } from './like';
import { User } from './user';

export interface Post {
  id: string;
  image: string;
  imageLoaded: boolean;
  likes: number;
  description: string;
  user: User;
  created: Date;
  comments: Comment[];

  liked?: Like[];
  is_liked?: boolean;
}


export interface PostFilterSortModel {
  likes?: number;
  likes__gt?: number;
  likes__lt?: number;
  created?: string;
  created_after?: string;
  created_before?: string;
  ordering?: string;
}
