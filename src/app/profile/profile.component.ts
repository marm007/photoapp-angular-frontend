import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { faComment, faHeart } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { Follower } from '../models/follower';
import { Post } from '../models/post';
import { UserProfile } from '../models/user';
import { MessageService } from '../services/message/message.service';
import { UserService } from '../services/user/user.service';
import { ProfileEditComponent } from './edit/edit.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  userID: string; // id of currently logged user

  userProfile: UserProfile; // Meta and data of currently visited user
  posts: Array<Post> = [];
  profileLoaded = false;
  isMorePosts = true;
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
          this.getUser(this.userProfile.id)
        } else if (myMessage === 'logged_in') {
          this.getUser(this.userProfile.id)
        }
      });
  }

  createRange(number: number) {

    return [...Array(number)];
  }

  checkIfIsMiddle(i: number) {
    const j = Math.floor(i / 3);
    return (j % 2 === 0 && i % 2 === 1) || (j % 2 !== 0 && i % 2 === 0) ? 'profile-column-middle' : 'profile-column'
  }

  ngOnInit(): void {
    this.activatedRoute.params
      .subscribe(params => {
        this.getUser(params.id);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadOnScrollProfilePosts(): void {
    if (!this.profileLoaded || !this.isMorePosts) return

    this.userService.
      listProfilePosts(this.userProfile.id, this.posts.length)
      .subscribe((posts: Post[]) => {
        this.posts = [...this.posts, ...posts];
      });
  }


  handleFollow() {
    this.userService.follow(this.userProfile.id).subscribe(res => {
      this.getUser(this.userProfile.id);
    });
  }

  handleEditProfile() {
    const dialogRef = this.dialog.open(ProfileEditComponent, {
      data: { user: this.userProfile }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userProfile = result;
      }
    });
  }
  isFollowing(): void {
    this.buttonText = this.userProfile.is_following ? 'Unfollow' : 'Follow';
  }

  getUser(id: string) {

    this.userService.getProfile(id)
      .subscribe(user => {
        if (user === null) {
          this.router.navigate(['not-found']);
          return;
        }
        this.userProfile = user;
        this.posts = user.posts;
        this.isMorePosts = user.posts.length === 12;
        this.profileLoaded = true;
        this.isFollowing();
      });
  }
}
