import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { Dashboard } from '../models/dashboard';
import { addCorrectTime } from '../restConfig';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomepageComponent implements OnInit {

  dashboard: Dashboard = { id: null, relations: [...Array(8)], meta: { avatar: null, is_private: undefined }, posts: [...Array(12)] };

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
        dashboard.relations.forEach(relation => {
          relation.created = addCorrectTime(relation.created);
        });
        this.dashboard = dashboard
        this.componentLoaded = true;
      });
  }
}
