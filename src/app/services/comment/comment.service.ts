import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {Observable} from 'rxjs';
import {Comment} from '../../models/comment';
import {url} from '../../restConfig';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  public addComment(comment: Comment): Observable<Comment> {
    const body = {author_nick: comment.author_name, body: comment.body};
    return this.http.post<any>(url.concat('posts/').concat(String(comment.post)).concat('/comments/'),
      body, {headers: this.authService.jwtAuthHeaders});
  }
}
