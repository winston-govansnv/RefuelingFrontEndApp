import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const AUTH_API = 'api/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL= environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(credentials): Observable<any> {
    return this.http.post(this.API_URL+ AUTH_API + 'login', {
      username: credentials.username, 
      password: credentials.password
    }, httpOptions);
  }


  logout() {
    // remove user from local storage to log user out
    window.sessionStorage.clear();
  }
}