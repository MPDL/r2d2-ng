import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { DatasetVersion } from '../../shared/components/model/entities';
import { MessageService } from '../../shared/services/message.service';
import { R2d2Service } from './r2d2.service';
import { environment } from '../../../environments/environment';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SetResolverService implements Resolve<DatasetVersion>{

  constructor(
    private service: R2d2Service,
    private message: MessageService,
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const id = route.paramMap.get('id');
    if (id === 'new') {
      return of({});
    } else {
      return this.service.get(id)
        .pipe(
          mergeMap(set => {
            if (set) {
              return of(set);
            } else {
              this.message.warning('Invalid dataset id');
              this.router.navigate(['sets']);
              return EMPTY;
            }
          })
        );
    }
  }
}
