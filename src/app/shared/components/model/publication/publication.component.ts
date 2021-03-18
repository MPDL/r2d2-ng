import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'r2d2-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.scss']
})
export class PublicationComponent implements OnInit {

  @Input() publicationForm: FormGroup;
  @Output() notice = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  addPublication(): void {
    this.notice.emit('add');
  }

  removePublication(): void {
    this.notice.emit('remove');
  }

}
