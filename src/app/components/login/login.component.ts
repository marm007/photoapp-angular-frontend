import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {Router} from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {RegisterComponent} from '../register/register.component';
import {ForgotComponent} from '../forgot/forgot.component';

class LoginData {
  constructor(public email: string, public password: string) {
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model = new LoginData('', '');

  isMobile: boolean;

  error: any;
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
    this.authService.login(this.model.email, this.model.password).subscribe(
      auth => {
        console.log(auth);
        if (this.dialogRef == null) {
          this.router.navigate(['']);
          this.model = new LoginData('', '');
        } else {
          this.dialogRef.close('logged_in');
        }
      },
      error => {
        // TODO: write errors to component
        console.log(error);
        this.error = error;
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
