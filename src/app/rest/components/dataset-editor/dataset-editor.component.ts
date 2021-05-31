import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { R2d2Service } from '../../services/r2d2.service';
import { FormsService } from '../../services/forms.service';
import { MessageService } from '../../../shared/services/message.service';
import { take } from 'rxjs/operators';
import { Dataset, DatasetVersion } from '../../../shared/components/model/entities';
import { AuthenticationService } from '../../../core/services/authentication.service';

@Component({
  selector: 'r2d2-dataset-editor',
  templateUrl: './dataset-editor.component.html',
  styleUrls: ['./dataset-editor.component.scss']
})
export class DatasetEditorComponent implements OnInit {

  datasetForm: FormGroup;
  datasetId: string;
  datasetLMD: string;
  dataset: DatasetVersion;
  more: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: R2d2Service,
    private utils: FormsService,
    private message: MessageService,
    private auth: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.datasetId = this.route.snapshot.params.id;
    this.datasetLMD = this.route.snapshot.queryParamMap.get('lmd');
    this.route.data.subscribe(data => {
      this.dataset = data.set;
    });
    if (this.datasetId.includes('new')) {
      this.utils.emptyDataset(this.auth.user.person).pipe(
        take(1)
        ).subscribe(form => this.datasetForm = form);
    } else {
      this.utils.dataset(this.datasetId).pipe(
        take(1)
      ).subscribe(form => this.datasetForm = form);
    }
  }

  get authors(): FormArray {
    return this.datasetForm.get('authors') as FormArray;
  }

  addAuthor(): void {
    this.authors.push(this.utils.emptyAuthor());
  }

  removeAuthor(i: number): void {
    this.authors.removeAt(i);
  }

  handleAuthors(event: string, index): void {
    if (event === 'add') {
      this.addAuthor();
    } else if (event === 'remove') {
      this.removeAuthor(index);
    }
  }

  get publications(): FormArray {
    return this.datasetForm.get('correspondingPapers') as FormArray;
  }

  addPublication(): void {
    this.publications.push(this.utils.emptyPublication());
  }

  removePublication(i): void {
    this.publications.removeAt(i);
  }

  handlePublications(event: string, index): void {
    if (event === 'add') {
      this.addPublication();
    } else if (event === 'remove') {
      this.removePublication(index);
    }
  }

  onFormSubmit(): void {
    if (this.datasetForm.valid) {
      if (this.datasetId === 'new') {
        const dataset = {} as DatasetVersion;
        dataset.metadata = this.datasetForm.value;
        this.service.post(dataset)
        .subscribe((res: any) => {
            const id = res.id;
            this.router.navigate(['/rest/set-viewer', id]);
          }, (err: any) => {
            this.message.error(err);
          }
        );
      } else {
        this.dataset.metadata = this.datasetForm.value;
        this.service.put(this.datasetId, this.dataset)
        .subscribe((res: any) => {
            const id = res.id;
            this.router.navigate(['/rest/set-viewer', id]);
          }, (err: any) => {
            this.message.error(err);
          }
        );
      }
    } else {
      this.getFormValidationErrors();
    }
  }

  datasetDetails(): void {
    this.router.navigate(['/rest/set-viewer', this.datasetId]);
  }

  gotoList(): void {
    this.router.navigate(['/rest/sets']);
  }

  getFormValidationErrors(): void {
    Object.keys(this.datasetForm.controls).forEach(key => {
    const controlErrors: ValidationErrors = this.datasetForm.get(key).errors;
    if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            const error = `VALIDATION ERROR:\n${key}: ${keyError}`;
            this.message.warning(error);
          });
        }
      });
    }

    switchView() {
      this.more = !this.more;
  }
}
