import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { faHeart as faHeartNoBorder } from '@fortawesome/free-regular-svg-icons';
import { faEllipsisH, faHeart, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService } from '../../auth/services/auth.service';
import { Post } from '../../models/post';
import { CommentService } from '../../services/comment/comment.service';
import { PostsService } from '../../services/post/posts.service';

@Component({
  selector: 'app-post',
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
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class PostDetailComponent implements OnInit {

  MAX_DESCRIPTION_WORDS = 10;

  @Input()
  post: Post | null;

  @Input()
  userID: string;

  @Output()
  postDeleted: EventEmitter<Post> = new EventEmitter<Post>();

  @HostBinding('@like')
  public likeTrigger = false;

  moreIcon = faEllipsisH;
  likeIcon = faHeart;
  likeNoBorderIcon = faHeartNoBorder;

  isHomePage: boolean;

  showMoreDescription = false;
  showDescription = false; // delete (?)

  addCommentContent: string;

  isDesktop: boolean;

  constructor(private activatedRoute: ActivatedRoute,
    private postsService: PostsService,
    private commentService: CommentService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private deviceDetectorService: DeviceDetectorService) {
    this.isDesktop = deviceDetectorService.isDesktop();
  }

  handleDelete() {
    this.postsService.delete(String(this.post.id))
      .subscribe(res => {
        if (res === null) {
          if (this.router.url === '/') {
            this.postDeleted.emit(this.post);
          }
          this.router.navigate(['']);
        }
      }, err => {

      });
  }

  handleEdit() {
    this.router.navigate([`edit/${this.post.id}`]);
  }

  handleSee() {
    this.router.navigate(['/post/'.concat(String(this.post.id))]);
  }

  ngOnInit() {

    if (!this.userID) this.userID = this.authService.userID;

    if (!this.post) {
      this.isHomePage = false;
      this.activatedRoute.params.
        subscribe(params => {
          this.getPost(params.id);
        });
    } else {
      this.isHomePage = true;
      this.showMoreDescription = this.post.description.split(' ').length > this.MAX_DESCRIPTION_WORDS;
    }

  }

  get isLiked(): boolean {
    return this.post && this.post.is_liked;
  }

  get isOwner(): boolean {
    return this.post && this.post.user.id === this.authService.userID;
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

  getPost(id: number) {
    this.postsService.get(id)
      .subscribe(post => {
        if (post !== null) {
          this.showMoreDescription = post.description.split(' ').length > this.MAX_DESCRIPTION_WORDS;
          this.post = post;
        } else { this.router.navigate(['not-found']); }
      }, error => {
        if (error.status === 403) {
          this.router.navigate(['forbidden']);
          this.snackBar.open(error.error.detail, null, {
            duration: 1500,
          });
        }
      });
  }

  likePost(id: string, buttonClicked?: boolean) {
    if (buttonClicked !== true) {
      if (!this.isLiked) {
        this.postsService.like(id)
          .subscribe(post => {
            if (post !== null) {
              this.post.is_liked = post.is_liked;
              this.post.likes = post.likes;
              this.post.comments = post.comments;
            }
          });
      }
    } else {
      this.postsService.like(id).
        subscribe(post => {
          if (post !== null) {
            this.post.is_liked = post.is_liked;
            this.post.likes = post.likes;
            this.post.comments = post.comments;
          }
        });
    }

  }

  addComment(commentText: string): void {
    const comment = { body: commentText, post: this.post.id, author_name: this.post.user.username };
    this.commentService.addComment(comment).subscribe(newComment => {
      this.post.comments.push(newComment);
      this.addCommentContent = '';
    });
  }

}
