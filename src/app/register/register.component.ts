import { Component, OnInit } from '@angular/core';
import construct = Reflect.construct;
import {DeviceDetectorService} from 'ngx-device-detector';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';

class RegisterData {
  constructor(public nick: string, public email: string, public password: string) {
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  isMobile: boolean;
  registerData = new RegisterData(null, null, null);
  dialogRef = null;

  constructor(private deviceService: DeviceDetectorService, public dialog: MatDialog) {
    this.isMobile = deviceService.isMobile();
  }

  ngOnInit(): void {
    if (this.dialog.openDialogs) {
      this.dialogRef = this.dialog.getDialogById('register');
    }
  }

  register() {

  }

}
