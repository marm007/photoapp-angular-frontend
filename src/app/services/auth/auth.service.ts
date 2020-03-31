import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {CanActivate, Router} from '@angular/router';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, filter, shareReplay, switchMap, take, tap} from 'rxjs/operators';
import * as jwtDecode from 'jwt-decode';
import moment from 'moment';
import {MatDialog} from '@angular/material/dialog';
import {apiURL} from '../../restConfig';

@Injectable()
export class AuthService {

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

  get userID(): number | null {
    if (this.isLoggedIn()) {
      this.refreshToken();
      const payload = jwtDecode(this.tokenAccess) as JWTPayload;
      return payload.user_id;
    }

    return null;
  }

  login(email: string, password: string) {

    const loginToken = window.btoa(email + ':' + password);
    const loginHeaders = new HttpHeaders(
      {'Content-Type': 'application/json',
      Authorization : 'Basic ' + loginToken});
    const url = `${apiURL}/auth/`;
    return this.http.post(
      url,
      { email, password },
      {headers: loginHeaders}
    ).pipe(
      tap(response => this.setSession(response)),
      shareReplay(),
    );
  }

  signup(username: string, email: string, password: string, photo?: File) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);

    if (photo) {
      formData.append('meta.avatar', photo);
    }

    const url = `${apiURL}/users/`;

    return this.http.post(
      url,
      formData
    ).pipe(
      tap(response => console.log(response)),
      shareReplay()
    );
  }

  logout() {
    localStorage.removeItem('token_access');
    localStorage.removeItem('token_refresh');
  }

  refreshToken() {
    if (moment().isAfter(this.getExpiration('token_access'))) {

      const url = `${apiURL}/token/refresh/`;

      return this.http.post(
        url,
        { refresh: this.tokenRefresh },
        {headers: this.jwtAuthHeaders}
      ).pipe(
        tap(response => this.setSession(response)),
        shareReplay(),
      ).subscribe();
    }
  }

  refreshToken401Error() {
    const url = `${apiURL}/token/refresh/`;

    return this.http.post<any>(
      url,
      {refresh: this.tokenRefresh})
      .pipe(tap(response => {
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
    return moment().isBefore(this.getExpiration('token_access')) ||
      moment().isBefore(this.getExpiration('token_refresh'));
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(public authService: AuthService,
              public router: Router,
              public dialog: MatDialog) {
  }
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {

    if (this.authService.tokenRefresh) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        this.refreshTokenSubject.next(null);
        return this.authService.refreshToken401Error().pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(token.access);
            return next.handle(this.addToken(request, token.access));
          }));

      } else {
        return this.refreshTokenSubject.pipe(
          filter(token => token != null),
          take(1),
          switchMap(jwt => {
            return next.handle(this.addToken(request, jwt));
          }));
      }
    } else {
      if (!(this.dialog.getDialogById('login') ||
        this.dialog.getDialogById('register') ||
        this.dialog.getDialogById('forgot'))) {
        this.dialog.closeAll();
        this.router.navigate(['login']);
      }

      return next.handle(request);
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
