import { Component, HostListener, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { Follower } from '../models/follower';
import { User } from '../models/user';
import { prepareImage } from '../restConfig';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomepageComponent implements OnInit {

  followed: Follower[];

  user: User;

  componentLoaded = false;

  innerWidth: any;

  constructor(private userService: UserService,
    private authService: AuthService) {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit() {
    this.getLoggedUserData();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  onComponentLoaded() {
    this.componentLoaded = true;
  }

  getFollower(id: string): Observable<Follower> {
    return this.userService.getFollower(id);
  }

  getLoggedUserData() {
    this.userService.get(this.authService.userID)
      .subscribe(user => {
        user.meta.avatar = prepareImage(user.meta.avatar);
        this.user = user;
      });
  }
}
