import { NgModule } 					      from '@angular/core';
import { Routes, RouterModule } 		from '@angular/router';
import { LibraryComponent } 			from './_pages/campaign-library.component';
import { ModuleComponent }       from './_pages/modules.component';
import { TeamComponent }       from './_pages/team.component';
import { FormComponent }            from './_pages/campaign.component';
import { NewFormComponent }         from './_pages/campaign-build.component';
import { CampaignResolve }             from './campaign.resolve';
import { CanDeactivateGuard }    from './_services/can-deactivate-guard.service';
import { AboutComponent } from './_pages/about.component';
import { UserLoginComponent } from './auth/user-login/user-login.component';
import {UserInfoComponent} from './auth/user-info/user-info.component';


const routes: Routes = [

  {
    path: 'login',
    component: UserLoginComponent
  },
   {path: 'user', 
   component: UserInfoComponent
 },
  {
    path: '',
    redirectTo: '/about',
    pathMatch: 'full'  },
  {
    path: 'campaign-library',
    component: LibraryComponent,
    canDeactivate: [CanDeactivateGuard]
 },
 {
    path: 'modules-library',
    component: ModuleComponent
  },
  {
    path: 'campaign-team',
    component: TeamComponent
  },
  {
    path: 'form/:type/:id',
    component: FormComponent,
//    data : {some_data : 'some value'}
    resolve: { campaign: CampaignResolve }
   },
  {
    path: 'new-form',
    component: NewFormComponent
  },
  {
    path: 'about',
    component: AboutComponent
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routedComponents = [AboutComponent, UserLoginComponent, UserInfoComponent, LibraryComponent, TeamComponent, ModuleComponent, FormComponent, NewFormComponent];
