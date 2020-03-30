import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {UserService} from '../../services/user/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Post} from '../../models/post';
import {MessageService} from '../../services/message/message.service';
import {forkJoin, Observable, Subscription} from 'rxjs';
import {User} from '../../models/user';
import {mediaURL} from '../../restConfig';
import {PostsService} from '../../services/post/posts.service';
import {Follower} from '../../models/follower';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  userID: number; // id of currently logged user

  visitedUserProfile: User; // Meta and data of currently visited user
  posts: Post[][];
  profileLoaded = false;
  loopIteration: number;
  buttonText: string;
  subscription: Subscription;

  constructor(private authService: AuthService,
              private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private messageService: MessageService,
              private postsService: PostsService) {
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
      this.userService.follow(this.visitedUserProfile.id).subscribe(res => {
        console.log('RESPONSE FROM HANDLE FOLLOW');
        console.log(res);
        this.getUser(this.visitedUserProfile.id);
      });
  }

  getFollower(id: number): Observable<Follower> {
     return  this.userService.getFollower(id);
  }

  isFollowing(): void {

    console.log('LOG FROM IS FOLLOWING FROM PROFILE');
    console.log(this.userID);
    console.log(this.visitedUserProfile);

    const requests = [];

    for (const followerID of this.visitedUserProfile.followers) {
      requests.push(this.getFollower(followerID));
      console.log(followerID);
    }

    console.log('REQUEST');
    console.log(requests);
    if (requests.length === 0) {
      const flag = this.visitedUserProfile.id === this.authService.userID;
      this.serializeUserProfile(flag);
      this.profileLoaded = true;
      this.profileLoaded = true;
      this.buttonText = flag ? 'Anuluj' : 'Obserwuj';
    }

    forkJoin(requests)
      .subscribe((followers: Follower[]) => {
        if (this.visitedUserProfile.id === this.authService.userID) {
          this.serializeUserProfile(true);
          this.profileLoaded = true;
        } else {
          const flag = followers.find(follower => follower.user === this.userID) !== undefined;
          console.log('IS FOLLOWER');
          console.log(flag);
          this.serializeUserProfile(flag);
          this.profileLoaded = true;
          console.log('LOADED PROFILE');
          this.buttonText = flag ? 'Anuluj' : 'Obserwuj';
        }



      });
  }

  serializeUserProfile(isFollower: boolean) {
    console.log('VISITED USER PROFILE FROM PROFILE');
    this.posts = [];

    if (!isFollower) {
      return;
    }

    this.loopIteration = this.visitedUserProfile.posts.length / 3;
    console.log('LOOP ');
    console.log(this.visitedUserProfile.posts.length );
    console.log(this.loopIteration);
    for (let i = 0; i < this.loopIteration; i++) {
      this.posts[i] = [];
      for (let j = 0; j < 3; j++) {
        if (this.visitedUserProfile.posts[j + i * 3] !== undefined) {
          console.log(this.visitedUserProfile.posts[j + i * 3]);
          this.postsService.get(this.visitedUserProfile.posts[j + i * 3])
            .subscribe(post => {
              this.posts[i][j] = post;
            });
        }
      }
    }
  }

  getUser(id: number) {
    this.userService.get(id, false).subscribe(user => {
      if (user === null) {
        this.router.navigate(['not-found']) ;
        return;
      }
      this.visitedUserProfile = user;
      this.visitedUserProfile.meta.photo = mediaURL + this.visitedUserProfile.meta.photo;
      this.isFollowing();
    });
  }
}
