import {Profile} from './profile';
import {Post} from './post';
import {Relation} from './relation';

export interface UserRelations {
  id: number;
  username: string;
  profile: Profile;
  relations: Relation[];
}
