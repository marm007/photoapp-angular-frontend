import {User} from './user';

export interface Relation {
  id: number;
  user: User;
  image: string;
  imageLoaded: boolean;
  created: Date | number | string;
}
