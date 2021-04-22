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

  private token_subject = new BehaviorSubject<string>(null);
  private user_subject = new BehaviorSubject<any>(null);
  private isLoggedIn_subject = new BehaviorSubject<boolean>(false);
  private isAdmin_subject = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private message: MessageService
  ) { }

  get token(): string {
    return this.token_subject.value;
  }

  set token(token) {
    this.token_subject.next(token);
  }

  get user(): any {
    return this.user_subject.value;
  }

  set user(user) {
    this.user_subject.next(user);
  }

  get isLoggedIn(): boolean {
    // return this.isLoggedIn_subject.value; // TO-DO
    return this.autoLogin();
  }

  set isLoggedIn(bool) {
    this.isLoggedIn_subject.next(bool);
  }

  get isAdmin(): boolean {
    return this.isAdmin_subject.value;
  }

  set isAdmin(bool) {
    this.isAdmin_subject.next(bool);
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
        this.user = response.body;
        const roles: string[] = this.user.grants.map(g => g.role);

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
          console.log("on Auth service");
          console.log(JSON.stringify(this.user));
          sessionStorage.setItem('user', JSON.stringify(this.user)); // Vila 2021.04.13
          sessionStorage.setItem('token', JSON.stringify(this.token))
        } else {
          this.message.error(response.status + ' ' + response.statusText);
        }
      }));
  }

  autoLogin(): boolean {
    console.log("on autoLogin");
    this.token =  JSON.parse(sessionStorage.getItem('token'));
    if (this.token) {
      this.user = JSON.parse(sessionStorage.getItem('user') || ' ');
      return true;
    } 
    return false;
  }

  logout(): void {
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.token = null;
    this.user = null;
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
