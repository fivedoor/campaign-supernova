import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule }               from '@angular/forms';
import { FormsModule }                       from '@angular/forms';
import { HttpClientModule }                        from '@angular/common/http';

import { AppRoutingModule, routedComponents } from './app-routing.module';
import { AppComponent }                     from './app.component';
// Services
import { DataService }                      from './_services/data.service';
// Pages
import { NewFormComponent }                 from './_pages/campaign-build.component';
import { FormComponent }                    from './_pages/campaign.component';
// Partials
import { FooterComponent }                 from './_partials/footer.component';
// Forms
import { HeroFormComponent }                 from './_forms/hero-form.component';
import { TextFormComponent }                 from './_forms/text-form.component';
import { BannerFormComponent }                 from './_forms/banner-form.component';
import { ButtonFormComponent }                 from './_forms/button-form.component';
import { FooterFormComponent }                 from './_forms/footer-form.component';
import { FourPidFormComponent }                 from './_forms/four-pid-form.component';
import { ThreePidFormComponent }                 from './_forms/three-pid-form.component';
import { ConfigFormComponent }                 from './_forms/config-form.component';

import { CampaignResolve }                  from './campaign.resolve';
import { CanDeactivateGuard } from './_services/can-deactivate-guard.service'; //not used

// Authentication Login
import {AuthService} from './auth/auth.service';
import {UserLoginComponent} from './auth/user-login/user-login.component';
import {UserInfoComponent} from './auth/user-info/user-info.component';
// FireStarter Uploads
import { UploadService } from './_uploads/shared/upload.service';


//import {Autosize} from  'ng-autosize';
// import {Autosize} from 'angular2-autosize/src/autosize.directive';
import {Autosize} from 'angular2-autosize';
 //import { Autosize } from '../../node_modules/angular2-autosize/src/autosize.directive.js';
 // import { Autosize } from '../../node_modules/angular2-autosize/src/autosize.directive';

// Firebase
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';

import * as firebase from 'firebase';
/*import { RegistrationPageComponent } from './registration-page/registration-page.component';
*/

import { ModalComponent } from './_directives/index';
import { ModalService } from './_services/index';

@NgModule({
  imports:      [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
   ],
  declarations: [
    AppComponent,
    routedComponents,
    FormComponent,
    FooterComponent,
    HeroFormComponent,
    TextFormComponent,
    BannerFormComponent,
    ButtonFormComponent,
    FooterFormComponent,
    FourPidFormComponent,
    ThreePidFormComponent,
    ConfigFormComponent,
    NewFormComponent,
    Autosize,
    ModalComponent,

  ],
   providers: [
    DataService,
    CampaignResolve,
    UploadService,
    CanDeactivateGuard, //not used
    AuthService,
    ModalService
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
