import {Component, OnInit} from '@angular/core';
import {AuthService} from './services/auth/auth.service';
import {ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'frontend';
  showHeader = true;
  constructor(private router: Router) {}

  ngOnInit() {
    // listenging to routing navigation event
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.modifyHeader(event);
      }
    });
  }

  modifyHeader(location) {
      if (location.url !== undefined) {

        const flag = location.url !== '/login' && location.url !== '/register';
        if (this.showHeader !== flag) {
          this.showHeader = flag;
        }
    }
  }

}
