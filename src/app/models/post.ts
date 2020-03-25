import {User} from './user';
import {Comment} from './comment';
import {Like} from './like';

export interface Post {
  id: number;
  image: string;
  likes: number;
  description: string;
  user: User;
  liked: Like[];
  comments: Array<Comment>;
  created: Date;
}
