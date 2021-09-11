import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecaptchaService {

  constructor(
    private http: HttpClient
  ) { }

  sendToken(token) {
    const url = `${environment.apiURL}/recaptcha_validate/`;

    return this.http.post<any>(url, {recaptcha: token});
  }
}
