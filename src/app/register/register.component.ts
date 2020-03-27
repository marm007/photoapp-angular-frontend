import {Component, OnInit} from '@angular/core';
import construct = Reflect.construct;
import {DeviceDetectorService} from 'ngx-device-detector';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ImageSnippet} from '../models/imageSnippet';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {AuthService} from '../services/auth/auth.service';
import {MessageService} from '../services/message/message.service';

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
  selectedFile = new ImageSnippet(null, null);
  times = faTimes;

  isMobile: boolean;
  registerData = new RegisterData(null, null, null);
  dialogRef = null;

  registerError = false;
  registerErrorMessage: string;

  constructor(private deviceService: DeviceDetectorService,
              public dialog: MatDialog,
              private authService: AuthService,
              private router: Router,
              private messageService: MessageService) {
    this.isMobile = deviceService.isMobile();
  }

  ngOnInit(): void {
    if (this.dialog.openDialogs) {
      this.dialogRef = this.dialog.getDialogById('register');
    }
  }

  register() {
    this.authService.signup(this.registerData.nick, this.registerData.email, this.registerData.password, this.selectedFile.file)
      .subscribe(res => {
          console.log('GOOD FROM REGISTER');
          console.log(res);
          this.authService.login(this.registerData.email, this.registerData.password)
            .subscribe(auth => {
              console.log('GOOD FROM AUTH');
              console.log(auth);
              if (this.router.url === '/register') {
                this.router.navigate(['/']);
              } else {
                this.messageService.updateMessage('logged_in');
                  this.dialogRef.close();
              }
            }, error => {

            });

        },
        errorRes => {
          const error = errorRes.error;
          console.log(error);
          this.registerError = true;
          if (error.email) {
            this.registerErrorMessage = error.email;
          }
        });
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
      /* this.selectedFile.pending = true;
       this.selectedFile.status = 'fail';*/
      /*this.selectedFile.pending = true;
      this.alert = {type: 'alert-danger', message: 'Cos jest nie tak'};*/

    });

    reader.readAsDataURL(file);
  }

  public resetImage() {
    this.selectedFile = new ImageSnippet(null, null);
  }

}
