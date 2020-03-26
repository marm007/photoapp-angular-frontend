import { Component, OnInit } from '@angular/core';
import * as data from '../profile_data.json';
import {AuthService} from '../services/auth/auth.service';
import {UserService} from '../services/user/user.service';
import {ActivatedRoute} from '@angular/router';
import {Profile} from '../models/profile';
import {UserFull} from '../models/user';
import {UserPosts} from '../models/userPosts';
import {Post, PostNoUser} from '../models/post';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private url = 'http://127.0.0.1:8000';

  userID: number; // id of currently logged user

  profile: UserFull; // Profile of currently visited user
  posts: PostNoUser[][];
  profileLoaded = false;
  // @ts-ignore
  /*profile = data.default[0];*/

  loopIteration: number;

  profileUrls: Array<Array<number>>;

  constructor(private authService: AuthService,
              private userService: UserService,
              private activatedRoute: ActivatedRoute) {
    this.userID = authService.userID;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.getUser(params.id);
    });
  }

  getUser(id: number) {
    this.userService.getUser(id).subscribe(user => {
      this.profile = user;
      console.log('adladldlaldaldallda');
      console.log(user);
      this.profile.profile.photo = this.url + this.profile.profile.photo;
      this.loopIteration = this.profile.posts.length / 3;
      this.posts = [];
      for (let i = 0; i < this.loopIteration; i++) {
        this.posts[i] = [];
        for (let j = 0; j < 3; j++) {
          if (this.profile.posts[j + i * 3] !== undefined) {
            console.log(this.profile.posts[j + i * 3]);
            this.posts[i][j] = this.profile.posts[j + i * 3];
            this.posts[i][j].image = this.url + this.posts[i][j].image;
          }
        }
      }
      this.profileLoaded = true;
    });
  }
}
