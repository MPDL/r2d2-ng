import { Component, Input, OnInit } from '@angular/core';
import { DatasetVersion } from '../../../../shared/components/model/entities';

@Component({
  selector: 'r2d2-version-list',
  templateUrl: './version-list.component.html',
  styleUrls: ['./version-list.component.scss']
})
export class VersionListComponent implements OnInit {

  @Input() dataset: DatasetVersion;

  constructor() { }

  ngOnInit(): void {
  }

}
