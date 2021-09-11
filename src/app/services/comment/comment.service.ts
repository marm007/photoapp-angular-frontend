import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { Comment } from '../../models/comment';
import handleError from '../errorHandler';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient,
              private authService: AuthService) { }

  public addComment(comment: Comment): Observable<Comment> {
    const url = `${environment.apiURL}/posts/${comment.post}/comments/`;
    const body = {author_nick: comment.author_name, body: comment.body};
    return this.http.post<any>(url, body, {headers: this.authService.jwtAuthHeaders})
      .pipe(
        tap((newComment: Comment) => console.log(`added comment id=${newComment.id}`)),
        catchError(handleError<Comment>('addComment'))
      );
  }

  public delete(id: string): Observable<Comment> {
    const url = `${environment.apiURL}/comments/${id}/`;
    return this.http.delete<any>(url, {headers: this.authService.jwtAuthHeaders})
      .pipe(
        tap(_ => console.log(`${_} removed comment id=${id}`)),
        catchError(handleError<Comment>('removedComment'))
      );
  }
}
