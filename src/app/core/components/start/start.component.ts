import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'r2d2-start',
  templateUrl: './start.component.html'
})
export class StartComponent implements OnInit {

  title = 'Gettin\' started with  r2d2-ng';
  text = 'n/a';

  ngOnInit(): void {
  }
}
