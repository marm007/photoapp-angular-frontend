import {User} from './user';
import {Comment} from './comment';
import {Like} from './like';
import {MomentCreationData} from 'moment';

export interface Post {
  id: string;
  image: string;
  imageLoaded: boolean;
  likes: number;
  description: string;
  user: User;
  liked: Like[];
  comments: Comment[];
  created: Date;
}


export interface PostFilterSortModel {
  likes?: number;
  likes__gt?: number;
  likes__lt?: number;
  created?: string;
  created_after?: string;
  created_before?: string;
  ordering?: string;
}
