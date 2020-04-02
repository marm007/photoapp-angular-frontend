import {User} from './user';

export interface Relation {
  id: string;
  user: User;
  image: string;
  imageLoaded: boolean;
  created: Date | number | string;
}
