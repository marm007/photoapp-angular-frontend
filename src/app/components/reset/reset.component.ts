import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {UserService} from '../../services/user/user.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
class ResetData {
  pending = false;
  status = 'init';
  message = null;
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

  constructor(private activatedRoute: ActivatedRoute,
              private deviceService: DeviceDetectorService,
              private authService: AuthService,
              private userService: UserService) {
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
    this.resetData.pending = true;
    this.userService.reset(this.resetData.password, this.resetData.token).subscribe(
      res => {
        console.log('GOOD FROM RESET COMB');
        console.log(res);
        this.resetData.pending = false;
        this.resetData.status = 'ok';
        this.resetData.message = res.message;
          // this.router.navigate(['']);
      },
      error => {
        // TODO: write errors to component
        console.log('ERROR FROM RESET COMB');
        console.log(error);
        this.resetData.pending = false;
        this.resetData.status = 'fail';
        this.resetData.message = error.error.message;
      }
    );
  }
}
