import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Role } from '../entities';

@Component({
  selector: 'r2d2-grant',
  templateUrl: './grant.component.html',
  styleUrls: ['./grant.component.scss']
})
export class GrantComponent implements OnInit {

  @Input()
  grantForm!: FormGroup;
  @Output() notice = new EventEmitter();
  roles: string[] = Object.values(Role);

  constructor() { }

  ngOnInit(): void {
  }

  addGrant(): void {
    this.notice.emit('add');
  }

  removeGrant(): void {
    this.notice.emit('remove');
  }

}
