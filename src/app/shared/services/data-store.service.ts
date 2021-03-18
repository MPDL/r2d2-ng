import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class DataStoreService<T> {

  private subject = new BehaviorSubject<T[]>([]);
  private store: {data: T[]} = {data: []};
  readonly data = this.subject.asObservable();

  constructor(
    private http: HttpClient,
    private message: MessageService
  ) { }

  list(uri): void {
    if (this.store.data.length > 0) {
      this.store.data = [];
      this.subject.next(Object.assign({}, this.store).data);
    }
    this.http.get<T[]>(uri)
      .subscribe(list => {
        this.store.data = list;
        this.subject.next(Object.assign({}, this.store).data);
      }, error => this.message.error(error));
  }

  get(uri, property): void {
    this.http.get<T>(uri)
      .subscribe(data => {
        let inStore = false;
        this.store.data.forEach((v, i) => {
          if (v[property] === data[property]) {
            this.store.data[i] = data;
            inStore = true;
          }
        });
        if (!inStore) {
          this.store.data.push(data);
        }
        this.subject.next(Object.assign({}, this.store).data);
      }, error => this.message.error(error));
  }

  create(uri, body: T): void {
    this.http.post<T>(uri, body)
      .subscribe(data => {
        this.store.data.push(data);
        this.subject.next(Object.assign({}, this.store).data);
      }, error => this.message.error(error));
  }

  update(uri, body: T, property): void {
    this.http.patch<T>(uri, body)
      .subscribe(data => {
        this.store.data.forEach((v, i) => {
          if (v[property] === data[property]) {
            this.store.data[i] = data;
          }
        });
        this.subject.next(Object.assign({}, this.store).data);
      }, error => this.message.error(error));
  }

  delete(uri, id, property): void {
    this.http.delete(uri)
      .subscribe(resp => {
        this.store.data.forEach((v, i) => {
          if (v[property] === id) {
            this.store.data.splice(i, 1);
          }
        });
        this.subject.next(Object.assign({}, this.store).data);
      }, error => this.message.error(error));
  }
}
