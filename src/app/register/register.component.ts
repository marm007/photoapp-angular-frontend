import { Component, OnInit } from '@angular/core';
import construct = Reflect.construct;
import {MatDialogRef} from '@angular/material/dialog';

export class RegisterData {
  constructor(public nick: string, public email: string,
              public password: string) {}
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerModel = new RegisterData(null, null, null);

  register() {

  }

  constructor(
    public dialogRef: MatDialogRef<RegisterComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
