import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {catchError, tap} from 'rxjs/operators';
import handleError from '../errorHandler';
import {apiURL} from '../../restConfig';
import {User} from '../../models/user';
import {Post} from '../../models/post';
import {Relation} from '../../models/relation';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http: HttpClient,
              private authService: AuthService) { }

   public filter(queryParams?: string, value?: string): Observable<User[]> {
     const url = `${apiURL}/users/filter/`;
     const params = {[queryParams]: value};
     return this.http.get<User[]>(url, {params})
      .pipe(
        tap(_ => console.log(_)),
        catchError(handleError<User []>('filterUsers', []))
      );
   }

  public get(id?: number, addJWTHeaders= true): Observable<User> {
    console.log('getting');
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

  public listFollowedPosts(start?: number, limit?: number): Observable<Post[]> {
    const url = `${apiURL}/users/me/posts/`;
    let params = {};

    if (start && limit) {
      params = {start, limit};
    }

    return this.http.get<Post[]>(url, {params, headers: this.authService.jwtAuthHeaders})
      .pipe(
        tap(_ => console.log(`listed my followed posts ${_}`)),
        catchError(handleError<Post[]>('listFollowedPosts'))
    );
  }

  public listFollowedRelations(start?: number, limit?: number): Observable<Relation[]> {
    const url = `${apiURL}/users/me/relations/`;

    let params = {};

    if (start && limit) {
      params = {start, limit};
    }

    return this.http.get<Relation[]>(url, {params, headers: this.authService.jwtAuthHeaders})
      .pipe(
        tap(_ => console.log(`listed my followed relations ${_}`)),
        catchError(handleError<Relation[]>('listFollowedRelations'))
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
