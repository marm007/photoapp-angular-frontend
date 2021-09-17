import { Meta } from './meta';
import { Post } from './post';

export interface UserProfile {
  id: string;
  username: string;
  meta: Meta;
  posts: Post[];
  posts_count: number;
  followers: number;
  followed: number;
  is_following: boolean;
  first_name?: string;
  last_name?: string;
}

export interface User {
  id: string;
  username: string;
  meta: Meta;
  first_name?: string;
  last_name?: string;
  is_following?: boolean;
  liked?: string[];
  posts?: string[];
  relations?: string[];
  followers?: string[];
  followed?: string[];
}
