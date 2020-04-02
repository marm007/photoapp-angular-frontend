import {Component, HostListener, OnInit} from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {User} from '../../models/user';
import {Follower} from '../../models/follower';
import {AuthService} from '../../services/auth/auth.service';
import {ImageType, prepareImage} from '../../restConfig';
import {forkJoin, Observable} from 'rxjs';
import {faEllipsisH, faFilter} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit{

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
    this.userService.get(this.authService.userID).subscribe(user => {
      user.meta.avatar = prepareImage(user.meta.avatar);
      this.user = user;
      const requests = [];
      console.log(this.user)
      for (const followedID of this.user.followed) {
        requests.push(
          this.getFollower(followedID));
      }
      if (requests.length === 0) {
        this.followed = [];
      }
      forkJoin(requests)
        .subscribe((followed: Follower[]) => {
          this.followed = followed;
        });
    });
  }
}
