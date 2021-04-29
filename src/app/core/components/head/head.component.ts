import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'r2d2-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.scss']
})
export class HeadComponent implements OnInit {

<<<<<<< Updated upstream
  version = environment.ver;
  user = null;

=======
>>>>>>> Stashed changes
  constructor(
    public auth: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    //this.user = this.auth.user(); // TO-DO
  }

}