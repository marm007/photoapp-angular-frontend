import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService } from '../../auth/services/auth.service';
import { UserService } from '../../services/user/user.service';

class ForgotData {
  pending = false;
  status = 'init';
  message = null;
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

  dialogRef = null;

  constructor(private authService: AuthService,
    private userService: UserService,
    private deviceService: DeviceDetectorService,
    public dialog: MatDialog) {
    this.isMobile = deviceService.isMobile();
  }


  ngOnInit(): void {
    if (this.dialog.openDialogs) {
      this.dialogRef = this.dialog.getDialogById('forgot');
    }
  }

  forgot() {
    this.forgotData.pending = true;
    this.userService.forgot(this.forgotData.email).subscribe(
      res => {

        this.forgotData.pending = false;
        this.forgotData.status = 'ok';
        this.forgotData.message = res.message;

        if (this.dialogRef == null) {
        } else {
          this.dialogRef.close();
        }
      },
      error => {
        this.forgotData.pending = false;
        this.forgotData.status = 'fail';
        this.forgotData.message = error.message;
      }
    );
  }
}
