import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'r2d2-multi-init',
  templateUrl: './multi-init.component.html',
  styleUrls: ['./multi-init.component.scss']
})
export class MultiInitComponent implements OnInit {

  mpuForm: FormGroup;

  constructor(
    private builder: FormBuilder,
    private dialogRef: MatDialogRef<MultiInitComponent>,
  ) { }

  ngOnInit(): void {
    this.mpuForm = this.builder.group({
      name: ['', Validators.required],
      type: ['', [Validators.required, Validators.min(2)]],
    });
  }

  init(): void {
    if (this.mpuForm.valid) {
      this.dialogRef.close(this.mpuForm.value);
    }
  }

  close(): void {
    this.dialogRef.close();
  }

}
