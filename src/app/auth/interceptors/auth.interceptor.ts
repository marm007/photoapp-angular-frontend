import {
  HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, EMPTY, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(public authService: AuthService,
    public router: Router,
    public dialog: MatDialog) {
  }

  private isRefreshing: Boolean = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (this.authService.tokenRefresh) {

      if (!this.isRefreshing) {

        this.isRefreshing = true;
        this.refreshTokenSubject.next(null);

        return this.authService.refreshToken401Error()
          .pipe(
            switchMap((token: any) => {
              this.isRefreshing = false;
              this.refreshTokenSubject.next(token.access);
              return next.handle(this.addToken(request, token.access));
            }),
            catchError((err) => {
              this.isRefreshing = false;
              return throwError(err);
            })

          );

      } else {
        return this.refreshTokenSubject.pipe(
          filter(token => token != null),
          take(1),
          switchMap(jwt => {
            return next.handle(this.addToken(request, jwt));
          }));
      }
    } else {
      if (!(this.dialog.getDialogById('login') ||
        this.dialog.getDialogById('register') ||
        this.dialog.getDialogById('forgot'))) {
        this.dialog.closeAll();
        this.router.navigate(['login']);
      }

      return next.handle(request);
    }
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (this.authService.tokenAccess) {
      request = this.addToken(request, this.authService.tokenAccess);
    }

    return next.handle(request)
      .pipe(
        catchError(error => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            if (error.url.includes('refresh')) {
              this.isRefreshing = false
              this.authService.clearSession()
              this.router.navigate(['login']);
              return EMPTY;
            } else
              return this.handle401Error(request, next);
          } else {
            return throwError(error);
          }
        })) as any;
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}

