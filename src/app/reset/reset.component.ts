import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth/auth.service';
import {UserService} from '../services/user/user.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
class ResetData {
  constructor(public password: string, public token: string) {
  }
}
@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {

  resetData = new ResetData(null, null);

  isMobile: boolean;

  error: any;

  constructor(private authService: AuthService,
              private userService: UserService,
              private deviceService: DeviceDetectorService,
              private activatedRoute: ActivatedRoute) {
    this.isMobile = deviceService.isMobile();
  }


  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      console.log('params FROM RESET COMB');
      console.log(params);
      this.resetData.token = params.token;
    });
  }

  reset() {
    this.userService.reset(this.resetData.password, this.resetData.token).subscribe(
      res => {
        console.log('GOOD FROM RESET COMB');
        console.log(res);
          // this.router.navigate(['']);
      },
      error => {
        // TODO: write errors to component
        console.log('ERROR FROM RESET COMB');
        console.log(error);
        this.error = error;
      }
    );
  }
}
