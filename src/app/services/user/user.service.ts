import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {catchError, retry, tap} from 'rxjs/operators';
import handleError from '../errorHandler';
import {User} from '../../models/user';
import {Post, PostFilterSortModel} from '../../models/post';
import {Relation} from '../../models/relation';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http: HttpClient,
              private authService: AuthService) { }

   public filter(queryParams?: string, value?: string, offset?: string): Observable<User[]> {
     const url = `${environment.apiURL}/users/filter/`;
     let params = {[queryParams]: value};
     if (offset) {
       params = {...params, offset};
     }
     return this.http.get<User[]>(url, {params})
      .pipe(
        tap(_ => console.log(_)),
        catchError(handleError<User []>('filterUsers', []))
      );
   }

  public get(id?: string, addJWTHeaders= true): Observable<User> {
    if (id === undefined || id === null) {
      id = this.authService.userID;
    }
    const url = `${environment.apiURL}/users/${id}/`;

    return this.http.get<User>(url,
      addJWTHeaders ? {headers: this.authService.jwtAuthHeaders} : {})
      .pipe(
        tap((newUser: User) => console.log(`fetched user id=${id}`)),
        catchError(handleError<User>('getUser'))
    );
  }

  public update(username?: string, password?: string, email?: string, userPhoto?: File): Observable<User> {
    const id = this.authService.userID;
    const url = `${environment.apiURL}/users/${id}/`;

    if (username && password && email && userPhoto) {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('meta.avatar', userPhoto);
      return this.http.put<User>(url, formData, {headers: this.authService.jwtAuthHeaders} )
        .pipe(
          retry(2),
          tap(_ => console.log(`updated user id=${id}`))
        );

    } else {
      const formData = new FormData();
      if (username) {
        formData.append('username', username);
      }
      if (email) {
        formData.append('email', email);
      }
      if (password) {
        formData.append('password', password);
      }
      if (userPhoto) {
        formData.append('meta.avatar', userPhoto);
      }
      return this.http.patch<User>(url, formData, {headers: this.authService.jwtAuthHeaders} )
        .pipe(
          retry(2),
          tap(_ => console.log(`patched user id=${id}`))

        );
    }
  }

  public listPosts(offset?: number): Observable<Post[]> {
    const url = `${environment.apiURL}/users/me/posts/`;
    let params = {};

    if (offset) {
      params = {limit: 12, offset};
    } else {
      params = {limit: 12};
    }

    return this.http.get<Post[]>(url, {params, headers: this.authService.jwtAuthHeaders})
      .pipe(
        tap(_ => console.log(`listed my posts ${_}`)),
        catchError(handleError<Post[]>('listPosts'))
    );
  }

  public listProfilePosts(id: string, offset?: number): Observable<Post[]> {
    const url = `${environment.apiURL}/users/${id}/posts/`;
    let params = {};

    if (offset) {
      params = {limit: 12, offset};
    } else {
      params = {limit: 12};
    }

    return this.http.get<Post[]>(url, {params, headers: this.authService.jwtAuthHeaders})
      .pipe(
        tap(_ => console.log(`listed my posts ${_}`)),
        catchError(handleError<Post[]>('listPosts'))
    );
  }

  public listFollowedPosts(offset?: number, queryParams?: PostFilterSortModel): Observable<Post[]> {
    const url = `${environment.apiURL}/users/me/followed/posts/`;
    let params = {};

    if (offset) {
      params = {...params, offset};
    }


    for ( const key in queryParams ) {
      if (queryParams.hasOwnProperty(key)) {
        params[key] = queryParams[key];
      }
    }

    return this.http.get<Post[]>(url, {params, headers: this.authService.jwtAuthHeaders})
      .pipe(
        tap(_ => console.log(`listed my followed posts ${_}`)),
        catchError(handleError<Post[]>('listFollowedPosts'))
    );
  }

  public listFollowedRelations(offset?: number, queryParams?: PostFilterSortModel): Observable<Relation[]> {
    const url = `${environment.apiURL}/users/me/followed/relations/`;

    let params = {};

    if (offset) {
      params = {offset};
    }

    for ( const key in queryParams ) {
      if (queryParams.hasOwnProperty(key)) {
        params[key] = queryParams[key];
      }
    }

    return this.http.get<Relation[]>(url, {params, headers: this.authService.jwtAuthHeaders})
      .pipe(
        tap(_ => console.log(`listed my followed relations ${_}`)),
        catchError(handleError<Relation[]>('listFollowedRelations'))
    );
  }

  public follow(id: string): Observable<User> {
    const url = `${environment.apiURL}/users/${id}/follow/`;

    return this.http.post<any>(url,
      {followed: id}, {headers: this.authService.jwtAuthHeaders})
      .pipe(
        tap(_ => console.log(`followed user id=${id}`)),
        catchError(handleError<User>('followUser'))
      );
  }

  public forgot(email: string): Observable<any> {
    const url = `${environment.apiURL}/password/forgot/`;

    return this.http.post<any>(url, {email});
  }

  public reset(password: string, token: string): Observable<any> {
    const url = `${environment.apiURL}/password/reset/${token}/`;

    return this.http.post<any>(url, {password});
  }

  public getFollower(id: string): Observable<any> {
    const url = `${environment.apiURL}/followers/${id}/`;
    return this.http.get<any>(url);
  }
}
