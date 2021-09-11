import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivateService {


  constructor(
    private http: HttpClient
  ) { }

  sendToken(token) {
    console.log(token)
    const url = `${environment.apiURL}/activate/`;

    return this.http.post<any>(url, {activation_token: token});
  }
}
