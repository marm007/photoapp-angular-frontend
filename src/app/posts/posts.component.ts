import {Component, OnDestroy, OnInit} from '@angular/core';
import {Post} from '../models/post';
import {PostsService} from '../services/post/posts.service';
import * as data from '../posts_data.json';
import {MessageService} from '../services/message/message.service';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit, OnDestroy {

  posts: Post[] = null;

  postsLoaded = false;


  message: string;

  constructor(private postService: PostsService, private messageService: MessageService) {
    console.log('.posts');
    console.log(this.posts);

  /*  this.postsMock.forEach((item) => {
      item.showDescription = false;
      item.showMoreComments = false;
      item.userCommentContent = '';
    });*/
  }

  ngOnInit(): void {
    this.getPosts();
  }

  ngOnDestroy() {
  }

  getPosts(): void {
    this.postService.getPosts()
      .subscribe(posts => {
        this.posts = posts;
        this.postsLoaded = true;
        this.messageService.updateMessage('posts loaded');
      });
  }

}
