import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { UserService } from '../../../services/user/user.service';

class ResetData {
  pending = false;
  status = 'init';
  message = null;
  constructor(public password: string, public token: string) {
  }
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetComponent implements OnInit {

  resetData = new ResetData(null, null);

  isMobile: boolean;

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private deviceService: DeviceDetectorService,
    private userService: UserService) {
    this.isMobile = deviceService.isMobile();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.resetData.token = params.token;
    });
  }

  reset() {
    this.resetData.pending = true;
    this.userService.reset(this.resetData.password, this.resetData.token)
      .subscribe(
        res => {
          this.resetData.pending = false;
          this.resetData.status = 'ok';
          this.resetData.message = res.message.concat(' You will be redirected to log in.');
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 1500);
        },
        error => {
          this.resetData.pending = false;
          this.resetData.status = 'fail';
          this.resetData.message = error.error.message;
        }
      );
  }
}
