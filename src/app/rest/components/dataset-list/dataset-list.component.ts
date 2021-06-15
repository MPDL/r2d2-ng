import { Component, OnInit } from '@angular/core';
import { R2d2Service } from '../../services/r2d2.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {
  ESTO,
  DatasetVersion,
} from '../../../shared/components/model/entities';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { map } from 'rxjs/operators';
import { AggregationService } from '../../services/aggregation.service';
import { PaginationDirective } from '../../directives/pagination.directive';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'r2d2-dataset-list',
  styleUrls: ['./dataset-list.component.scss'],
  templateUrl: './dataset-list.component.html'
})
export class DatasetListComponent implements OnInit {
  datasets: Observable<DatasetVersion[]>;
  p: number = 1;
  users: Observable<any>;
  no_name = 'n/a';
  search_term: string;
  // Facets
  listUrl: string;
  affiliations_obs: Observable<{}[]>;
  genres_obs: Observable<{}[]>;
  // Pagination:
  totalItems: number;
  pageSize: number = 10;
  numPages: number;
  maxRange: number = 1;
  currentPage: number = 1;

  constructor(
    private service: R2d2Service,
    private router: Router,
    public auth: AuthenticationService,
    private aggs: AggregationService,
    public pagination: PaginationDirective
  ) {}

  ngOnInit(): void {
    this.listUrl = environment.r2d2_rest_uri;
    this.datasets = this.service.list().pipe(
      // map(result => result.total > 0 ? result.hits.map(ito => ito.source) : [])
      map((result) => {
        if (result.total > 0) {
          this.totalItems = result.total;
          this.numPages = Math.ceil(this.totalItems/this.pageSize);
        }; 
        return result.hits?.map((ito) => ito.source);
      })
    );
    const affiliations = {
      terms: {
        field: 'metadata.authors.affiliations.organization.keyword',
        order: { _count: 'desc' },
        size: 25,
      },
    };
    const genres = {
      terms: {
        field: 'metadata.genres.keyword',
        order: { _count: 'desc' },
        size: 25,
      },
    };
    const nested = {
      nested: {
        path: 'metadata.authors',
      },
      aggregations: { affiliations },
    };
    // nested returns accumulated number of all affiliations ...
    // since nested authors are stored in seperate documents!
    this.affiliations_obs = this.aggs.getBuckets('', { affiliations });
    this.genres_obs = this.aggs.getBuckets('', { genres });
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

  facetNotice(event) {
    let field;
    let value;
    switch (event.search) {
      case 'genre':
        field = 'metadata.genres.keyword';
        value = event.field;
        break;
      case 'created':
        field = 'creationDate';
        value = event.field + '-01-01||/y';
        break;
      case 'organization':
        field = 'metadata.authors.affiliations.organization.keyword';
        value = event.field;
        break;
      case 'state':
        field = 'state';
        value = event.field;
        break;
      case 'reset':
        field = 'state';
        value = 'PUBLIC';
        break;
      default:
        break;
    }

    this.datasets = this.aggs.termfilter(field, value).pipe(
      map((response) => {
        return (response as any).hits.hits.map((hit) => hit._source);
      })
    );
  }

  selectors(counter: number): Array<number> {
    return Array(counter);
  }

  onPageChange(pageNo: number) {
    this.currentPage = pageNo;
    let from = pageNo * this.pageSize - this.pageSize;
    this.datasets = this.service
      .page(from.toString(), this.pageSize.toString())
      .pipe(
        map((result) =>
          result.total > 0 ? result.hits.map((ito) => ito.source) : []
        )
      );
  }

  pageSizeHandler(event: any) {
    let relocate =  this.currentPage*this.pageSize;
    this.pageSize = Number.parseInt(event.target.value);
    this.numPages = Math.ceil(this.totalItems/this.pageSize);
    this.currentPage = Math.floor(relocate/this.pageSize);
  }

}
