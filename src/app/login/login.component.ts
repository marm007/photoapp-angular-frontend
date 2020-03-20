import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {RegisterComponent} from '../register/register.component';
import {UserService} from '../user.service';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {DeviceDetectorService} from 'ngx-device-detector';

export interface DialogData {
  animal: string;
  name: string;
}

export class LoginData {
  constructor(public email: string,
              public password: string) {
  }

}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user: any;

  model = new LoginData('', '');

  submitted = false;
  error: any;
  onSubmit() { this.submitted = true; }

  login() {
    this.authService.login(this.model.email, this.model.password).subscribe(
      success => {
        console.log(success);
      },
      error => {
        console.log("adda");
        console.log(error);
        this.error = error;
      }
    );
    this.model = new LoginData('', '');
  }

/*
  login() {
    console.log(this.model.email);
    console.log(this.model.password);
    this.userService.login({email: this.model.email, password: this.model.password});
    this.model = new LoginData('', '');
  }
*/

  refreshToken() {
    this.userService.refreshToken();
  }

  logout() {
    this.userService.logout();
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }

  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    public dialogRef: MatDialogRef<LoginComponent>,
    public registerDialog: MatDialog,
    private authService: AuthService,
    private router: Router) {}

    ngOnInit() {

    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  openRegisterDialog(): void {
    this.dialogRef.close();
    this.registerDialog.open(RegisterComponent, {
      width: '600px',
      height: '500px',

    });
  }



}
