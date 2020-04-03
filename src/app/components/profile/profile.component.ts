import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {UserService} from '../../services/user/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Post} from '../../models/post';
import {MessageService} from '../../services/message/message.service';
import {forkJoin, Observable, Subscription} from 'rxjs';
import {User} from '../../models/user';
import {ImageType, prepareImage} from '../../restConfig';
import {PostsService} from '../../services/post/posts.service';
import {Follower} from '../../models/follower';
import {environment} from '../../../environments/environment';
import {faComment, faHeart} from '@fortawesome/free-solid-svg-icons';
import {MatDialog} from '@angular/material/dialog';
import {ProfileEditComponent} from '../profile-edit/profile-edit.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  userID: string; // id of currently logged user

  visitedUserProfile: User; // Meta and data of currently visited user
  posts: Array<Array<Post>> = [];
  profileLoaded = false;
  postsLoaded = false;
  loopIteration: number;
  buttonText: string;
  subscription: Subscription;
  faComment = faComment;
  faLike = faHeart;

  constructor(private authService: AuthService,
              private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private messageService: MessageService,
              private dialog: MatDialog) {
    this.userID = authService.userID;
    this.posts = [];
    this.subscription = this.messageService.getMessage()
      .subscribe(myMessage => {
        if (myMessage === 'logged_out') {
          this.userID = authService.userID;
          this.isFollowing();
        } else if (myMessage === 'logged_in') {
          this.userID = authService.userID;
          this.isFollowing();
        }
      });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.posts = [];
      this.getUser(params.id);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  listProfilePosts(offset?: number): void {
    this.userService.listProfilePosts(this.visitedUserProfile.id, offset)
      .subscribe((posts: Post[]) => {
        posts.forEach(post => {
          // post.user.meta.avatar = prepareImage(post.user.meta.avatar);
          post.image = prepareImage(post.image);

        });
        this.serializeUserProfile(posts);
      });
  }

  handleImageLoaded(post: Post) {
    if (post.imageLoaded) {
      return;
    }
    post.image = post.image.replace(environment.mediaURL, '').replace(ImageType.THUMBNAIL, '');
    post.image = prepareImage(post.image, ImageType.LARGE);
    post.imageLoaded = true;
  }

  handleFollow() {
      this.userService.follow(this.visitedUserProfile.id).subscribe(res => {
        this.getUser(this.visitedUserProfile.id);
      });
  }

  handleEditProfile() {
    const dialogRef = this.dialog.open(ProfileEditComponent, {
      data: {user: this.visitedUserProfile}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.visitedUserProfile = result;
      }
    });
  }

  getFollower(id: string): Observable<Follower> {
     return  this.userService.getFollower(id);
  }

  isFollowing(): void {
    this.posts = [];
    const requests = [];

    for (const followerID of this.visitedUserProfile.followers) {
      requests.push(this.getFollower(followerID));
    }

    if (requests.length === 0) {
      const flag = this.visitedUserProfile.id === this.authService.userID;
      if (flag) {
        this.listProfilePosts();
      }
      this.postsLoaded = true;
      this.buttonText = flag ? 'Unfollow' : 'Follow';
    }

    forkJoin(requests)
      .subscribe((followers: Follower[]) => {
        if (this.visitedUserProfile.id === this.authService.userID) {
          this.listProfilePosts();
        } else {
          const flag = followers.find(follower => follower.user === this.userID) !== undefined;
          this.postsLoaded = true;
          if (flag) {
            this.listProfilePosts();
          }
          this.buttonText = flag ? 'Unfollow' : 'Follow';
        }
      });
  }

  serializeUserProfile(posts: Post[]) {
    this.loopIteration = posts.length / 3;
    for (let i = 0; i < this.loopIteration; i++) {
      const postsArray = Array<Post>();

      for (let j = 0; j < 3; j++) {
        if (posts[j + i * 3] !== undefined) {
          postsArray[j] = posts[j + i * 3];
        }
      }
      this.posts.push(postsArray);
    }
  }

  getUser(id: string) {
    this.userService.get(id, false).subscribe(user => {
      if (user === null) {
        this.router.navigate(['not-found']) ;
        return;
      }
      user.meta.avatar = prepareImage(user.meta.avatar);
      this.visitedUserProfile = user;
      this.profileLoaded = true;
      this.isFollowing();
    });
  }
}
