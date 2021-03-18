import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { FormsService } from '../../../../rest/services/forms.service';

@Component({
  selector: 'r2d2-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss']
})
export class AuthorComponent implements OnInit {

  @Input() authorsForm: FormGroup;
  @Output() notice = new EventEmitter();

  constructor(
    private utils: FormsService
  ) { }

  ngOnInit(): void {
  }

  addAuthor(): void {
    this.notice.emit('add');
  }

  removeAuthor(): void {
    this.notice.emit('remove');
  }

  get affiliations(): FormArray {
    return this.authorsForm.get('affiliations') as FormArray;
  }

  addAffiliation(): void {
    this.affiliations.push(this.utils.emptyAfffiliation());
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
}
