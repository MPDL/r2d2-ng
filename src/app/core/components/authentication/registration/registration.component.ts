import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, ValidationErrors, AbstractControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsService } from '../../../../rest/services/forms.service';
import { MessageService } from '../../../../shared/services/message.service';

@Component({
  selector: 'r2d2-registration',
  templateUrl: './registration.component.html'
})
export class RegistrationComponent implements OnInit {

  registrationForm: FormGroup;

  constructor(
    private builder: FormBuilder,
    private dialogRef: MatDialogRef<RegistrationComponent>,
    private forms: FormsService,
    private message: MessageService
  ) { }

  ngOnInit(): void {
    this.registrationForm = this.builder.group({
      first: ['', [Validators.required, Validators.minLength(2)]],
      last: ['', Validators.required],
      email: [null, [Validators.required, Validators.email]],
      affiliations: this.builder.array([this.forms.emptyAfffiliation()]),
      identifier: [''],
      pass: ['', [Validators.required, Validators.minLength(8)]],
      match: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  get first(): AbstractControl { return this.registrationForm.get('first'); }
  get last(): AbstractControl { return this.registrationForm.get('last'); }
  get email(): AbstractControl { return this.registrationForm.get('email'); }
  get pass(): AbstractControl { return this.registrationForm.get('pass'); }
  get match(): AbstractControl { return this.registrationForm.get('match'); }


  register(): void {
    if (this.registrationForm.valid) {
      this.dialogRef.close(this.registrationForm.value);
    } else {
      this.getFormValidationErrors();
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  get affiliations(): FormArray {
    return this.registrationForm.get('affiliations') as FormArray;
  }

  addAffiliation(): void {
    this.affiliations.push(this.forms.emptyAfffiliation());
  }

  removeAffiliazion(i: number): void {
    this.affiliations.removeAt(i);
  }

  handleAffiliations(event: string, index): void {
    if (event === 'add') {
      this.addAffiliation();
    } else if (event === 'remove') {
      this.removeAffiliazion(index);
    }
  }

  getFormValidationErrors(): void {
    let err_msg = 'VALIDATION ERROR(S):\n';
    Object.keys(this.registrationForm.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.registrationForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          err_msg = err_msg.concat(key + ' is ' + keyError + '\n');
        });
      }
    });
    this.message.warning(err_msg);
  }
}
