import { User } from './user';

export interface RelationMeta {
  width: number;
  height: number;
  url: string;
}

export interface Relation {
  id: string;
  user: User;
  image_meta: RelationMeta;
  imageLoaded: boolean;
  created: Date | number | string;
  thumbnail?: string;
}
