import { Meta } from "./meta";
import { Post } from "./post";
import { Relation } from "./relation";

export interface Dashboard {
    posts: Post[];
    relations: Relation[];
    id: string;
    meta: Meta;
}