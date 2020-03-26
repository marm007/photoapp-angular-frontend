import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Post} from '../../models/post';
import {catchError, map, tap} from 'rxjs/operators';
import {AuthService} from '../auth/auth.service';
import {UserPosts} from '../../models/userPosts';
import handleError from '../errorHandler';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private url = 'http://127.0.0.1:8000/api/';

  private postsUrl = 'http://127.0.0.1:8000/api/photos/';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getPosts1(): Observable<Post[]> {
    return this.http.get<Post[]>(this.postsUrl)
      .pipe(
        tap(_ => console.log(_)),
          catchError(handleError<Post[]>('getPosts', []))
      );
  }

  getPosts(id: number): Observable<UserPosts> {
    return this.http.get<UserPosts>(this.url.concat('users/').concat(String(id)).concat('/posts/'))
      .pipe(
        tap(_ => console.log(_)),
          catchError(handleError<UserPosts>('getPosts', null))
      );
  }

  getPost(id: string): Observable<Post> {
    return this.http.get<Post>(this.postsUrl.concat(id + '/'))
      .pipe(
        tap(_ => console.log(_)),
        catchError(handleError<Post>('getPost', null))
      );
  }

  likePost(id: string): Observable<Post> {
    return this.http.patch<Post>(this.postsUrl.concat(id + '/like/'),
      null, {headers: this.authService.jwtAuthHeaders})
      .pipe(
        tap(_ => console.log(_)),
        catchError(handleError<Post>('likePost', null))
      );
  }

  deletePost(id: string): Observable<any> {
    return this.http.delete<any>(this.postsUrl.concat(id).concat('/'), {headers: this.authService.jwtAuthHeaders})
      .pipe(
        tap(_ => console.log(_)),
        catchError(handleError<any>('deletePost', null))
      );
  }
}
