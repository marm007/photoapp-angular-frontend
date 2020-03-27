import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth/auth.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {UserService} from '../services/user/user.service';
class ForgotData {
  constructor(public email: string, public password: string) {
  }
}
@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {

  forgotData = new ForgotData(null, null);

  isMobile: boolean;

  error: any;
  dialogRef = null;

  constructor(private authService: AuthService,
              private userService: UserService,
              private deviceService: DeviceDetectorService,
              private router: Router,
              public dialog: MatDialog) {
    this.isMobile = deviceService.isMobile();
  }


  ngOnInit(): void {
    if (this.dialog.openDialogs) {
      this.dialogRef = this.dialog.getDialogById('forgot');
    }
  }

  forgot() {
    this.userService.forgot(this.forgotData.email).subscribe(
      res => {
        console.log('GOOD FROM forgot COMB');
        console.log(res);
        if (this.dialogRef == null) {
          this.forgotData = new ForgotData('', '');
          // this.router.navigate(['']);
        } else {
          this.dialogRef.close();
        }
      },
      error => {
        // TODO: write errors to component
        console.log('BAD FROM forgot COMB');
        console.log(error);
        this.error = error;
      }
    );
  }
}
