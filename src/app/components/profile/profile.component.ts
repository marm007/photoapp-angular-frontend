import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {UserService} from '../../services/user/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserFull} from '../../models/user';
import {Post, PostNoUser} from '../../models/post';
import {MessageService} from '../../services/message/message.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private url = 'http://127.0.0.1:8000';

  userID: number; // id of currently logged user

  visitedUserProfile: UserFull; // Profile and data of currently visited user
  posts: PostNoUser[][];
  profileLoaded = false;
  loopIteration: number;
  buttonText: string;
  subscription: Subscription;

  constructor(private authService: AuthService,
              private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private messageService: MessageService) {
    this.userID = authService.userID;
    console.log('CURRENTLY LOGGED IN USER ID FROM PROFILE');
    console.log(this.userID);
    this.subscription = this.messageService.getMessage()
      .subscribe(myMessage => {
        if (myMessage === 'logged_out') {
          console.log(myMessage);
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
      this.getUser(params.id);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  handleFollow() {
    if (this.isFollowing()) {
      this.userService.unfollow(this.getFollowIndex()).subscribe(res => {
        console.log('RESPONSE FROM HANDLE UNFOLLOW');
        console.log(res);
        this.userService.getUser(this.visitedUserProfile.id).subscribe(user => {
          console.log('RESPONSE FROM HANDLE UNFOLLOW GET USER');
          console.log(user);
          this.serializeGetUser(user);
          this.isFollowing();
        });

      });
    } else {
      this.userService.follow(this.visitedUserProfile.id).subscribe(res => {
        console.log('RESPONSE FROM HANDLE FOLLOW');
        console.log(res);
        this.userService.getUser(this.visitedUserProfile.id).subscribe(user => {
          console.log('RESPONSE FROM HANDLE FOLLOW GET USER');
          console.log(user);
          this.serializeGetUser(user);
          this.isFollowing();

        });

      });
    }
  }

  isFollowing(): boolean {
    console.log('LOG FROM IS FOLLOWING FROM PROFILE')
    console.log(this.userID)
    console.log(this.visitedUserProfile.followers.filter(follower => follower.follower === this.userID))
    const flag = this.visitedUserProfile.followers.find(follower => follower.follower === this.userID) !== undefined;
    this.buttonText = flag ? 'Anuluj' : 'Obserwuj';
    return flag;
  }

  getFollowIndex(): number {
    return this.visitedUserProfile.followers.find(follower => follower.follower === this.userID).id;
  }

  serializeGetUser(user: UserFull) {
    this.visitedUserProfile = user;
    console.log('VISITED USER PROFILE FROM PROFILE');

    this.visitedUserProfile.profile.photo = this.url + this.visitedUserProfile.profile.photo;
    this.loopIteration = this.visitedUserProfile.posts.length / 3;
    this.posts = [];
    for (let i = 0; i < this.loopIteration; i++) {
      this.posts[i] = [];
      for (let j = 0; j < 3; j++) {
        if (this.visitedUserProfile.posts[j + i * 3] !== undefined) {
          console.log(this.visitedUserProfile.posts[j + i * 3]);
          this.posts[i][j] = this.visitedUserProfile.posts[j + i * 3];
          this.posts[i][j].image = this.url + this.posts[i][j].image;
        }
      }
    }
  }

  getUser(id: number) {
    this.userService.getUser(id).subscribe(user => {
      if (user === null) {
        this.router.navigate(['not-found']) ;
        return;
      }
      this.serializeGetUser(user);
      this.isFollowing();
      this.profileLoaded = true;
    });
  }
}
