import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {Observable} from 'rxjs';
import {Relation} from '../../models/relation';
import {apiURL} from '../../restConfig';
import {catchError, tap} from 'rxjs/operators';
import handleError from '../errorHandler';

@Injectable({
  providedIn: 'root'
})
export class RelationService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  public add(image: File): Observable<Relation> {
    const url = `${apiURL}/relations/`;
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post<Relation>(url,
      formData, {headers: this.authService.jwtAuthHeaders})
      .pipe(
        tap((newRelation: Relation) => console.log(`added relation id=${newRelation.id}`)),
        catchError(handleError<Relation>('addRelation'))
      );
  }


  public get(id: number): Observable<Relation> {
    const url = `${apiURL}/relations/${id}/`;
    return this.http.get<Relation>(url,
      {headers: this.authService.jwtAuthHeaders})
      .pipe(
        tap(_ => console.log(`fetched relation id=${id}`)),
        catchError(handleError<Relation>('getRelation'))
      );
  }

  public delete(id: number): Observable<Relation> {
    const url = `${apiURL}/relations/${id}/`;
    return this.http.delete<Relation>(url,
      {headers: this.authService.jwtAuthHeaders})
      .pipe(
        tap(_ => console.log(`deleted realtion id=${id}`)),
        catchError(handleError<Relation>('deleteRaltion'))
      );
  }
}
