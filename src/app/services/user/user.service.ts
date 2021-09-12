import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { Post, PostFilterSortModel } from '../../models/post';
import { Relation } from '../../models/relation';
import { User } from '../../models/user';
import handleError from '../errorHandler';

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
        catchError(handleError<User>('getUser'))
    );
  }

  public update(username?: string, password?: string, email?: string, userPhoto?: File, isPrivate?: string): Observable<User> {
    const id = this.authService.userID;
    const url = `${environment.apiURL}/users/${id}/`;
    if (username && password && email && userPhoto && isPrivate) {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('meta.avatar', userPhoto);
      formData.append('meta.is_private', isPrivate);
      return this.http.put<User>(url, formData, {headers: this.authService.jwtAuthHeaders} )
        .pipe(
          retry(2)
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
      if (isPrivate !== undefined) {
        formData.append('meta.is_private', isPrivate);
      }
      return this.http.patch<User>(url, formData, {headers: this.authService.jwtAuthHeaders} )
        .pipe(
          retry(2)
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

    return this.http.get<Post[]>(url, {params})
      .pipe(
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
        catchError(handleError<Relation[]>('listFollowedRelations'))
    );
  }

  public follow(id: string): Observable<User> {
    const url = `${environment.apiURL}/users/${id}/follow/`;

    return this.http.post<any>(url,
      {followed: id}, {headers: this.authService.jwtAuthHeaders})
      .pipe(
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
