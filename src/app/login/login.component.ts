import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from '../services/auth/auth.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {Router} from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {RegisterComponent} from '../register/register.component';

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
  isTablet: boolean;
  isDesktop: boolean;

  submitted = false;
  error: any;
  dialogRef = null;
  registerDialog: MatDialog;

  constructor(private authService: AuthService,
              private deviceService: DeviceDetectorService,
              private router: Router,
              public dialog: MatDialog) {
    this.isMobile = deviceService.isMobile();
    this.isTablet = deviceService.isTablet();
    this.isDesktop = deviceService.isDesktop();
  }


  ngOnInit(): void {
    if (this.dialog.openDialogs) {
      this.dialogRef = this.dialog.getDialogById('login');
    }
  }

  onSubmit() {
    this.submitted = true;
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
        height: '500px',
        id: 'register'
      });
    } else {
      this.router.navigate(['register']);
    }
  }

}
