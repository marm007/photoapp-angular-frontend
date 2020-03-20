import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {CanActivate, Router} from '@angular/router';

import {Observable} from 'rxjs';
import {shareReplay, tap} from 'rxjs/operators';

import * as jwtDecode from 'jwt-decode';
import moment from 'moment';

@Injectable()
export class AuthService {

  private apiRoot = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) { }

  private setSession(authResult) {
    console.log("DLaldldaldal")
    const tokenAccess = authResult.access;
    console.log(tokenAccess)
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
    console.log("REFERS")
    console.log(this.getExpiration('token_access'))
    if (moment().isAfter(this.getExpiration('token_access'))) {
      const headers = new HttpHeaders({'Content-Type': 'application/json'});
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

  getExpiration(tokenString: string) {
    const token = localStorage.getItem(tokenString);
    const payload = jwtDecode(token) as JWTPayload;
    return moment.unix(payload.exp);
  }

  isLoggedIn() {
    return moment().isBefore(this.getExpiration('token_access')) ||
      moment().isBefore(this.getExpiration('token_refresh'));
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('falaflafl')
    const token = localStorage.getItem('token_access');

    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'JWT '.concat(token))
      });

      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate() {
    console.log("DAladladllad")
    if (this.authService.tokenAccess && this.authService.isLoggedIn()) {
      console.log("L:OGGGED")
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
