import {User} from './user';

export interface Relation {
  id: number;
  user: User;
  image: string;
  created: Date | number | string;
}
