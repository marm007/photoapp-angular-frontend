import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {RegisterComponent} from '../register/register.component';

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
export class LoginComponent {
  model = new LoginData('', '');

  submitted = false;

  onSubmit() { this.submitted = true; }

  login() {
    console.log(this.model.email);
    console.log(this.model.password);
    this.model = new LoginData('', '');
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    public registerDialog: MatDialog) {}

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
