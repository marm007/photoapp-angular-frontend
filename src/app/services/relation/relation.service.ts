import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {Observable} from 'rxjs';
import {Relation} from '../../models/relation';
import {url} from '../../restConfig';

@Injectable({
  providedIn: 'root'
})
export class RelationService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  public getRelation(id: number): Observable<Relation> {
    return this.http.get<Relation>(url.concat('relations/').concat(String(id).concat('/')),
      {headers: this.authService.jwtAuthHeaders});
  }

  public addRelation(image: File): Observable<Relation> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post<Relation>(url.concat('relations/'),
      formData, {headers: this.authService.jwtAuthHeaders});
  }

  public removeRelation(id: number): Observable<Response> {
    return this.http.delete<Response>(url.concat('relations/').concat(String(id)).concat('/'),
      {headers: this.authService.jwtAuthHeaders});
  }
}
