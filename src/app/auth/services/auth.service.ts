import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as jwtDecode from 'jwt-decode';
import { retry, shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { JWTPayload } from '../models/jwt';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }

  private setSession(authResult) {
    console.log('session', authResult)
    if ('refresh' in authResult) {
      localStorage.setItem('token_refresh', authResult.refresh);
    }
    localStorage.setItem('token_access', authResult.access);
  }

  clearSession() {
    localStorage.removeItem('token_access');
    localStorage.removeItem('token_refresh');
  }

  get tokenAccess(): string | null {
    return localStorage.getItem('token_access');
  }

  get tokenRefresh(): string | null {
    return localStorage.getItem('token_refresh');
  }

  get jwtAuthHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: 'Bearer ' + this.tokenAccess });
  }

  get userID(): string | null {
    if (this.isLoggedIn()) {
      const payload = jwtDecode(this.tokenAccess) as JWTPayload;
      return payload.user_id;
    }

    return null;
  }

  login(email: string, password: string) {
    const loginToken = window.btoa(email + ':' + password);
    const loginHeaders = new HttpHeaders({ Authorization: 'Basic ' + loginToken });
    return this.http.post(
      `${environment.apiURL}/auth/`,
      { email, password },
      { headers: loginHeaders }
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

    const url = `${environment.apiURL}/users/`;

    return this.http.post(
      url,
      formData
    ).pipe(
      retry(2),
      shareReplay()
    );
  }

  logout() {
    const url = `${environment.apiURL}/logout/`;
    return this.http.post<any>(url, null, { headers: this.jwtAuthHeaders })
      .subscribe(
        data => {
          console.log(data);
          localStorage.removeItem('token_access');
          localStorage.removeItem('token_refresh');
        },
        err => {
          console.log(err);
        }
      );
  }

  refreshToken401Error() {

    return this.http.post<any>(
      `${environment.apiURL}/token/refresh/`,
      { refresh: this.tokenRefresh })
      .pipe(
        tap(response => {
          console.log('refreshToken401Error', response)
          this.setSession(response);
        })
      )
  }


  isLoggedIn() {
    return this.tokenAccess !== null;
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }
}
