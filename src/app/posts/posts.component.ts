import { Component, OnInit } from '@angular/core';
import {Post} from '../models/post';
import {PostsService} from '../services/post/posts.service';
import * as data from '../posts_data.json';


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  posts: Post[];

  // @ts-ignore
  postsMock = data.default;

  constructor(private postService: PostsService) {
    this.postsMock.forEach((item) => {
      item.showDescription = false;
      item.showMoreComments = false;
      item.userCommentContent = '';
    });
  }

  sendValues(post: Post): void {
  }


  ngOnInit(): void {
    console.log(this.postsMock);
    // this.getPosts();
  }

  getPosts(): void {
    this.postService.getPosts()
      .subscribe(posts => this.posts = posts);
  }

}
