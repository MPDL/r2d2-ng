import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from '../../shared/services/message.service';

@Injectable({
  providedIn: 'root'
})
export class AggregationService {

  searchUrl = 'http://localhost:8080/datasets/search';
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
    const name = Object.entries(aggregation)[0][0];
    if (name.includes('nested')) {
      const nested_name = Object.entries(aggregation.nested.aggregations)[0][0];
      return this.http.post(this.searchUrl, params, this.httpOptions).pipe(
        map(response => {
          // Elasticsearch: The high-level REST client sets the typed_keys parameter internally
          // TODO: find all typed_keys and implement generic solution ...
          return response[`aggregations`]['nested#' + name]['sterms#' + nested_name].buckets;
        })
      );
    } else {
      return this.http.post(this.searchUrl, params, this.httpOptions).pipe(
        map(response => {
          return response[`aggregations`]['sterms#' + name].buckets;
        })
      );
    }
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
