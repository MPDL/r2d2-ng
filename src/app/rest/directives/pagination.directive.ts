import {   
  Directive,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  Renderer2,
  //HostBinding,
  HostListener } from '@angular/core';

@Directive({
  selector: '[r2d2Pagination]',
  exportAs: 'r2d2Pagination'
})
export class PaginationDirective implements OnInit {

  @Input() pageNo = 1;
  @Input() totalPages = 1;
  @Input() range = 1;

  @Output() pageChange = new EventEmitter<number>();

  constructor(private element: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    // In case no value is passed
    this.setValue(this.pageNo);
  }

  @HostListener("change", ["$event.target.value"]) onChange(val) {
    if (val === "") {
      this.setValue(1);
    }

    if (this.isOutOfRange(val)) {
      this.setValue(this.totalPages);
    }

    this.pageNo = Number(this.element.nativeElement.value);
    this.pageChange.emit(this.pageNo);
  }

  get isFirst(): boolean {
    return this.pageNo === 1;
  }

  get isLast(): boolean {
    return this.pageNo === this.totalPages;
  }

  first() {
    this.setPage(1);
  }

  prev() {
    this.setPage(Math.max(1, this.pageNo - 1));
  }

  next() {
    this.setPage(Math.min(this.totalPages, this.pageNo + 1));
  }

  last() {
    this.setPage(this.totalPages);
  }

  private setValue(val: string | number) {
    this.renderer.setProperty(this.element.nativeElement, "value", String(val));
  }

  private setPage(val: number) {
    this.pageNo = val;
    this.setValue(this.pageNo);
    this.pageChange.emit(this.pageNo);
  }

  private isOutOfRange(val: string): boolean {
    return Number(val) > this.totalPages;
  }

}

