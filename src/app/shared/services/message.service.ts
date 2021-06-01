import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { MessageComponent } from '../components/message/message.component';
import { ConfirmationComponent } from '../components/confirmation/confirmation.component';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messageDialogRef: MatDialogRef<MessageComponent>;
  confirmationDialogRef: MatDialogRef<ConfirmationComponent>;
  confirmation = false;

  constructor(private dialog: MatDialog) { }

  displayMessage(message?): void {
    this.messageDialogRef = this.dialog.open(MessageComponent, {
      // hasBackdrop: false,
      autoFocus: false,
      data: message,
      panelClass: 'r2d2-mat-dialog',
      position: {
        top: '5%'
      }
    });
  }

  displayConfirmation(message?): MatDialogRef<ConfirmationComponent> {
    this.confirmationDialogRef = this.dialog.open(ConfirmationComponent, {
      width: 'auto',
      hasBackdrop: false,
      // autoFocus: false,
      data: message,
      panelClass: 'r2d2-mat-dialog',
      position: {
        top: '10%',
        left: '10%'
      }
    });
    return this.confirmationDialogRef;
  }

  info(message: string): void {
    const msg = { type: 'info', text: message };
    this.displayMessage(msg);
  }

  success(message: string): void {
    const msg = { type: 'success', text: message };
    this.displayMessage(msg);
  }

  warning(message: string): void {
    const msg = { type: 'warning', text: message };
    this.displayMessage(msg);
  }

  error(message: string): void {
    const msg = { type: 'error', text: message };
    this.displayMessage(msg);
  }
}
