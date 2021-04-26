import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { DatasetVersion, R2D2File } from '../../../shared/components/model/entities';
import { UploadService } from '../../../shared/services/upload.service';
import { R2d2Service } from '../../services/r2d2.service';

@Component({
  selector: 'r2d2-dataset-review',
  templateUrl: './dataset-review.component.html',
  styleUrls: ['./dataset-review.component.scss']
})
export class DatasetReviewComponent implements OnInit {

  dataset$: Observable<DatasetVersion>
  files$: Observable<R2D2File[]>;

  constructor(private service: R2d2Service,
    private route: ActivatedRoute,
    public auth: AuthenticationService,
    private upload: UploadService
    ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params.id;
    const token = this.route.snapshot.params.review_token;
    this.dataset$ = this.service.buildSetWithFiles(id, token);
    // this.dataset$ = this.service.review(id, token);
  }

  download(file): void {
    const token = this.route.snapshot.params.review_token;
    this.service.download(file.id, token)
      .subscribe(response => {
        if (response) {
          this.createLink(response, file.filename);
        }
      });
  }

  createLink(blob, name): void {
    const a = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = name;
    a.click();
    URL.revokeObjectURL(objectUrl);
  }
}
