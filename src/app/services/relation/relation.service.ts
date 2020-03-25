import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {Observable} from 'rxjs';
import {Comment} from '../../models/comment';
import {Relation} from '../../models/relation';

@Injectable({
  providedIn: 'root'
})
export class RelationService {
  private url = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient, private authService: AuthService) { }

  public getRelations(): Observable<Relation[]> {
    return this.http.get<Relation[]>(this.url.concat('relations/'));
  }

  public getRelation(id: number): Observable<Relation> {
    return this.http.get<Relation>(this.url.concat('relations/').concat(String(id)));
  }

  public addRelation(image: File): Observable<Relation> {
    console.log('asdsasa');

    const formData = new FormData();
    formData.append('image', image);
    return this.http.post<Relation>(this.url.concat('relations/'),
      formData, {headers: this.authService.jwtAuthHeaders});
  }
}
