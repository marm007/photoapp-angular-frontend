import {Profile} from './profile';
import {Like} from './like';
import {Relation} from './relation';
import {UserFollowed} from './userFollowed';

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
  followers: UserFollowed[];
  followed: UserFollowed[];
}
