import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'r2d2-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  title = 'CONFIRMATION REQUIRED';

  constructor(
    private dialogRef: MatDialogRef<ConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string
    ) { }

  ngOnInit(): void {
  }

  yes(): void {
    this.dialogRef.close(true);
  }
  no(): void {
    this.dialogRef.close(false);
  }

}
