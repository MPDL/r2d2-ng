import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DatasetsComponent } from './components/datasets/datasets.component';
import { ObjectStoreComponent } from './components/object-store/object-store.component';
import { UsersComponent } from './components/users/users.component';
import { StartComponent } from './components/start/start.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { LoginGuard } from '../core/services/login.guard';
import { OusComponent } from './components/ous/ous.component';


const routes: Routes = [
  {
    path: '', component: AdminComponent, canActivate: [LoginGuard],
    children: [
      { path: 'sets', component: DatasetsComponent },
      { path: 'store', component: ObjectStoreComponent },
      { path: 'users', component: UsersComponent },
      { path: 'users/:id', component: UserDetailsComponent },
      { path: 'ous', component: OusComponent },
      { path: '', component: StartComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
