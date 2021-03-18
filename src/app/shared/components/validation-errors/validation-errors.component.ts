import { Component, OnInit, Input } from '@angular/core';
import { ControlContainer } from '@angular/forms';

@Component({
  selector: 'r2d2-validation-errors',
  templateUrl: './validation-errors.component.html',
  styleUrls: ['./validation-errors.component.scss']
})
export class ValidationErrorsComponent implements OnInit {

  @Input() control: any;
  @Input() messages: any;

  constructor() { }

  ngOnInit(): void {
  }

}
