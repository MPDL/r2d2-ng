import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'r2d2-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.scss']
})
export class HeadComponent implements OnInit {

  constructor(
    public auth: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  goHome(): void {
    this.router.navigate(['/rest']);
  }

  goMyDatasets(): void {
    this.router.navigate(['/rest/sets']);
  }

}