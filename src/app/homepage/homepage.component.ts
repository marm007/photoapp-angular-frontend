import {Component, HostListener, OnInit} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {UserService} from '../user.service';
import {User, UserFull} from '../models/user';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {

  user: UserFull;

  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;

  innerWidth: any;

  constructor(private deviceService: DeviceDetectorService,
              private userService: UserService) {
    this.innerWidth = window.innerWidth;
    this.isMobile = deviceService.isMobile();
    this.isTablet = deviceService.isTablet();
    this.isDesktop = deviceService.isDesktop();
    this.getLoggedUserData();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  getLoggedUserData() {
    this.userService.getLoggedUserData().subscribe(user => {
      this.user = user;
    });
  }
}
