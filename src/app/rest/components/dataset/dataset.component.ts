import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { R2d2Service } from '../../services/r2d2.service';
import { MessageService } from '../../../shared/services/message.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { UploadDialogComponent } from '../../../shared/components/upload-dialog/upload-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MultiInitComponent } from '../../../shared/components/multi-init/multi-init.component';
import { UploadService } from '../../../shared/services/upload.service';
import { map, catchError, mergeMap, switchMap, filter } from 'rxjs/operators';
import { MultiUploadComponent } from '../../../shared/components/multi-upload/multi-upload.component';
import { EMPTY, Observable } from 'rxjs';
import { DatasetVersion, ITO, R2D2File } from '../../../shared/components/model/entities';

@Component({
  selector: 'r2d2-dataset',
  templateUrl: './dataset.component.html'
})
export class DatasetComponent implements OnInit {

  dataset$: Observable<DatasetVersion>;
  files$: Observable<R2D2File[]>;

  constructor(
    private route: ActivatedRoute,
    private service: R2d2Service,
    private router: Router,
    private message: MessageService,
    public auth: AuthenticationService,
    private dialog: MatDialog,
    private upload: UploadService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params.id;
    this.dataset$ = this.service.set;
    this.service.reload(id);
    /*
    this.dataset$ = this.route.data.pipe(
      map(data => data.set)
    );
    */
    if (this.auth.isLoggedIn) {
      this.getFiles();
    }
  }

  getFiles(): void {
    this.files$ = this.upload.list().pipe(
      map(result => result.total > 0 ? result.hits.map(file => file.source).filter(f => f.state !== 'ATTACHED') : []),
    );
  }

  add2Set(set, ids): Observable<R2D2File[]> {
    const updated_ids = set.files.map(f => f.id);
    ids.map(id => updated_ids.push(id));
    const body = {
      modificationDate: set.modificationDate,
      files: updated_ids
    };
    return this.service.putFiles(set.id, body);
  }

  addFile2Set(id, file, lmd): void {
    if (file.state === 'COMPLETE' || file.state === 'PUBLIC') {
      this.service.putFile(id, file.id, lmd)
        .subscribe(() => {
          this.service.reload(id);
          this.getFiles();
        });
    } else if (file.state === 'INITIATED') {
      this.uploadMPU(id, file);
    } else {
      this.finishMPU(id, file);
    }
  }

  delete(file): void {
    this.upload.delete(file)
      .subscribe(response => {
        this.message.success(JSON.stringify(response));
        this.getFiles();
      });
  }

  remove(set, file): void {
    // const index = set.files.indexOf(file);
    // set.files.splice(index, 1);
    this.service.deleteFile(set.id, file.id, set.modificationDate)
      .subscribe(() => {
        this.service.reload(set.id);
        this.getFiles();
      }, err => {
        this.message.error('ERROR deleting ' + file.id);
      });
  }

  deleteDataset(id): void {
    this.service.delete(id)
      .subscribe(response => {
        this.message.warning(JSON.stringify(response));
        this.router.navigate(['/rest/sets']);
      }, err => {
        this.message.error(err);
      });
  }

  public openUploadDialog(set): void {
    const dialogRef = this.dialog.open(UploadDialogComponent, {
      hasBackdrop: true,
      width: '50%',
      height: '50%',
      panelClass: 'r2d2-mat-dialog',
      position: {
        top: '20%'
      },
      data: { id: set.id, token: this.auth.token }
    });
    dialogRef.afterClosed().pipe(
      switchMap(ids => ids ? this.add2Set(set, ids) : EMPTY),
      catchError(err => {
        this.message.error(err);
        return EMPTY;
      })
    ).subscribe(
      () => {
        this.service.reload(set.id);
      },
      err => this.message.error(err)
    );
  }

  initMPUDialog(id): void {
    const dialogRef = this.dialog.open(MultiInitComponent, {
      hasBackdrop: true,
      width: '33%',
      height: '50%',
      panelClass: 'r2d2-mat-dialog',
      position: {
        top: '20%'
      },
    });
    dialogRef.afterClosed().pipe(
      switchMap(form => form ? this.upload.initMPU(form, id, this.auth.token) : EMPTY),
      catchError(err => {
        this.message.error(err);
        return EMPTY;
      })
    ).subscribe(() => {
      // this.getFiles();
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['/rest/set-viewer/' + id]);
    },
      err => this.message.error(err)
    );
  }

  uploadMPU(set_id, file): void {
    const dialogRef = this.dialog.open(MultiUploadComponent, {
      hasBackdrop: true,
      width: '50%',
      height: '50%',
      panelClass: 'r2d2-mat-dialog',
      position: {
        top: '20%'
      },
      data: { id: set_id, fileid: file.id, token: this.auth.token }
    });
    dialogRef.afterClosed().subscribe(
      () => {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/rest/set-viewer/' + set_id]);
      },
      err => this.message.error(err)
    );
  }

  download(file): void {
    this.service.download(file.id, null)
      .subscribe(response => {
        if (response) {
          this.createLink(response, file.filename);
        }
      });
  }

  finishMPU(id, file): void {
    const parts = prompt('number of parts:');
    if (parts) {
      this.upload.finish(file, parts)
      .subscribe(() => {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/rest/set-viewer/' + id]);
      },
        err => this.message.error(err));
    }
  }

  createLink(blob, name): void {
    const a = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = name;
    a.click();
    URL.revokeObjectURL(objectUrl);
  }

  publish(id, lmd): void {
    this.service.publish(id, lmd)
      .subscribe((set: any) => {
        this.service.reload(set.id);
      },
        err => this.message.error(err));
  }

  withdraw(id, lmd): void {
    this.service.withdraw(id, lmd)
      .subscribe((set: any) => {
        this.service.reload(set.id);
      },
        err => this.message.error(err));
  }

  review_token(id): void {
    this.service.review_token(id)
      .subscribe(rt => {
        this.message.info('token 4 ' + id + '\n' + rt.token + '\n' + this.router.url.concat('/').concat(rt.token));
      },
      err => this.message.error(err));
  }
}
