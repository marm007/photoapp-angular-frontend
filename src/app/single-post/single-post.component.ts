import { Component, OnInit } from '@angular/core';
import * as data from '../posts_data.json';
import {Post} from '../posts/post';
import {ActivatedRoute} from '@angular/router';
import {PostsService} from '../posts/posts.service';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.css']
})
export class SinglePostComponent implements OnInit {
  post: Post;
  showDescription = false;
  showMoreComments = false;
  userCommentContent = '';
  apiRoot = 'http://127.0.0.1:8000';

  constructor(private activatedRoute: ActivatedRoute, private postsService: PostsService) {
  }

  ngOnInit() {
    // Note: Below 'queryParams' can be replaced with 'params' depending on your requirements
    this.activatedRoute.params.subscribe(params => {
      console.log(params);
      this.getPost(params.id);
    });
  }

  getPost(id: string) {
    this.postsService.getPost(id).subscribe(post => {
      this.post = post;
      this.post.image = this.apiRoot + this.post.image;
      this.post.user.profile.photo = this.apiRoot + this.post.user.profile.photo;
    });
  }

  sendValues(post: Post): void {
    console.log(post.userCommentContent);
  }
}
