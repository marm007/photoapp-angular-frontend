import {Profile} from './profile';
import {Post} from './post';
import {User} from './user';

export interface UserPosts {
  id: number;
  username: string;
  profile: Profile;
  posts: Post[];
}
