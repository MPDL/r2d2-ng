import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { map } from 'rxjs/operators';
import { DataStoreService } from '../../../shared/services/data-store.service';
import { environment } from '../../../../environments/environment';
import { MessageService } from '../../../shared/services/message.service';
import { confirm_delete_dataset } from '../../../shared/components/model/confirmation-messages';
import { UserAccount } from '../../../shared/components/model/entities';

@Component({
  selector: 'r2d2-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  base = environment.r2d2_admin_uri;
  context = '/users/';

  users: Observable<UserAccount[]>;
  user: Observable<any>;

  constructor(
    private service: DataStoreService<UserAccount>,
    public auth: AuthenticationService,
    private message: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.users = this.service.data;
    this.service.list(this.base + this.context);
  }

  addNewUser(): void {

  }

  goTo(id): void {
    this.user = this.service.data.pipe(
      map(users => users.find(user => user.id === id))
    );
    this.router.navigate(['admin/users', id]);
  }
}
