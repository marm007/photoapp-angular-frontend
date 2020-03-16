import {User} from './user';

export interface Photo {
  id: number;
  image: string;
  likes: number;
  description: string;
  user: User;
}
