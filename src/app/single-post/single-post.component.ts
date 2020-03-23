import {Component, Input, OnInit} from '@angular/core';
import * as data from '../posts_data.json';
import {Post} from '../models/post';
import {ActivatedRoute} from '@angular/router';
import {PostsService} from '../services/post/posts.service';
import {CommentService} from '../services/comment/comment.service';
import {Comment} from '../models/comment';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.css']
})
export class SinglePostComponent implements OnInit {

  @Input() post: Post;

  addCommentContent: string;
  showDescription = false;
  showMoreComments = false;
  addPaddingToTop: boolean;

  apiRoot = 'http://127.0.0.1:8000';

  constructor(private activatedRoute: ActivatedRoute,
              private postsService: PostsService,
              private commentService: CommentService) {
  }

  ngOnInit() {
    if (this.post == null) {
      this.addPaddingToTop = true;
      console.log("TATAGBBGBB");

      // Note: Below 'queryParams' can be replaced with 'params' depending on your requirements
      this.activatedRoute.params.subscribe(params => {
        console.log(params);
        this.getPost(params.id);
      });
    } else {
      this.addPaddingToTop = false;
      this.post.image = this.apiRoot + this.post.image;
      this.post.user.profile.photo = this.apiRoot + this.post.user.profile.photo;
    }
  }

  getPost(id: string) {
    this.postsService.getPost(id).subscribe(post => {
      this.post = post;
      this.post.image = this.apiRoot + this.post.image;
      this.post.user.profile.photo = this.apiRoot + this.post.user.profile.photo;
    });
  }

  addComment(commentText: string): void {
    const comment = {body: commentText, photo_id: this.post.id, author_name: this.post.user.username};
    this.commentService.addComment(comment).subscribe(c => {
      const commentAdded = {body: c.body, author_name: c.author_name};
      this.post.comments.push(commentAdded as Comment);
      this.addCommentContent = '';
    });
  }
}
