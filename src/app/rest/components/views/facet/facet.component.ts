import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'r2d2-facet',
  templateUrl: './facet.component.html'
})
export class FacetComponent implements OnInit {

  @Input() list: boolean;
  @Input() chunk_size: number;
  @Input() title: string;
  @Input() item_array: string[];
  @Output() notice = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  facetNotice(value: string) {
    this.notice.emit(value);
  }

}
