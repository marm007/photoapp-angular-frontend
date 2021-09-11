import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService } from '../../auth/services/auth.service';
import { ForgotComponent } from '../forgot/forgot.component';
import { RegisterComponent } from '../register/register.component';

class LoginModel {
  pending = false;
  status = 'init';
  message = null;
  constructor(public email: string, public password: string) {
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginModel = new LoginModel('', '');

  isMobile: boolean;

  dialogRef = null;

  constructor(private authService: AuthService,
    private deviceService: DeviceDetectorService,
    private router: Router,
    public dialog: MatDialog) {
    this.isMobile = deviceService.isMobile();
  }


  ngOnInit(): void {
    if (this.dialog.openDialogs) {
      this.dialogRef = this.dialog.getDialogById('login');
    }
  }

  login() {
    this.loginModel.pending = true;
    this.authService.login(this.loginModel.email, this.loginModel.password)
      .subscribe(
        auth => {
          console.log('login', auth)
          this.loginModel.pending = false;
          this.loginModel.status = 'ok';
          this.loginModel.message = 'Logged in successfully!';

          if (this.dialogRef == null) {
            this.router.navigate(['']);
          } else {
            this.dialogRef.close('logged_in');
          }
        },
        error => {
          console.log('aldldaldald', error)
          this.loginModel.pending = false;
          this.loginModel.status = 'fail';
          this.loginModel.message = error.error.detail ? error.error.detail : 'Something went wrong.';
        }
      );
  }

  handleRegister() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialog.open(RegisterComponent, {
        width: '600px',
        id: 'register'
      });
    } else {
      this.router.navigate(['register']);
    }
  }

  handleForgot() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialog.open(ForgotComponent, {
        width: '600px',
        id: 'forgot'
      });
    } else {
      this.router.navigate(['forgot']);
    }
  }

}
