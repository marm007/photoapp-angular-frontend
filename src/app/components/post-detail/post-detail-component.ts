import {Component, EventEmitter, HostBinding, HostListener, Input, OnInit, Output} from '@angular/core';
import {Post} from '../../models/post';
import {ActivatedRoute, Router} from '@angular/router';
import {PostsService} from '../../services/post/posts.service';
import {CommentService} from '../../services/comment/comment.service';
import {faEllipsisH, faHeart, faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import {animate, query, stagger, state, style, transition, trigger} from '@angular/animations';
import {AuthService} from '../../services/auth/auth.service';
import {ImageType, prepareImage} from '../../restConfig';
import {environment} from '../../../environments/environment';
import {DeviceDetectorService} from 'ngx-device-detector';

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
  templateUrl: './post-detail-component.html',
  styleUrls: ['./post-detail-component.css']
})
export class PostDetailComponent implements OnInit {

  MAX_DESCRIPTION_WORDS = 10;

  @Input()
  post: Post;

  @Input()
  userID: string;

  @Output()
  postDeleted: EventEmitter<Post> = new EventEmitter<Post>();

  @HostBinding('@like')
  public likeTrigger = false;

  moreIcon = faEllipsisH;
  likeIcon = faHeart;
  faCircle = faPlusCircle;

  isPostOwner: boolean;
  addPaddingToTop: boolean;

  showMoreDescription = false;
  showDescription = false;
  showMoreComments = false;

  addCommentContent: string;

  isDesktop: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private postsService: PostsService,
              private commentService: CommentService,
              private authService: AuthService,
              private router: Router,
              private deviceDetectorService: DeviceDetectorService) {
    this.isDesktop = deviceDetectorService.isDesktop();
    console.log(this.isDesktop);
  }

  handleImageLoaded(post: Post) {
    if (post.imageLoaded) {
      return;
    }

    post.image = post.image.replace(ImageType.THUMBNAIL, '');
    post.image = prepareImage(post.image, ImageType.LARGE);
    post.imageLoaded = true;
  }

  handleDelete() {
    this.postsService.delete(String(this.post.id)).subscribe(res => {
      if (res === null) {
        if (this.router.url === '/') {
          this.postDeleted.emit(this.post);
        }
        this.router.navigate(['']);
      }
    });
  }

  handleEdit() {
      this.router.navigate([`edit/${this.post.id}`]);
  }

  handleSee() {
    this.router.navigate(['/post/'.concat(String(this.post.id))]);
  }

  ngOnInit() {

    if (this.userID === undefined) {
      this.userID = this.authService.userID;
    }

    if (this.post == null) {
      this.addPaddingToTop = true;
      this.activatedRoute.params.subscribe(params => {
        this.getPost(params.id);
      });
    } else {
      this.isPostOwner = this.post.user.id === this.authService.userID;
      this.addPaddingToTop = false;
      this.showMoreDescription = this.post.description.split(' ').length > this.MAX_DESCRIPTION_WORDS;
    }

  }
//
  get isLiked(): boolean {
    return this.post.liked.some(like => like.user === this.userID);
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
    this.postsService.get(id).subscribe(post => {
      if (post !== null) {
        this.showMoreDescription = post.description.split(' ').length > this.MAX_DESCRIPTION_WORDS;
        post.user.meta.avatar = prepareImage(post.user.meta.avatar);
        post.image = prepareImage(post.image);
        this.post = post;
        this.isPostOwner = this.post.user.id === this.authService.userID;
      } else { this.router.navigate(['not-found']); }
    });
  }

  likePost(id: string, buttonClicked?: boolean) {
    if (buttonClicked !== true) {
      if (!this.isLiked) {
        this.postsService.like(id).subscribe(post => {
          if (post !== null) {
            post.user.meta.avatar = prepareImage(post.user.meta.avatar);
            post.image = prepareImage(post.image);
            this.post = post;
          }
        });
      }
    } else {
      this.postsService.like(id).subscribe(post => {
        if (post !== null) {
          post.user.meta.avatar = prepareImage(post.user.meta.avatar);
          post.image = prepareImage(post.image);
          this.post = post;
        }
      });
    }

  }

  addComment(commentText: string): void {
    const comment = {body: commentText, post: this.post.id, author_name: this.post.user.username};
    this.commentService.addComment(comment).subscribe(newComment => {
      this.post.comments.push(newComment);
      this.addCommentContent = '';
    });
  }

  handleCommentDelete(id: string) {
    this.commentService.delete(id).subscribe(res => {
      const comment = this.post.comments.find(c => c.id === id);
      const index = this.post.comments.indexOf(comment);
      console.log(index);
      this.post.comments.splice(index, 1);
    }, error => {

    });
  }
}
