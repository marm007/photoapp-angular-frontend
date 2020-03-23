import {User} from './user';
import {Comment} from './comment';

export interface Post {
  id: number;
  image: string;
  likes: number;
  description: string;
  user: User;
  comments: Array<Comment>;
}
