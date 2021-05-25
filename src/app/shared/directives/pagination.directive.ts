import { Directive, OnInit } from '@angular/core';

@Directive({
  selector: '[r2d2Pagination]'
})
export class PaginationDirective implements OnInit {

  constructor() { 
    console.log('constructor directive');
  }

  ngOnInit() {
    console.log('ngOnInit en la directiva');
  }

}

