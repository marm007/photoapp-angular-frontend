import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../services/auth/auth.service';
import {LoginComponent} from '../login/login.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;


  constructor(private deviceService: DeviceDetectorService,
              public dialog: MatDialog,
              public authService: AuthService,
              public router: Router) {
    this.isMobile = deviceService.isMobile();
    this.isTablet = deviceService.isTablet();
    this.isDesktop = deviceService.isDesktop();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '600px',
      height: '500px',
      id: 'login'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.authService.logout();
    if (this.router.url === '/') {
      this.router.navigate(['login']);
    }
  }

}
