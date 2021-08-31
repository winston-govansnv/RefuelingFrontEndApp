import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { TokenStorageService } from '../_services/token-storage.service';
import { Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { map, catchError } from 'rxjs/operators';

const TOKEN_HEADER_KEY = 'Authorization';     

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private token: TokenStorageService,private router: Router) { }

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    //handle your auth error or rethrow
    console.log('server error : ', err);
    if ( err.status === 401 || err.status === 403) {
        //navigate /delete cookies or whatever
        this.token.signOut();
        this.router.navigate(['/login']);
        window.location.reload();
        // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
        // return Observable.of(err.message);
    }
    return Observable.throw(err);
}

intercept(req: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this.token.getToken();

    if (token != null) {
      authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
    }
    return next.handle(authReq).pipe(catchError(x=> this.handleAuthError(x)));;
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];