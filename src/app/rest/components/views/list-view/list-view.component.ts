import { Component, Input, OnInit } from '@angular/core';
import { DatasetVersion } from '../../../../shared/components/model/entities';

@Component({
  selector: 'r2d2-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent implements OnInit {

  @Input() dataset;
  @Input() authenticated: boolean;

  no_name = 'n/a';

  constructor() { }

  ngOnInit(): void {
  }

}
