import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { SharedModule } from '../shared/shared.module';
import { CoreRoutingModule } from './core-routing.module';
import { HeadComponent } from './components/head/head.component';
import { FootComponent } from './components/foot/foot.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { httpInterceptorProviders } from './services/interceptors';
import { RegistrationComponent } from './components/authentication/registration/registration.component';


@NgModule({
  declarations: [
    HeadComponent,
    FootComponent,
    AuthenticationComponent,
    LoginComponent,
    RegistrationComponent,
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    SharedModule,
    HttpClientModule
  ],
  exports: [
    RouterModule,
    HeadComponent,
    FootComponent,
  ],
  providers: [
    httpInterceptorProviders
  ]
})
export class CoreModule { }
