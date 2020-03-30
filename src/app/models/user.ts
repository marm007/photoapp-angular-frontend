import {Meta} from './meta';

export interface User {
  id: number;
  username: string;
  meta: Meta;
  liked?: number[];
  posts?: number[];
  relations?: number[];
  followers?: number[];
  followed?: number[];
  first_name?: string;
  last_name?: string;
}
