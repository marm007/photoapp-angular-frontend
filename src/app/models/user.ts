import { Meta } from './meta';

export interface User {
  id: string;
  username: string;
  meta: Meta;
  liked?: string[];
  posts?: string[];
  relations?: string[];
  followers?: string[];
  followed?: string[];
  first_name?: string;
  last_name?: string;
}
