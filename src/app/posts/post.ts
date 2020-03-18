import {User} from '../user';

export interface Post {
  id: number;
  image: string;
  likes: number;
  description: string;
  user: User;
  userCommentContent: string;
}
