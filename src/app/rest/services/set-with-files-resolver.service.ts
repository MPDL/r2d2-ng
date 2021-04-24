import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatasetVersion } from '../../shared/components/model/entities';
import { MessageService } from '../../shared/services/message.service';
import { R2d2Service } from './r2d2.service';

@Injectable({
  providedIn: 'root'
})
export class SetWithFilesResolverService implements Resolve<DatasetVersion>{

  constructor(
    private service: R2d2Service,
    private message: MessageService,
    private router: Router
  ) { }


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): DatasetVersion | Observable<DatasetVersion> {
    const id = route.paramMap.get('id');
    if (id === 'new') {
      return EMPTY;
    } else {
      return this.service.buildSetWithFiles(id, null);
    }
  }

  /*
  buildSetWithFiles(id): Observable<DatasetVersion> {
    const set = this.service.get(id);
    const files = this.service.getFiles(id).pipe(
      map(response => {
        if (response.total > 0) {
          return response.hits.map(f => f.source);
        }
      })
    );
    return forkJoin([set, files])
      .pipe(
        map(result => {
        const set_with_files = result[0];
        set_with_files.files = result[1];
        return set_with_files;
      }));
  }
  */
}
