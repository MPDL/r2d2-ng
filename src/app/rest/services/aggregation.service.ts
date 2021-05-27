import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from '../../shared/services/message.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AggregationService {

  searchUrl = environment.r2d2_rest_uri+'/search';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  constructor(
    private http: HttpClient,
    private message: MessageService
  ) { }

  getBuckets(index_name, aggregation) {
    const params = {
      size: 0,
      aggregations: aggregation
    };
    return this.http.post(this.searchUrl, params, this.httpOptions).pipe(
      map((response: any) => {
        const key1 = Object.keys(response.aggregations)[0];
        if (key1.includes('nested')) {
          const key2 = Object.keys(response.aggregations[key1])[1];
          return response.aggregations[key1][key2].buckets;
        } else {
          return response.aggregations[key1].buckets;
        }
      })
    );
  }

  termfilter(f, v) {
    const term_filter = {
      size: 25,
      track_total_hits: true,
      query: {
        term: { [f]: v }
      }
    }
    return this.http.post(this.searchUrl, term_filter, this.httpOptions).pipe(
      map(response => response)
    );
  }
}
