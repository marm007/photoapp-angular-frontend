import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {Observable} from 'rxjs';
import {Comment} from '../../models/comment';
import {apiURL} from '../../restConfig';
import {catchError, tap} from 'rxjs/operators';
import handleError from '../errorHandler';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient,
              private authService: AuthService) { }

  public addComment(comment: Comment): Observable<Comment> {
    const url = `${apiURL}/posts/${comment.post}/comments/`;
    const body = {author_nick: comment.author_name, body: comment.body};
    return this.http.post<any>(url, body, {headers: this.authService.jwtAuthHeaders})
      .pipe(
        tap((newComment: Comment) => console.log(`added comment id=${newComment.id}`)),
        catchError(handleError<Comment>('addComment'))
      );
  }
}
