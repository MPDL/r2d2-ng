import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'r2d2-facet',
  templateUrl: './facet.component.html'
})
export class FacetComponent implements OnInit {

  items = [];
  item_list: any[] = [];
  current_list = 0;
  facet_form: FormGroup;
  facets: {}[];
  @Input() list: boolean;
  @Input() title: string;
  @Input() chunk_size: number;
  @Input() item_array: Observable<{}[]>;
  @Output() notice = new EventEmitter<any>();

  constructor(
    private builder: FormBuilder
  ) { }

  ngOnInit() {
    this.item_array.pipe(
      take(1)
    ).subscribe(result => {
      this.facets = result;
      if (this.facets.length > this.chunk_size) {
        this.item_list = this.facets.slice(0, this.chunk_size);
      } else {
        this.item_list = this.facets;
      }
    });
    this.facet_form = this.builder.group({
      facets: []
    });
  }

  submit() {

  }

  nextSlice(current_list) {
    let pos = this.facets.indexOf(current_list[current_list.length - 1]);
    pos = pos + 1;
    if (pos === this.facets.length) {
      return current_list;
    }
    if (pos + this.chunk_size > this.facets.length) {
      this.item_list = this.facets.slice(pos, this.facets.length);
    } else {
      this.item_list = this.facets.slice(pos, pos + this.chunk_size);
    }
  }

  prevSlice(current_list) {
    const pos = this.facets.indexOf(current_list[0]);
    if (pos - this.chunk_size < 0) {
      this.item_list = this.facets.slice(0, this.chunk_size);
    } else {
      this.item_list = this.facets.slice(pos - this.chunk_size, pos);
    }
  }

  forwardInList(item) {
    if (this.items.length > this.current_list) {
      this.current_list++;
      this.item_list = this.items[this.current_list];
    } else {
      this.item_list = this.items[0];
      this.current_list = 0;
    }
  }

  backInList(item) {
    if (this.current_list > 0) {
      this.current_list--;
      this.item_list = this.items[this.current_list];
    } else {
      this.item_list = this.items[0];
      this.current_list = 0;
    }
  }

  onCheckChange(item, event) {
    this.notice.emit(item);
  }

  filter(item) {
    if (this.item_list.length === 1) {
      this.item_list = this.facets.slice(0, this.chunk_size);
      this.notice.emit({search: 'reset', field: item.key_as_string || item.key});
    } else {
      const filtered = this.item_list.filter(i => item === i);
      this.item_list = filtered;
      this.notice.emit({search: this.title, field: item.key_as_string || item.key});
    }
  }

}
