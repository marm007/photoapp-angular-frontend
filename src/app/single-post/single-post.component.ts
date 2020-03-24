import {Component, HostBinding, HostListener, Input, OnInit} from '@angular/core';
import {Post} from '../models/post';
import {ActivatedRoute} from '@angular/router';
import {PostsService} from '../services/post/posts.service';
import {CommentService} from '../services/comment/comment.service';
import {Comment} from '../models/comment';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import {animate, query, stagger, state, style, transition, trigger} from '@angular/animations';
import {AuthService} from '../services/auth/auth.service';
import {Like} from '../models/like';

@Component({
  selector: 'app-single-post',
  animations: [
    trigger('like', [
      transition(':increment', [
        query(':enter', [
          style({ opacity: 0, width: '0px' }),
          stagger(50, [
            animate('3000ms ease-out', style({ opacity: 1, width: '*' })),
          ]),
        ], { optional: true })
      ]),
      transition(':decrement', [
        query(':leave', [
          stagger(50, [
            animate('3000ms ease-out', style({ opacity: 0, width: '0px' })),
          ]),
        ])
      ]),
    ]),
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ]),
  ],
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.css']
})
export class SinglePostComponent implements OnInit {

  @Input() post: Post;
  @HostBinding('@like')
  public likeTrigger = false;

  addCommentContent: string;
  showDescription = false;
  showMoreComments = false;
  addPaddingToTop: boolean;

  likeIcon = faHeart;


  apiRoot = 'http://127.0.0.1:8000';

  constructor(private activatedRoute: ActivatedRoute,
              private postsService: PostsService,
              private commentService: CommentService,
              private authService: AuthService) {
  }



  ngOnInit() {
    if (this.post == null) {
      this.addPaddingToTop = true;
      this.activatedRoute.params.subscribe(params => {
        this.getPost(params.id);
      });
    } else {
      this.addPaddingToTop = false;
      this.post.image = this.apiRoot + this.post.image;
      this.post.user.profile.photo = this.apiRoot + this.post.user.profile.photo;
    }

  }

  get isLiked(): boolean {
    return this.post.liked.some(like => like.user_id === this.authService.userId);
  }

  handleClick(buttonClicked?: boolean) {
    if (this.likeTrigger === false && buttonClicked !== true) {
      this.likeTrigger = true;
      this.likePost(String(this.post.id), buttonClicked);
      setTimeout(() => this.likeTrigger = false, 800);
    } else {
      this.likePost(String(this.post.id), buttonClicked);
    }
  }

  getPost(id: string) {
    this.postsService.getPost(id).subscribe(post => {
      this.post = post;
      this.post.image = this.apiRoot + this.post.image;
      this.post.user.profile.photo = this.apiRoot + this.post.user.profile.photo;
    });
  }

  likePost(id: string, buttonClicked?: boolean) {
    if (buttonClicked !== true) {
      if (!this.isLiked) {
        console.log('addadadaad');
        console.log(this.authService.userId);
        this.postsService.likePost(id).subscribe(post => {
          this.post = post;
          this.post.image = this.apiRoot + this.post.image;
          this.post.user.profile.photo = this.apiRoot + this.post.user.profile.photo;
        });
      }
    } else {
      this.postsService.likePost(id).subscribe(post => {
        this.post = post;
        this.post.image = this.apiRoot + this.post.image;
        this.post.user.profile.photo = this.apiRoot + this.post.user.profile.photo;
      });
    }

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
