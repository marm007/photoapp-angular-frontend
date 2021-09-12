import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { Post } from '../../models/post';
import handleError from '../errorHandler';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private http: HttpClient,
    private authService: AuthService) { }

  add(image: File, description: string): Observable<Post> {
    const url = `${environment.apiURL}/posts/`;
    const formData = new FormData();
    formData.append('description', description);
    formData.append('image', image);
    return this.http.post<Post>(url, formData,
      { headers: this.authService.jwtAuthHeaders }).pipe(
        retry(2)
      );
  }

  get(id: number): Observable<Post> {
    const url = `${environment.apiURL}/posts/${id}/`;
    return this.http.get<Post>(url,
      { headers: this.authService.jwtAuthHeaders })
      .pipe();
  }

  like(id: string): Observable<Post> {
    const url = `${environment.apiURL}/posts/${id}/like/`;
    return this.http.patch<Post>(url,
      null, { headers: this.authService.jwtAuthHeaders })
      .pipe(
        catchError(handleError<Post>('likePost'))
      );
  }

  delete(id: string): Observable<any> {
    const url = `${environment.apiURL}/posts/${id}/`;
    return this.http.delete<any>(url,
      { headers: this.authService.jwtAuthHeaders })
      .pipe(
        catchError(handleError<any>('deletePost'))
      );
  }

  update(id: string, description: string, image: File): Observable<Post> {
    const url = `${environment.apiURL}/posts/${id}/`;
    const formData = new FormData();

    if (description && image) {
      formData.append('description', description);
      formData.append('image', image);
      return this.http.put<Post>(url, formData,
        { headers: this.authService.jwtAuthHeaders })
        .pipe(
          retry(2),
          catchError(handleError<Post>('updatePost'))
        );
    } else {
      if (image) {
        formData.append('image', image);

      } else if (description) {
        formData.append('description', description);
      }

      return this.http.patch<Post>(url, formData,
        { headers: this.authService.jwtAuthHeaders })
        .pipe(
          retry(2),
          catchError(handleError<Post>('updatePost'))
        );
    }

  }
}
