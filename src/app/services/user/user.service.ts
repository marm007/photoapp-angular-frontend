import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {catchError, tap} from 'rxjs/operators';
import handleError from '../errorHandler';
import {apiURL} from '../../restConfig';
import {User} from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http: HttpClient,
              private authService: AuthService) { }


  public get(id?: number, addJWTHeaders= true): Observable<User> {
    console.log('getting')
    if (id === undefined || id === null) {
      id = this.authService.userID;
    }
    const url = `${apiURL}/users/${id}/`;

    return this.http.get<User>(url,
      addJWTHeaders ? {headers: this.authService.jwtAuthHeaders} : {})
      .pipe(
        tap((newUser: User) => console.log(`fetched user id=${id}`)),
        catchError(handleError<User>('getUser'))
    );
  }

  public follow(id: number): Observable<User> {
    const url = `${apiURL}/users/${id}/follow/`;

    return this.http.post<any>(url,
      {followed: id}, {headers: this.authService.jwtAuthHeaders})
      .pipe(
        tap(_ => console.log(`followed user id=${id}`)),
        catchError(handleError<User>('followUser'))
      );
  }

  public forgot(email: string): Observable<any> {
    const url = `${apiURL}/password/forgot/`;

    return this.http.post<any>(url, {email});
  }

  public reset(password: string, token: string): Observable<any> {
    const url = `${apiURL}/password/reset/${token}/`;

    return this.http.post<any>(url, {password});
  }

  public getFollower(id: number): Observable<any> {
    const url = `${apiURL}/followers/${id}/`;
    return this.http.get<any>(url);
  }
}
