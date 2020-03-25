import {Profile} from './profile';
import {Like} from './like';
import {Relation} from './relation';
import {Followed} from './followed';

export interface User {
  id: number;
  username: string;
  profile: Profile;
}

export interface UserFull {
  id: number;
  username: string;
  profile: Profile;
  liked: Like[];
  relations: Relation[];
  followers: Followed[];
  followed: Followed[];
}
