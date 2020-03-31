import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import {User} from '../../models/user';
import {UserService} from '../../services/user/user.service';
import {ImageType, prepareImage} from '../../restConfig';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  @ViewChild('autocompleteInput') autocompleteInput: ElementRef;

  isMobile: boolean;

  userList: User[];

  constructor(private deviceService: DeviceDetectorService,
              private userService: UserService) {
    this.isMobile = deviceService.isMobile();
  }

  ngOnInit(): void {
  }

  onSearchChange(searchValue: string): void {
    if (searchValue) {
      this.userService.filter('username__contains', searchValue)
        .subscribe(users => {
          users.forEach(user => {
            user.meta.avatar = prepareImage(user.meta.avatar);

          });
          this.userList = users;
        });
    } else { this.userList = []; }
  }

  displayFn(user: User) {
    const u = user ? user.username : user;
    return ''; // u
  }
}
