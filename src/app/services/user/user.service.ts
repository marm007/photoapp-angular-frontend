import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Relation} from '../../models/relation';
import {AuthService} from '../auth/auth.service';
import {catchError} from 'rxjs/operators';
import handleError from '../errorHandler';
import {Post} from '../../models/post';
import {url} from '../../restConfig';
import {User} from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http: HttpClient,
              private authService: AuthService) { }

  public getLoggedUserData(): Observable<User> {
    const id = this.authService.userID;
    return this.http.get<User>(url.concat('users/').concat(String(id)).concat('/'),
      {headers: this.authService.jwtAuthHeaders});

  }

  public getUser(id?: number, addJWTHeaders= true): Observable<User> {
    if (id === undefined || id === null) {
      id = this.authService.userID;
    }

    console.log('IDDDDDDDd')
    console.log(id)
    return this.http.get<User>(url.concat('users/').concat(String(id)).concat('/'),
      addJWTHeaders ? {headers: this.authService.jwtAuthHeaders} : {}).pipe(
      catchError(handleError<User>('getUser', null))
    );
  }

  public getUserNoAuth(id: number): Observable<User> {
    return this.http.get<User>(url.concat('users/').concat(String(id)).concat('/')).pipe(
      catchError(handleError<User>('getUserNoAuth', null))
    );
  }

  public follow(id: number): Observable<User> {
    return this.http.post<any>(url.concat('users/').concat(String(id)).concat('/follow/'),
      {followed: id}, {headers: this.authService.jwtAuthHeaders});
  }

  public forgot(email: string): Observable<any> {
    return this.http.post<any>(url.concat('password/forgot/'), {email});
  }

  public reset(password: string, token: string): Observable<any> {
    return this.http.post<any>(url.concat('password/reset/').concat(token).concat('/'), {password});
  }

  public getFollower(id: number): Observable<any> {
    return this.http.get<any>(url.concat('followers/').concat(String(id)).concat('/'));
  }
}
