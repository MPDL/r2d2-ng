import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from '../../shared/services/message.service';
import { map, catchError } from 'rxjs/operators';
import * as jwt from 'jsonwebtoken';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private tokenUrl: string = environment.r2d2_rest_uri.replace('datasets', 'login');
  private registrationUrl: string = environment.r2d2_rest_uri.replace('datasets', 'register');

  constructor(
    private http: HttpClient,
    private message: MessageService
  ) { }

  get token(): string {
    return sessionStorage.getItem('token');
  }

  set token(token) {
    sessionStorage.setItem('token', token);
  }

  get user(): any {
    return JSON.parse(sessionStorage.getItem('user'));
  }

  set user(user) {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  get isLoggedIn(): boolean {
    if (sessionStorage.getItem('isLoggedIn')) {
      return !!JSON.parse(sessionStorage.getItem('isLoggedIn').toLowerCase());
    } else {
      return false;
    }
  }

  set isLoggedIn(bool) {
    sessionStorage.setItem('isLoggedIn', String(bool));
  }

  get isAdmin(): boolean {
    if (sessionStorage.getItem('isAdmin')) {
      return !!JSON.parse(sessionStorage.getItem('isAdmin').toLowerCase());
    } else {
      return false;
    }
  }

  set isAdmin(bool) {
    sessionStorage.setItem('isAdmin', String(bool));
  }

  login(mail, pwd): Observable<void> {
    const header = new HttpHeaders().set('Content-Type', 'application/json');
    const credentials = { username: mail, password: pwd };

    return this.http.request('POST', this.tokenUrl, {
      body: credentials,
      headers: header,
      observe: 'response',
    }).pipe(
      map((response) => {
        let token = response.headers.get('Authorization');
        const user: any = response.body;
        const roles: string[] = user.grants.map(g => g.role);
        this.user = user;
        if (token != null) {
          token = token.slice(token.lastIndexOf(' ') + 1);
          this.token = token;
          const decoded = jwt.decode(token, { complete: true });
          const credsFromToken: string = decoded[`payload`][`sub`];
          if (credsFromToken.includes(mail)) {
            this.isLoggedIn = true;
            if (roles.includes('ADMIN')) {
              this.isAdmin = true;
            }
          }
        } else {
          this.message.error(response.status + ' ' + response.statusText);
        }
      }));
  }

  logout(): void {
    sessionStorage.clear();
  }

  register(request_details): Observable<object> {
    const header = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.request('POST', this.registrationUrl, {
      headers: header,
      body: request_details
    }).pipe(
      map((response) => {
        const confirmation_token_uri = response;
        return confirmation_token_uri;
      }),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}
