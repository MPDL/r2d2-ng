import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'r2d2-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  message;

  constructor(
    private dialog: MatDialogRef<MessageComponent>,
    @Inject(MAT_DIALOG_DATA) private data
    ) { }

  ngOnInit(): void {
    this.message = this.data;
  }

  close(): void {
    this.dialog.close();
  }
}
