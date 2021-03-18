import { Component, OnInit, Input } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'r2d2-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss']
})
export class ChipsComponent implements OnInit {

  @Input() parent_form: FormGroup;
  @Input() control_name;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor() { }

  ngOnInit(): void {
  }

  get chips(): AbstractControl {
    return this.parent_form.get(this.control_name);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if (value) {

      this.chips.setValue([...this.chips.value, value.trim()]);
      this.chips.updateValueAndValidity();
    }

    if (input) {
      input.value = '';
    }
  }

  remove(chip): void {
    const index = this.chips.value.indexOf(chip);
    if (index >= 0) {
      this.chips.value.splice(index, 1);
      this.chips.updateValueAndValidity();
    }
  }
}
