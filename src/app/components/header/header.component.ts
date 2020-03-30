import {Component, OnDestroy, OnInit} from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../services/auth/auth.service';
import {LoginComponent} from '../login/login.component';
import {Router} from '@angular/router';
import {UserService} from '../../services/user/user.service';
import {User} from '../../models/user';
import {MessageService} from '../../services/message/message.service';
import {Subscription} from 'rxjs';
import {mediaURL} from '../../restConfig';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  user: User;
  messageSubscription: Subscription;

  isMobile: boolean;
  isLoggedIn: boolean;

  constructor(private deviceService: DeviceDetectorService,
              public dialog: MatDialog,
              private router: Router,
              public authService: AuthService,
              private userService: UserService,
              private messageService: MessageService) {

    this.isMobile = deviceService.isMobile();

    this.isLoggedIn = this.authService.isLoggedIn();

    this.messageSubscription = messageService.getMessage()
      .subscribe(message => {
        if (message === 'logged_in') {
          this.isLoggedIn = true;
          this.getUser();
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
    this.getUser();
  }

  ngOnDestroy(): void {
    this.messageSubscription.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
    this.messageService.updateMessage('logged_out');
    this.isLoggedIn = this.authService.isLoggedIn();
    this.user = null;
    if (this.router.url === '/') {
      this.router.navigate(['login']);
    }
  }

  getUser() {
    this.userService.get(null, false).subscribe(user => {
        this.user = user;
        this.user.meta.photo = mediaURL + this.user.meta.photo;
    });
  }
}
