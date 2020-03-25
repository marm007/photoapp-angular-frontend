import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../services/auth/auth.service';
import {LoginComponent} from '../login/login.component';
import {Router} from '@angular/router';
import {UserService} from '../user.service';
import {User} from '../models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;

  user: User;
  isLogged: boolean;

  constructor(private deviceService: DeviceDetectorService,
              public dialog: MatDialog,
              public authService: AuthService,
              public router: Router,
              private userService: UserService) {
    this.isMobile = deviceService.isMobile();
    this.isTablet = deviceService.isTablet();
    this.isDesktop = deviceService.isDesktop();
    this.isLogged = this.authService.isLoggedIn();
    this.getLoggedUserData();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '600px',
      height: '500px',
      id: 'login'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'logged_in') {
        this.isLogged = true;
        this.getLoggedUserData();
      }
    });
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.authService.logout();
    this.isLogged = false;
    this.user = null;
    if (this.router.url === '/') {
      this.router.navigate(['login']);
    }
  }

  getLoggedUserData() {
    this.userService.getLoggedUserData().subscribe(user => {
      this.user = user;
    });
  }
}
