import {Component, OnDestroy, OnInit} from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../services/auth/auth.service';
import {LoginComponent} from '../login/login.component';
import {Router} from '@angular/router';
import {UserService} from '../services/user/user.service';
import {User} from '../models/user';
import {MessageService} from '../services/message/message.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private url = 'http://127.0.0.1:8000';

  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;

  user: User;
  isLogged: boolean;
  messageSubscription: Subscription;

  constructor(private deviceService: DeviceDetectorService,
              public dialog: MatDialog,
              public authService: AuthService,
              public router: Router,
              private userService: UserService,
              private messageService: MessageService) {
    this.isMobile = deviceService.isMobile();
    this.isTablet = deviceService.isTablet();
    this.isDesktop = deviceService.isDesktop();
    this.isLogged = this.authService.isLoggedIn();
    this.getLoggedUserData();
    this.messageSubscription = messageService.getMessage()
      .subscribe(message => {
        if (message === 'logged_in') {
          this.isLogged = true;
          this.getLoggedUserData();
        }
      });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '600px',
      id: 'login'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'logged_in') {
        this.messageService.updateMessage('logged_in');

      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.messageSubscription.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
    this.messageService.updateMessage('logged_out');
    this.isLogged = false;
    this.user = null;
    if (this.router.url === '/') {
      this.router.navigate(['login']);
    }
  }

  getLoggedUserData() {
    this.userService.getLoggedUserData().subscribe(user => {
      this.user = user;
      this.user.profile.photo = this.url + this.user.profile.photo;

    }, error => {
      console.log('ERROR WHILE GETTING LOGGED USER DATA FROM HEADER');
      console.log(error);
    });
  }
}
