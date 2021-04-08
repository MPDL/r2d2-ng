import { Component, OnInit, ViewChild, Inject, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UploadService } from '../../services/upload.service';
import { forkJoin } from 'rxjs';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'r2d2-multi-upload',
  templateUrl: './multi-upload.component.html',
  styleUrls: ['./multi-upload.component.scss']
})
export class MultiUploadComponent implements OnInit {

  @ViewChild('file') file!: ElementRef;
  public parts: { file: File, part: string }[] = [];
  file_progress;
  current_progress;
  canBeClosed = true;
  primaryButtonText = 'Upload';
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog_ref: MatDialogRef<MultiUploadComponent>,
    public service: UploadService,
    private message: MessageService
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
        this.parts.push({ file: files[key], part: key });
      }
    }
  }

  cancel(): void {
    this.dialog_ref.close();
  }

  close(): void {
    if (this.uploadSuccessful) {
      return this.dialog_ref.close();
    }
    this.uploading = true;
    this.service.chunk(this.parts, this.data.id, this.data.fileid, this.data.token)
    .then(status => {
      this.file_progress = status;
      this.primaryButtonText = 'Done';
      this.showCancelButton = false;
      this.uploadSuccessful = true;
      this.uploading = false;
    }, err => this.message.error(err));
  }
}
