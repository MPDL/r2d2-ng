import { Component, OnInit } from '@angular/core';
import { Observable, of, EMPTY } from 'rxjs';
import { DatasetVersion, ESTO } from '../../../shared/components/model/entities';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { MessageService } from '../../../shared/services/message.service';
import { confirm_delete_dataset } from '../../../shared/components/model/confirmation-messages';
import { environment } from '../../../../environments/environment';
import { DataStoreService } from '../../../shared/services/data-store.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'r2d2-datasets',
  templateUrl: './datasets.component.html',
  styleUrls: ['./datasets.component.scss']
})
export class DatasetsComponent implements OnInit {

  base = environment.r2d2_admin_uri;
  context = '/datasets/';

  datasets: Observable<DatasetVersion[]>;
  set: Observable<DatasetVersion>;
  set_id: string;
  highlight;
  selected;

  constructor(
    private service: DataStoreService<DatasetVersion>,
    public auth: AuthenticationService,
    private message: MessageService
  ) { }

  ngOnInit(): void {
    this.datasets = this.service.data;
    this.service.list(this.base + this.context);
  }

  goTo(selected_set): void {
    this.set = this.service.data.pipe(
      map(sets => sets.find(set => set.id === selected_set.id && set.versionNumber === selected_set.versionNumber))
    );
    this.highlight = selected_set.id;
    this.selected = selected_set.id;
  }

  remove(ds): void {
    const confirm = this.message.displayConfirmation(confirm_delete_dataset(ds.id));
    confirm.afterClosed().subscribe(ok => {
      if (ok) {
        this.set = undefined;
        this.service.delete(this.base + this.context + ds.id + '/' + ds.versionNumber, ds.id, 'id');
        this.message.success(`deleted ${ds.id}`);
      }
    });
  }

}
