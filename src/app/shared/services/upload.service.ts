import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { MessageService } from './message.service';
import { R2D2File, SearchResult, FileChunk, FileUploadStatus } from '../components/model/entities';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  base: string = environment.r2d2_file_uri;

  constructor(
    private http: HttpClient,
    private message: MessageService
  ) { }

  public upload(files: Set<File>, dsvid: string, token: string):
    { [key: string]: { progress: Observable<number>, id: Observable<string> } } {
    const status: { [key: string]: { progress: Observable<number>, id: Observable<string> } } = {};

    files.forEach(file => {
      const headers = new HttpHeaders()
        .set('Content-Type', file.type)
        .set('File-Name', file.name);
      // .set('Content-MD5', '1234');
      const req = new HttpRequest('POST', this.base, file, {
        headers,
        reportProgress: true
      });
      const progress = new Subject<number>();
      const id = new Subject<string>();
      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round(100 * event.loaded / event.total);
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {
          progress.complete();
          const elem = 'id';
          id.next(event.body[elem]);
          id.complete();
        }
      });
      status[file.name] = {
        progress: progress.asObservable(),
        id: id.asObservable()
      };
    });
    return status;
  }

  public initMPU(file, dsvid, token): Observable<object> {
    const headers = new HttpHeaders()
      .set('File-Name', file.name)
      .set('Content-Type', file.type);
    return this.http.post(this.base + '/multipart', null, {
      headers
    }).pipe(
      map(response => response)
    );
  }

  public async chunk(parts: { file: File, part: string }[], dsvid: string, fileid: string, token: string): Promise<any> {
    const status: { [key: string]: { id: string, state: string } } = {};

    for (const p of parts) {
      let params = new HttpParams();
      params = params.append('part', p.part);
      const headers = new HttpHeaders()
        .set('X-File-Chunk-Number', p.part);

      const done: FileChunk = await this.http.put<FileChunk>(this.base + '/multipart/' + fileid, p.file, {
        params
      }).toPromise();

      status[p.file.name] = {
        id: done.serverEtag,
        state: done.progress
      };
    }
    return status;
  }

  public finish(file, parts): Observable<object> {
    let params = new HttpParams();
    params = params.append('parts', parts);
    return this.http.post(this.base + '/multipart/' + file.id, null, { params })
      .pipe(
        map(response => response)
      );
  }

  public list(): Observable<SearchResult<R2D2File>> {
    return this.http.get<SearchResult<R2D2File>>(this.base)
      .pipe(
        map(response => response)
      );
  }

  public state(id): Observable<FileUploadStatus> {
    return this.http.get<FileUploadStatus>(this.base + '/' + id + '/uploadstate')
    .pipe(
      map(response => response)
    );
  }

  public delete(file): Observable<object> {
    return this.http.delete(this.base + '/' + file.id, { observe: 'response'})
      .pipe(
        map(response => {
          return { status: response.status, text: response.statusText };
        })
      );
  }
}
