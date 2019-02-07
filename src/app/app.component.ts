import { Component, OnInit } from '@angular/core';
import {AuthService} from './auth/auth.service';

@Component({
/*    moduleId: module.id,
https://stackoverflow.com/questions/37178192/angular-what-is-the-meanings-of-module-id-in-component */    
	selector: 'my-app',
    templateUrl: 'app.component.html',
     styleUrls: [ 'app.component.css' ],

})

export class AppComponent implements OnInit {

  constructor(public authService: AuthService) {}

   ngOnInit() {
    }

  logout() {
    this.authService.signOut();
  }
}
