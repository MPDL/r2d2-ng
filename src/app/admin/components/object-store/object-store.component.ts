import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { MessageService } from '../../../shared/services/message.service';
import { DataStoreService } from '../../../shared/services/data-store.service';
import { confirm_delete_container } from '../../../shared/components/model/confirmation-messages';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'r2d2-object-store',
  templateUrl: './object-store.component.html',
  styleUrls: ['./object-store.component.scss']
})
export class ObjectStoreComponent implements OnInit {

  container: Observable<any[]>;
  cont: Observable<any>;
  highlight;
  selected;
  base = environment.r2d2_admin_uri;
  context = '/store/';

  constructor(
    private service: AdminService,
    private store: DataStoreService<any>,
    private router: Router,
    public auth: AuthenticationService,
    private message: MessageService
  ) { }

  ngOnInit(): void {
    this.container = this.store.data;
    this.store.list(this.base + this.context);
  }

  goTo(id): void{
    this.service.get_container(id)
      .subscribe(
        response => {
          this.cont = response;
          this.highlight = id;
          this.selected = id;
        }
      );
  }

  remove(id): void {
    const confirm = this.message.displayConfirmation(confirm_delete_container(id));
    confirm.afterClosed().subscribe(ok => {
      if (ok) {
        this.store.delete(this.base + this.context + id, id, 'name');
        this.message.success('DELETED ' + id);
      }
    });
  }
}
