import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {RegisterComponent} from '../register/register.component';
import {UserService} from '../user.service';
import {AuthService} from '../auth.service';

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
        console.log(error);
        this.error = error;
      }
    );
    this.model = new LoginData('', '');
  }


  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<LoginComponent>,
    public registerDialog: MatDialog,
    private authService: AuthService) {}

    ngOnInit() {
    }

  openRegisterDialog(): void {
    this.dialogRef.close();
    this.registerDialog.open(RegisterComponent, {
      width: '600px',
      height: '500px',

    });
  }



}
