import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {


constructor(public authService: AuthService) {}

   ngOnInit() {
    }

  logout() {
    this.authService.signOut();
  }

	goToLearn() {
    	document.querySelector('#learn-anchor').scrollIntoView();


          }
	

}
