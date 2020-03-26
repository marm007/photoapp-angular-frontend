import {Profile} from './profile';
import {Like} from './like';
import {Relation} from './relation';
import {UserFollowed} from './userFollowed';
import {Post, PostNoUser} from './post';
import {UserPosts} from './userPosts';

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
  posts: PostNoUser[];
  relations: Relation[];
  followers: UserFollowed[];
  followed: UserFollowed[];
}
