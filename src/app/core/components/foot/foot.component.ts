import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'r2d2-foot',
  templateUrl: './foot.component.html'
})
export class FootComponent implements OnInit {

  version = environment.ver;

  constructor() {}

  ngOnInit(): void {
  }

}
