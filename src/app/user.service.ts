import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {restConfig} from './rest-config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // http options used for making API calls
  private httpOptions: any;

 // http options used for making API calls
  private httpOptionsLogin: any;

  // the actual JWT token
  public token: string;

  // the token expiration date
  public tokenExpires: Date;

  // the username of the logged in user
  public username: string;

  // error messages received from the login attempt
  public errors: any = [];

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  // uses http.post() to get an auth token from django rest endpoint
  public login(user) {
    const loginToken = window.btoa(user.email + ':' + user.password);

    const loginHeaders = new HttpHeaders({'Content-Type': 'application/json',
      Authorization : 'Basic ' + loginToken});
    const loginHttpOptions = {headers: loginHeaders};

    console.log(user);
    this.http.post(restConfig.apiUrl + 'auth/', JSON.stringify(user), loginHttpOptions).subscribe(
      data => {
        console.log(data);
        this.updateData(data);
        localStorage.setItem('user', JSON.stringify(data));
    },
      error => {
        console.log(error);
        this.errors = error.error; }
      );
  }

  // refreshes the JWT token, to extend the time the user is logged in
  public refreshToken() {
    this.http.post(restConfig.apiUrl + 'token/refresh/', JSON.stringify({token: this.token}), this.httpOptions).subscribe(
      data => {
        this.updateData(data);
      },
      error => {
        this.errors = error.error;
      }
    );
  }

  public logout() {
    this.token = null;
    this.tokenExpires = null;
    this.username = null;
  }

  private updateData(data) {
    this.token = data.access;
    this.errors = [];

    // decode the token to read the username and expirtaion timestamp
    const tokenParts = this.token.split(/\./);
    const tokenDecode = JSON.parse(window.atob(tokenParts[1]));
    this.tokenExpires = new Date(tokenDecode.exp * 1000);
    this.username = data.user.username;
    console.log(tokenDecode);
    console.log(this.tokenExpires);
    console.log(this.username);
  }

}

