import {Component, OnInit} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ImageSnippet} from '../../models/imageSnippet';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {AuthService} from '../../services/auth/auth.service';
import {MessageService} from '../../services/message/message.service';
import {environment} from '../../../environments/environment';

class RegisterData {
  pending = false;
  status = 'init';
  constructor(public nick: string, public email: string, public password: string) {
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  selectedFile = new ImageSnippet(environment.avatarURL, null);
  registerData = new RegisterData(null, null, null);

  times = faTimes;

  isMobile: boolean;
  dialogRef = null;

  registerError = false;
  registerErrorEmailMessage: string;
  registerErrorUsernameMessage: string;

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

  private onSuccess() {
    this.registerData.pending = false;
    this.registerData.status = 'ok';
  }

  private onError() {
    this.registerData.pending = false;
    this.registerData.status = 'fail';
  }

  register() {
    this.registerData.pending = true;
    this.authService.signup(this.registerData.nick, this.registerData.email, this.registerData.password, this.selectedFile.file)
      .subscribe(res => {
          this.authService.login(this.registerData.email, this.registerData.password)
            .subscribe(auth => {
              this.onSuccess();
              if (this.router.url === '/register') {
                this.router.navigate(['/']);
              } else {
                this.messageService.updateMessage('logged_in');
                this.dialogRef.close();
              }
            }, error => {
                this.onError();
            });

        },
        errorRes => {
          this.onError();
          const error = errorRes.error;
          this.registerError = true;
          if (error.email) {
            this.registerErrorEmailMessage = error.email;
          }
          if (error.username) {
            this.registerErrorUsernameMessage = error.username;
          }
        });
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
    });

    reader.readAsDataURL(file);
  }

  public resetImage() {
    this.selectedFile = new ImageSnippet(environment.avatarURL, null);
  }

}
