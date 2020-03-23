import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {Observable} from 'rxjs';
import {Comment} from '../../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiRoot = 'http://localhost:8000/api/';

  constructor(private http: HttpClient, private authService: AuthService) { }

  public getComments(photoId: number): Observable<Response> {
    return this.http.get<any>(this.apiRoot.concat('photos/').concat(String(photoId)).concat('/comments/'));
  }

  public addComment(comment: Comment): Observable<Comment> {
    const body = {author_nick: comment.author_name, body: comment.body};
    return this.http.post<any>(this.apiRoot.concat('photos/').concat(String(comment.photo_id)).concat('/comments/'),
      body, {headers: this.authService.jwtAuthHeaders});
  }
}
