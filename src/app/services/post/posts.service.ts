import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Post} from '../../models/post';
import {catchError, map, tap} from 'rxjs/operators';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private postsUrl = 'http://127.0.0.1:8000/api/photos/';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.postsUrl)
      .pipe(
        tap(_ => console.log(_)),
          catchError(this.handleError<Post[]>('getPosts', []))
      );
  }

  getPost(id: string): Observable<Post> {
    return this.http.get<Post>(this.postsUrl.concat(id + '/'))
      .pipe(
        tap(_ => console.log(_)),
        catchError(this.handleError<Post>('getPost', null))
      );
  }

  likePost(id: string): Observable<Post> {
    return this.http.patch<Post>(this.postsUrl.concat(id + '/like/'),
      null, {headers: this.authService.jwtAuthHeaders})
      .pipe(
        tap(_ => console.log(_)),
        catchError(this.handleError<Post>('likePost', null))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
