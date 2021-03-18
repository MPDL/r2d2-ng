import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, EMPTY, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { MessageService } from '../../../services/message.service';
import { Affiliation } from '../entities';

@Component({
  selector: 'r2d2-affiliation',
  templateUrl: './affiliation.component.html',
  styleUrls: ['./affiliation.component.scss']
})
export class AffiliationComponent implements OnInit {

  @Input() affiliationForm: FormGroup;
  @Output() notice = new EventEmitter();
  ous: Observable<any[]>;
  SEARCH_URI = environment.osiris_rest_uri + '/find';
  R2D2_VOCAB_URI = environment.r2d2_vocab_uri + '/ous';

  constructor(
    private http: HttpClient,
    private message: MessageService
  ) { }

  ngOnInit(): void {
  }

  select(ou): void {
    this.affiliationForm.controls.organization.patchValue(ou.organization);
    this.affiliationForm.controls.id.patchValue(ou.id);
    this.ous = EMPTY;
  }

  addAffiliation(): void {
    this.notice.emit('add');
  }

  removeAffiliation(): void {
    this.notice.emit('remove');
  }

  ouSearch(): void {
    this.ous = this.find2(this.affiliationForm.controls.organization.value);
  }

  find2(term): Observable<Affiliation[]> {
    const params = new HttpParams()
      .append('q', term);
    return this.http.get<Affiliation[]>(this.R2D2_VOCAB_URI, {params}).pipe(
      map(response => response),
      catchError((error) => {
        this.message.error(error);
        return EMPTY;
      })
    );
  }

  find(term): Observable<any[]> {
    const params = {
      index: 'grid_ous_20200311',
      body: {
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
      }
    };
    return this.http.post(this.SEARCH_URI, params).pipe(
      map((resp: any) => resp.hits.hits.map(
        hit => hit._source
      )),
      catchError((error) => {
        this.message.error(error);
        return of();
      })
    );
  }
}
