import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UploadService } from '../../services/upload.service';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'r2d2-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialogComponent implements OnInit {

  @ViewChild('file') file;
  public files: Set<File> = new Set();
  file_ids: string[];
  file_progress;
  current_progress;
  canBeClosed = true;
  primaryButtonText = 'Upload';
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog_ref: MatDialogRef<UploadDialogComponent>,
    public service: UploadService
  ) { }

  ngOnInit(): void {
  }

  addFiles(): void {
    this.file.nativeElement.click();
  }

  onFilesAdded(): void {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (const key in files) {
      if (!isNaN(parseInt(key, 10))) {
        this.files.add(files[key]);
      }
    }
  }

  cancel(): void {
    this.dialog_ref.close();
  }

  close(): void {
    if (this.uploadSuccessful) {
      return this.dialog_ref.close(this.file_ids);
    }
    this.uploading = true;
    this.file_progress = this.service.upload(this.files, this.data.id, this.data.token);
    const allIdObservables: Observable<string>[] = [];

    for (const key in this.file_progress) {
      if (key) {
        allIdObservables.push(this.file_progress[key].id);
      }
    }
    this.primaryButtonText = 'Done';
    this.canBeClosed = false;
    this.dialog_ref.disableClose = true;
    this.showCancelButton = false;

    forkJoin(allIdObservables).subscribe(ids => {
      this.file_ids = ids;
      this.canBeClosed = true;
      this.dialog_ref.disableClose = false;
      this.uploadSuccessful = true;
      this.uploading = false;
    });
  }
}
