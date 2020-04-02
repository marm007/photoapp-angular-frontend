import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../services/auth/auth.service';
import {LoginComponent} from '../login/login.component';
import {UserService} from '../../services/user/user.service';
import {User} from '../../models/user';
import {MessageService} from '../../services/message/message.service';
import {Subscription} from 'rxjs';
import {prepareImage} from '../../restConfig';
import {faFilter, faImage} from '@fortawesome/free-solid-svg-icons';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {FilterComponent, SortFilter} from '../filter/filter.component';
import {Event, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @ViewChild('autocompleteInput') autocompleteInput: ElementRef;

  user: User;
  messageSubscription: Subscription;

  isMobile: boolean;
  isLoggedIn: boolean;

  userList: User[];

  isMainPage = false;

  filterIcon = faFilter;
  faPhoto = faImage;

  currentSortFilter: SortFilter;

  constructor(private deviceService: DeviceDetectorService,
              public dialog: MatDialog,
              private router: Router,
              private bottomSheet: MatBottomSheet,
              public authService: AuthService,
              private userService: UserService,
              private messageService: MessageService) {

    this.isMobile = deviceService.isMobile();

    this.isLoggedIn = this.authService.isLoggedIn();

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.isMainPage = event.url === '/';
      }

      if (event instanceof NavigationError) {
        console.error(event.error);
      }

      if (event instanceof NavigationEnd) {
      }
    });

    this.messageSubscription = messageService.getMessage()
      .subscribe(message => {
        if (message === 'logged_in') {
          console.log('message');
          console.log(message);
          this.isLoggedIn = true;
          this.getUser();
        }
      });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '600px',
      id: 'login'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'logged_in') {
        this.messageService.updateMessage('logged_in');

      }
    });
  }

  ngOnInit(): void {
    console.log(this.router.url);
    this.isMainPage = this.router.url === '/';
    this.getUser();
  }

  ngOnDestroy(): void {
    this.messageSubscription.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
    this.messageService.updateMessage('logged_out');
    this.isLoggedIn = this.authService.isLoggedIn();
    this.user = null;
    console.log(this.router.url);
    if (!this.router.url.includes('profile')) {
      this.router.navigate(['login']);
    }
  }

  handleSearchClick(userID: string) {
    this.userList = [];
    this.autocompleteInput.nativeElement.value = '';
    this.router.navigate([`profile/${userID}`]);
  }

  handleFilterClick() {
    const bottomSheetRef = this.bottomSheet.open(FilterComponent, {
      data: this.currentSortFilter ? this.currentSortFilter : {}
    });

    bottomSheetRef.afterDismissed().subscribe(value => {
      focus();
      this.currentSortFilter = value;
    });
  }

  getUser() {
    this.userService.get(null, false).subscribe(user => {
      if (user !== undefined && user !== null) {
        user.meta.avatar = prepareImage(user.meta.avatar);
        this.user = user;
      }
    });
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
    } else {
      this.userList = [];
    }
  }

  displayFn(user: User) {
    const u = user ? user.username : user;
    return ''; // u
  }
}
