import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpParams } from '@angular/common/http';
import { BehaviorSubject, EMPTY, forkJoin, Observable, of, Subject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ESTO, ITO, DatasetVersion, SearchResult, ESResult } from '../../shared/components/model/entities';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ParamEncoder } from '../../core/services/interceptors/param-encoder';
import { R2D2File } from '../../shared/components/model/entities';
import { R } from '@angular/cdk/keycodes';

@Injectable({
  providedIn: 'root'
})
export class R2d2Service {

  private set_bs: Subject<DatasetVersion> = new BehaviorSubject<DatasetVersion>(null);
  readonly set$: Observable<DatasetVersion> = this.set_bs.asObservable();

  apiUrl = environment.r2d2_rest_uri;
  fileUrl = environment.r2d2_file_uri;
  admin_uri = environment.r2d2_admin_uri;


  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) { }

  get set(): Observable<DatasetVersion> {
    return this.set$;
  }

  list(search_string?: string): Observable<SearchResult<DatasetVersion>> {
    let params: HttpParams;
    if (search_string) {
      params = new HttpParams();
      params = params.append('q', search_string);
    }
    return this.http.get<SearchResult<DatasetVersion>>(this.apiUrl, { params })
    .pipe(
      map(response => response)
    );
  }

  search(search_string?: string): Observable<ESResult<DatasetVersion>> {
    let body;

    if (search_string) {
      body = {
        query: {
          query_string: {
            query: search_string
          }
        },
        size: 20,
        sort: [
          { modificationDate : {order : 'desc'}}
        ]
      };
    } else {
      body = {
        query: {
          match_all: {}
        },
        size: 20,
        sort: [
          { modificationDate : {order : 'desc'}}
        ]
      };
    }

    return this.http.post<ESResult<DatasetVersion>>(this.apiUrl + '/search', body)
      .pipe(
        map(response => response)
      );
  }

  page(from: string, size: string): Observable<SearchResult<DatasetVersion>> {
      let params = new HttpParams();
      params = params.append('from', from);
      params = params.append('size', size);
    return this.http.get<SearchResult<DatasetVersion>>(this.apiUrl, { params })
    .pipe(
      map(response => {
        if (response.total > 0) {
          console.log("R2d2Service, total = "+response.total);
        }; 
        return response})
    );
  }

  get(id): Observable<DatasetVersion> {
    return this.http.get<DatasetVersion>(this.apiUrl + '/' + id)
      .pipe(
        map(response => response)
      );
  }

  review(id, token): Observable<DatasetVersion> {
    const params = new HttpParams({ encoder: new ParamEncoder() })
    .set('reviewToken', token);
    return this.http.get<DatasetVersion>(this.apiUrl + '/' + id, { params })
      .pipe(
        map(response => response)
      );
  }

  getFiles(id, token?): Observable<SearchResult<R2D2File>> {
    const params = new HttpParams({ encoder: new ParamEncoder() })
    .set('reviewToken', token);
    if (token) {
      return this.http.get<SearchResult<R2D2File>>(this.apiUrl + `/${id}/files`, { params})
      .pipe(
        map(response => response)
      );
    }
    return this.http.get<SearchResult<R2D2File>>(this.apiUrl + `/${id}/files`)
      .pipe(
        map(response => response)
      );
  }

  post(ds): Observable<DatasetVersion> {
    return this.http.post<DatasetVersion>(this.apiUrl, ds)
      .pipe(
        map(response => response)
      );
  }

  put(id, ds): Observable<DatasetVersion> {
    return this.http.put<DatasetVersion>(`${this.apiUrl}/${id}/metadata`, ds)
      .pipe(
        map(response => response)
      );
  }

  putFile(id, file_id, lmd): Observable<R2D2File> {
    const params = new HttpParams({ encoder: new ParamEncoder() })
      .set('lmd', lmd);
    return this.http.put<R2D2File>(this.apiUrl + `/${id}/files/${file_id}`, null, { params })
      .pipe(
        map(response => response)
      );
  }

  putFiles(id, body): Observable<R2D2File[]> {
    return this.http.put<R2D2File[]>(this.apiUrl + `/${id}/files`, body)
      .pipe(
        map(response => response)
      );
  }

  deleteFile(id, file_id, lmd): Observable<R2D2File> {
    const params = new HttpParams({ encoder: new ParamEncoder() })
      .set('lmd', lmd);
    return this.http.delete<R2D2File>(this.apiUrl + `/${id}/files/${file_id}`, { params })
      .pipe(
        map(response => response)
      );
  }

  publish(id, lmd): Observable<DatasetVersion> {
    const body: Partial<DatasetVersion> = {
      modificationDate: lmd,
      state: 'PUBLIC'
    };
    return this.http.put<DatasetVersion>(this.apiUrl + '/' + id + '/state', body).pipe(
      map(response => response)
    );
  }

  withdraw(id, lmd): Observable<DatasetVersion> {
    const body: Partial<DatasetVersion> = {
      modificationDate: lmd,
      state: 'WITHDRAWN'
    };
    return this.http.put<DatasetVersion>(this.apiUrl + '/' + id + '/state', body).pipe(
      map(response => response)
    );
  }

  review_token(id): Observable<any> {
    return this.http.post(this.apiUrl + '/' + id + '/reviewToken', null).pipe(
      map(response => response)
    );
  }

  delete(id): Observable<string> {
    return of('NOT IMPLEMENTED YET!');
  }

  download(file_id, review_token): Observable<Blob> {
    let params: HttpParams;
    if (review_token) {
      params = new HttpParams()
      .append('download', 'true').append('reviewToken', review_token);
    } else {
      params = new HttpParams()
      .append('download', 'true');
    }
    return this.http.get(`${this.fileUrl}/${file_id}/content`, {
      params,
      responseType: 'blob'
    }).pipe(
      map(response => response)
    );
  }

  list_users(): Observable<any> {
    return this.http.get<any>(this.admin_uri + '/users')
      .pipe(
        map(response => response)
      );
  }

  buildSetWithFiles(id, review_token): Observable<DatasetVersion> {
    let set: Observable<DatasetVersion> = EMPTY;
    let files: Observable<R2D2File[]> = EMPTY;
    if (review_token) {
      set = this.review(id, review_token);
      files = this.getFiles(id, review_token).pipe(
        map(response => {
          if (response.total > 0) {
            return response.hits.map(f => f.source);
          } else {
            return [];
          }
        })
      );
    } else {
      set = this.get(id);
      files = this.getFiles(id).pipe(
        map(response => {
          if (response.total > 0) {
            return response.hits.map(f => f.source);
          } else {
            return [];
          }
        })
      );
    }
    return forkJoin([set, files])
      .pipe(
        map(result => {
          const set_with_files = result[0];
          set_with_files.files = result[1];
          return set_with_files;
        }));
  }

  reload(id): void {
    this.buildSetWithFiles(id, null).subscribe(
      dataset => this.set_bs.next(dataset)
    );
  }
}
