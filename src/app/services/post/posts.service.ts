import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Post} from '../../models/post';
import {catchError, map, tap} from 'rxjs/operators';
import {AuthService} from '../auth/auth.service';
import handleError from '../errorHandler';
import {url} from '../../restConfig';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  addPost(image: File, description: string): Observable<Post> {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('image', image);
    return this.http.post<Post>(url.concat('posts/'), formData,
      {headers: this.authService.jwtAuthHeaders});
  }
/*

  getPosts(id: number): Observable<Post> {
    return this.http.get<Post>(this.url.concat('posts/').concat(String(id)).concat('/'))
      .pipe(
        tap(_ => console.log(_)),
          catchError(handleError<Post>('getPosts', null))
      );
  }
*/

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(url.concat('posts/').concat(String(id)).concat('/'),
      {headers: this.authService.jwtAuthHeaders})
      .pipe(
        tap(_ => console.log(_)),
        catchError(handleError<Post>('getPost', null))
      );
  }

  likePost(id: string): Observable<Post> {
    return this.http.patch<Post>(url.concat('posts/').concat(id + '/like/'),
      null, {headers: this.authService.jwtAuthHeaders})
      .pipe(
        tap(_ => console.log(_)),
        catchError(handleError<Post>('likePost', null))
      );
  }

  deletePost(id: string): Observable<any> {
    return this.http.delete<any>(url.concat('posts/').concat(id).concat('/'),
      {headers: this.authService.jwtAuthHeaders})
      .pipe(
        tap(_ => console.log(_)),
        catchError(handleError<any>('deletePost', null))
      );
  }
}
