import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService } from '../../services/auth.service';
import { ActivateService } from '../../../services/activate/activate.service';

class TokenData {
  token = '';
  message = '';
  status = 'init';
  constructor() {
  }
}

@Component({
  selector: 'app-activate-user',
  templateUrl: './activate-user.component.html',
  styleUrls: ['./activate-user.component.css']
})
export class ActivateUserComponent implements OnInit {
  tokenData = new TokenData();
  isMobile: boolean;

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private deviceService: DeviceDetectorService,
    private authService: AuthService,
    private activateService: ActivateService) {
    this.isMobile = deviceService.isMobile();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.tokenData.token = params.token;
      this.reset();
    });
  }

  reset() {
    this.activateService.sendToken(this.tokenData.token).subscribe(
      res => {
        this.tokenData.message = res.message.concat(' You will be redirected to log in.');
        this.tokenData.status = 'ok';
        setTimeout(() => {
          this.router.navigate(['login']);
        }, 1500);
      },
      error => {
        this.tokenData.message = error.error.message;
        this.tokenData.status = 'fail';
      }
    );
  }
}
