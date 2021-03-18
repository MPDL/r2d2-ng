import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { UsersComponent } from './components/users/users.component';
import { ObjectStoreComponent } from './components/object-store/object-store.component';
import { DatasetsComponent } from './components/datasets/datasets.component';
import { StartComponent } from './components/start/start.component';
import { SharedModule } from '../shared/shared.module';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { OusComponent } from './components/ous/ous.component';


@NgModule({
  declarations: [
    AdminComponent,
    UsersComponent,
    ObjectStoreComponent,
    DatasetsComponent,
    StartComponent,
    UserDetailsComponent,
    OusComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
