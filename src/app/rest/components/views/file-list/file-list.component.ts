import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatasetVersion, R2D2File } from '../../../../shared/components/model/entities';
import { MessageService } from '../../../../shared/services/message.service';
import { UploadService } from '../../../../shared/services/upload.service';
import { R2d2Service } from '../../../services/r2d2.service';

@Component({
  selector: 'r2d2-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit, OnChanges {

  files$: Observable<R2D2File[]>;
  @Input() dataset: DatasetVersion;

  constructor(
    private upload: UploadService,
    private service: R2d2Service,
    private message: MessageService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const prop in changes) {
      const change = changes[prop];
      const current  = change.currentValue;
      // const prev = change.previousValue;
      // console.log(`${prop}: currentValue = ${current.id}`);
      this.getFiles(current.id);
    }
  }

  getFiles(set_id): void {
    this.files$ = this.upload.list().pipe(
      map(result => result.total > 0 ? result.hits.map(file => file.source).filter(f => f.state !== 'ATTACHED') : []),
    );
  }

  addFile2Set(id, file, lmd) {
    if (file.state === 'COMPLETE' || file.state === 'PUBLIC') {
      this.service.putFile(id, file.id, lmd)
        .subscribe(() => {
          this.service.reload(id);
          this.getFiles(this.dataset.id);
        });
    } else if (file.state === 'INITIATED') {
      this.uploadMPU(id, file);
    } else {
      this.finishMPU(id, file);
    }
  }

  delete(file) {
      this.upload.delete(file)
        .subscribe(response => {
          this.message.success(JSON.stringify(response));
          this.getFiles(this.dataset.id);
        });
  }

  uploadMPU(id, file) {
    alert('uploading')
  }

  finishMPU(id, file) {
    alert('finish!')
  }

}
