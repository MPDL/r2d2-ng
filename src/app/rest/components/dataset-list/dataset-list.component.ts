import { Component, OnDestroy } from '@angular/core';
import { R2d2Service } from '../../services/r2d2.service';
import { Observable } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import {
  ESTO,
  DatasetVersion,
} from '../../../shared/components/model/entities';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'r2d2-dataset-list',
  templateUrl: './dataset-list.component.html',
})
export class DatasetListComponent implements OnDestroy {
  datasets: Observable<DatasetVersion[]>;
  users: Observable<any>;
  no_name = 'n/a';
  search_term: string;
  state_obs: string[] = ['Public', 'Private', 'Withdraw'];
  publisher_obs: string[];
  genres_obs: string[];
  created_obs: string[];
  navigationSubscription;

  constructor(
    private service: R2d2Service,
    private router: Router,
    public auth: AuthenticationService
  ) {
    this.navigationSubscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.init();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  // Implemented to fetch data 
  init(): void {
    this.datasets = this.service.list().pipe(
      // map(result => result.total > 0 ? result.hits.map(ito => ito.source) : [])
      map((result) => result.hits?.map((ito) => ito.source))
    );
  }

  filter(): void {
    this.datasets = this.service
      .list(this.search_term)
      .pipe(
        map((result) =>
          result.total > 0 ? result.hits.map((ito) => ito.source) : []
        )
      );
    this.search_term = undefined;
  }

  goTo(set): void {
    this.router.navigate(['/rest/set-viewer', set]);
  }

  addNewDataset(): void {
    this.router.navigate(['/rest/set-editor', 'new']);
  }

  facetNotice(notice: string): string {
    return notice;
  }
}
