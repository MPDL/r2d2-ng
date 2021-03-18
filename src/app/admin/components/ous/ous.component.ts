import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { MessageService } from '../../../shared/services/message.service';

@Component({
  selector: 'r2d2-ous',
  templateUrl: './ous.component.html',
  styleUrls: ['./ous.component.scss']
})
export class OusComponent implements OnInit {

  organization: FormControl = new FormControl();
  ous: Observable<any[]>;
  ou: Observable<any>;
  search_uri = environment.r2d2_vocab_uri + '/ous';
  highlight;

  constructor(
    private http: HttpClient,
    private message: MessageService
  ) { }

  ngOnInit(): void {
  }

  select(ou): void {
    this.organization.patchValue(ou.name);
    this.ou = this.get(ou.id);
    this.ous = EMPTY;
  }

  ouSearch(): void {
    this.ous = this.find(this.organization.value);
  }

  find(term): Observable<any[]> {
    const params = {
      query: {
        bool: {
          should: {
            term: { 'relationships.label.keyword': 'Max Planck Society' }
          },
          must: {
            multi_match: {
              query: term,
              fields: ['name.auto', 'labels.label.auto', 'acronyms.auto']
            }
          }
        }
      }
    };
    return this.http.post(this.search_uri, params).pipe(
      map((resp: any) => resp),
      catchError((error) => {
        this.message.error(error);
        return EMPTY;
      })
    );
  }

  get(id): Observable<any> {
    return this.http.get(this.search_uri + '/' + id).pipe(
      map(resp => {
        this.highlight = (resp as any).name;
        return resp;
      }),
      catchError((error) => {
        this.message.error(error);
        return EMPTY;
      })
    );
  }
}
