import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivateService {


  constructor(
    private http: HttpClient
  ) { }

  sendToken(token) {
    const url = `${environment.apiURL}/activate/`;
    return this.http.post<any>(url, { activation_token: token });
  }
}
