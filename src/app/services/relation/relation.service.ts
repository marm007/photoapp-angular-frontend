import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/services/auth.service';
import { Relation } from '../../models/relation';
import handleError from '../errorHandler';

@Injectable({
  providedIn: 'root'
})
export class RelationService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  public add(image: File): Observable<Relation> {
    const url = `${environment.apiURL}/relations/`;
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post<Relation>(url,
      formData, {headers: this.authService.jwtAuthHeaders})
      .pipe(
        retry(2),
      );
  }


  public get(id: string): Observable<Relation> {
    const url = `${environment.apiURL}/relations/${id}/`;
    return this.http.get<Relation>(url,
      {headers: this.authService.jwtAuthHeaders})
      .pipe(
        catchError(handleError<Relation>('getRelation'))
      );
  }

  public delete(id: string): Observable<Relation> {
    const url = `${environment.apiURL}/relations/${id}/`;
    return this.http.delete<Relation>(url,
      {headers: this.authService.jwtAuthHeaders})
      .pipe(
        catchError(handleError<Relation>('deleteRaltion'))
      );
  }
}
