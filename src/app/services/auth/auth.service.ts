import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {CanActivate, Router} from '@angular/router';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, filter, shareReplay, switchMap, take, tap} from 'rxjs/operators';
import * as jwtDecode from 'jwt-decode';
import moment from 'moment';
import {MatDialog} from '@angular/material/dialog';

@Injectable()
export class AuthService {

  private apiRoot = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) { }

  private setSession(authResult) {

    if ('refresh' in authResult) {
      localStorage.setItem('token_refresh', authResult.refresh);
    }

    localStorage.setItem('token_access', authResult.access);
  }

  get tokenAccess(): string {
    return localStorage.getItem('token_access');
  }

  get tokenRefresh(): string {
    return localStorage.getItem('token_refresh');
  }

  get jwtAuthHeaders(): HttpHeaders {
    return new HttpHeaders({Authorization: 'Bearer ' + this.tokenAccess});
  }

  get userID(): number {
    if (this.isLoggedIn()) {
      this.refreshToken();
      const payload = jwtDecode(this.tokenAccess) as JWTPayload;
      return payload.user_id;
    } else {
      this.logout();
      return -1;
    }
  }

  login(email: string, password: string) {

    const loginToken = window.btoa(email + ':' + password);
    const loginHeaders = new HttpHeaders({'Content-Type': 'application/json',
      Authorization : 'Basic ' + loginToken});
    const loginHttpOptions = {headers: loginHeaders};

    return this.http.post(
      this.apiRoot.concat('auth/'),
      { email, password },
      loginHttpOptions
    ).pipe(
      tap(response => this.setSession(response)),
      shareReplay(),
    );
  }

  signup(username: string, email: string, password1: string, password2: string) {
    // TODO: implement signup
  }

  logout() {
    localStorage.removeItem('token_access');
    localStorage.removeItem('token_refresh');
  }

  refreshToken() {
    if (moment().isAfter(this.getExpiration('token_access'))) {

      const headers = new HttpHeaders({'Content-Type': 'application/json',
        Authorization: 'JWT ' + this.tokenAccess});
      return this.http.post(
        this.apiRoot.concat('token/refresh/'),
        { refresh: this.tokenRefresh },
        {headers}
      ).pipe(
        tap(response => this.setSession(response)),
        shareReplay(),
      ).subscribe();
    }
  }

  refreshTokenOne() {
    return this.http.post<any>(this.apiRoot.concat('token/refresh/'), {
      refresh: this.tokenRefresh
    }).pipe(tap(response => {
      this.setSession(response);
    }));
  }


  getExpiration(tokenString: string) {
    const token = localStorage.getItem(tokenString);
    const payload = jwtDecode(token) as JWTPayload;
    return moment.unix(payload.exp);
  }

  isLoggedIn() {
    if (this.tokenAccess == null) {
      return false;
    }
    // TODO delete this log
    console.log('IS_LOGGED_IN');
    return moment().isBefore(this.getExpiration('token_access')) ||
      moment().isBefore(this.getExpiration('token_refresh'));
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  // Refresh Token Subject tracks the current token, or is null if no token is currently
  // available (e.g. refresh pending).
  constructor(public authService: AuthService,
              public router: Router,
              public dialog: MatDialog) {
  }
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.authService.refreshTokenOne().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.access);
          return next.handle(this.addToken(request, token.access));
        }));

    } else {
      if (this.authService.tokenAccess === null) {
        this.isRefreshing = false;
        this.refreshTokenSubject.next(null);
        this.dialog.closeAll();
        this.router.navigate(['login']);
        return next.handle(request);
      }

      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addToken(request, jwt));
        }));
    }
  }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
     return next.handle(request).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return this.handle401Error(request, next);
      } else {
        if ((error.status === 400  && error.url === 'http://localhost:8000/api/token/refresh/') ||
          error.status === 404) {
          this.dialog.closeAll();
          this.router.navigate(['login']);
        }
        return throwError(error);
      }
    })) as any;
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate() {
    if (this.authService.isLoggedIn()) {
      this.authService.refreshToken();
      console.log('CAN_ACTIVATE');
      return true;
    } else {
      this.authService.logout();
      this.router.navigate(['login']);
      return false;
    }
  }
}

interface JWTPayload {
  user_id: number;
  username: string;
  email: string;
  exp: number;
}
