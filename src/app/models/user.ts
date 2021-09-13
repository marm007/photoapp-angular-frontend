import { Meta } from './meta';

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
