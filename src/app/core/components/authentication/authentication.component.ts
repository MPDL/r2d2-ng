import { Component, OnInit } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';

import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthenticationService } from '../../services/authentication.service';
import { MessageService } from '../../../shared/services/message.service';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'r2d2-authentication',
  templateUrl: './authentication.component.html'
})
export class AuthenticationComponent implements OnInit {

  loginDialogRef: MatDialogRef<LoginComponent>;
  registrationDialogRef: MatDialogRef<RegistrationComponent>;
  dialogConfiguration: MatDialogConfig = {
    hasBackdrop: false,
    panelClass: 'r2d2-mat-dialog',
    position: {
      top: '10%'
    }
  };

  confirmation_uri;

  constructor(
    private dialog: MatDialog,
    public auth: AuthenticationService,
    private msg: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  openLoginDialog(): void {
    this.loginDialogRef = this.dialog.open(LoginComponent, this.dialogConfiguration);
    this.loginDialogRef.afterClosed().pipe(
      switchMap(form => form ? this.auth.login(form.username, form.password) : EMPTY),
      catchError(err => {
        this.msg.error(err);
        return EMPTY;
      })
    ).subscribe(
      () => {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/rest/sets']);
      }
    );
  }

  logoff(): void {
    this.auth.logout();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/rest/sets']);
  }

  openRegistrationDialog(): void {
    this.registrationDialogRef = this.dialog.open(RegistrationComponent, this.dialogConfiguration);
    this.registrationDialogRef.afterClosed().pipe(
      switchMap(form => form ? this.auth.register(form).pipe(map(uri => this.confirmation_uri = uri)) : EMPTY),
      catchError(err => {
        this.msg.error(err);
        return EMPTY;
      })
    ).subscribe(
      uri => this.msg.success(JSON.stringify(uri)),
      err => this.msg.error(err),
      () => console.log('confirmation URI sent: ' + JSON.stringify(this.confirmation_uri))
    );
  }
}
