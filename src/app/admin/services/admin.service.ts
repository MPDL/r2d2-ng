import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpParams } from '@angular/common/http';
import { MessageService } from '../../shared/services/message.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ESTO, DatasetVersion } from '../../shared/components/model/entities';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  admin_uri = environment.r2d2_admin_uri;
  api_uri = environment.r2d2_rest_uri;

  constructor(
    private http: HttpClient,
    private message: MessageService
  ) { }

  list_datasets(): Observable<DatasetVersion[]> {
    return this.http.get<DatasetVersion[]>(this.admin_uri + '/datasets')
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  delete_dataset(id, num): Observable<object> {
    return this.http.delete(this.admin_uri + '/datasets/' + id + '/' + num)
    .pipe(
      map(response => {
        return response;
      })
    );
  }

  list2(): Observable<ESTO<DatasetVersion>[]> {
    let body;

    body = {
      query: {
        match_all: {}
      },
      size: 100
    };

    return this.http.post<ESTO<DatasetVersion>[]>(this.api_uri + '/search', body)
      .pipe(
        map(response => {
          return (response as any).hits.hits;
        })
      );
  }

  list_users(): Observable<any> {
    return this.http.get<any>(this.admin_uri + '/users')
      .pipe(
        map(response => response)
      );
  }

  list_container(): Observable<any[]> {
    return this.http.get<any[]>(this.admin_uri + '/store')
      .pipe(
        map(response => response)
      );
  }

  get_container(id): Observable<any> {
    return this.http.get<any>(this.admin_uri + '/store/' + id)
      .pipe(
        map(response => response)
      );
  }

  delete_container(id): Observable<string> {
    return this.http.delete(this.admin_uri + '/store/' + id, {observe: 'response'})
      .pipe(
        map(response => {
          return response.status + ' ' + response.statusText;
        })
      );
  }

}
