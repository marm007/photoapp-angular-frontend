import {Component, Inject, OnInit} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ImageSnippet} from '../../models/imageSnippet';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {environment} from '../../../environments/environment';
import {UserService} from '../../services/user/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {User} from '../../models/user';
import {prepareImage} from '../../restConfig';
import {MessageService} from '../../services/message/message.service';

class EditProfileData {
  pending = false;
  status = 'init';
  constructor(public nick: string, public email: string, public password: string) {
  }
}

interface DialogData {
  user: User;
}
@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  selectedFile = new ImageSnippet(environment.avatarURL, null);
  editProfileData: EditProfileData;

  times = faTimes;

  isMobile: boolean;

  messageSuccess: string;
  editProfileErrorEmailMessage: string;
  editProfileErrorUsernameMessage: string;
  userToEdit: User;
  constructor(private deviceService: DeviceDetectorService,
              private dialogRef: MatDialogRef<ProfileEditComponent>,
              private userService: UserService,
              private snackBar: MatSnackBar,
              private messageService: MessageService,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.isMobile = deviceService.isMobile();
  }

  ngOnInit(): void {
    this.userToEdit = this.data.user;
    console.log(this.userToEdit);
    this.editProfileData = new EditProfileData(this.userToEdit.username, null, null);
    this.selectedFile.src = this.userToEdit.meta.avatar;
  }

  private onSuccess() {
    this.editProfileData.pending = false;
    this.editProfileData.status = 'ok';
  }

  private onError() {
    this.editProfileData.pending = false;
    this.editProfileData.status = 'fail';
  }

  editProfile() {
    this.editProfileData.pending = true;
    if (this.editProfileData.nick === this.userToEdit.username &&
      !this.editProfileData.email &&
      !this.editProfileData.password &&
      !this.selectedFile.file) {
      this.snackBar.open('No changes were made!', null, {
        duration: 1500,
      });
      this.dialogRef.close();
      return;
    }

    this.userService.update(this.editProfileData.nick, this.editProfileData.password, this.editProfileData.email, this.selectedFile.file)
      .subscribe(user => {
          this.messageService.updateMessage('profile_edited');
          user.meta.avatar = prepareImage(user.meta.avatar);
          this.snackBar.open('Changes have been saved!', null, {
            duration: 1500,
          });
          this.onSuccess();
          this.dialogRef.close(user);
        },
        errorRes => {
          this.onError();
          const error = errorRes.error;
          if (error.email) {
            this.editProfileErrorEmailMessage = error.email;
          }
          console.log(error);
          if (error.username) {
            this.editProfileErrorUsernameMessage = error.username;
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
