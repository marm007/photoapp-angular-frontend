import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { Dashboard } from '../models/dashboard';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomepageComponent implements OnInit {

  dashboard: Dashboard;

  componentLoaded = false;

  innerWidth: any;

  constructor(private userService: UserService,
    private authService: AuthService) {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit() {
    this.getDashboard();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }


  getDashboard() {
    this.userService.getDashboard()
      .subscribe(dashboard => {
        this.componentLoaded = true;
        this.dashboard = dashboard
      });
  }
}
