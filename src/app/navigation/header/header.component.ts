import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Event, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { faFilter, faImage } from '@fortawesome/free-solid-svg-icons';
import { DeviceDetectorService } from 'ngx-device-detector';
import { fromEvent, Subscription } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { LoginComponent } from 'src/app/auth/components/login/login.component';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../models/user';
import { prepareImage } from '../../restConfig';
import { MessageService } from '../../services/message/message.service';
import { UserService } from '../../services/user/user.service';
import { FilterComponent, SortFilter } from '../filter/filter.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

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
        this.isMainPage = event.url === '/' || event.url.includes('/relations/');
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
          this.isLoggedIn = true;
          this.getUser();
        } else if (message === 'profile_edited') {
          this.getUser();
        }
      });
  }

  @ViewChild('autocompleteInput') autocompleteInput: ElementRef;

  user: User;
  messageSubscription: Subscription;

  isMobile: boolean;
  isLoggedIn: boolean;

  userList: User[] = [];

  isMainPage = false;

  filterIcon = faFilter;
  faPhoto = faImage;

  currentSortFilter: SortFilter;

  searchUsername: string;
  @ViewChild('usersAutoComplete') usersAutocompleteRef: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

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
    this.isMainPage = this.router.url === '/' || this.router.url.includes('/relations/');
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
    this.userService.get(null, false)
      .subscribe(user => {
        if (user !== undefined && user !== null) {
          user.meta.avatar = prepareImage(user.meta.avatar);
          this.user = user;
        }
      });
  }

  onSearchChange(searchValue: string): void {
    if (searchValue) {
      this.userList = [];
      this.userService.filter('username__istartswith', searchValue)
        .subscribe(users => {
          this.searchUsername = searchValue;
          users.forEach(user => {
            user.meta.avatar = prepareImage(user.meta.avatar);
          });
          this.userList = this.userList.concat(users);
        });
    } else {
      this.userList = [];
    }
  }

  usersAutocompleteScroll() {
    setTimeout(() => {
      if (
        this.usersAutocompleteRef &&
        this.autocompleteTrigger &&
        this.usersAutocompleteRef.panel
      ) {
        fromEvent(this.usersAutocompleteRef.panel.nativeElement, 'scroll')
          .pipe(
            map(x => this.usersAutocompleteRef.panel.nativeElement.scrollTop),
            takeUntil(this.autocompleteTrigger.panelClosingActions)
          )
          .subscribe(x => {
            const scrollTop = this.usersAutocompleteRef.panel.nativeElement
              .scrollTop;
            const scrollHeight = this.usersAutocompleteRef.panel.nativeElement
              .scrollHeight;
            const elementHeight = this.usersAutocompleteRef.panel.nativeElement
              .clientHeight;
            const atBottom = scrollHeight === scrollTop + elementHeight;
            if (atBottom) {
              this.loadMoreSearchedUsers();
            }
          });
      }
    });
  }
  loadMoreSearchedUsers(): void {
    if (this.searchUsername) {
      this.userService.filter('username__istartswith', this.searchUsername, this.userList.length.toString())
        .subscribe(users => {
          users.forEach(user => {
            user.meta.avatar = prepareImage(user.meta.avatar);
          });
          this.userList = this.userList.concat(users);
        });
    }
  }

  displayFn(user: User) {
    const u = user ? user.username : user;
    return ''; // u
  }
}
