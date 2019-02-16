import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/*import { Response } from '@angular/http'; deprecated*/
/*import { Observable } from 'rxjs/Rx'; deprecated*/
import {Observable,of, from } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

// import * as Rx from 'rxjs';

/*import { forkJoin } from "rxjs/observable/forkJoin"; deprecated */
import {forkJoin} from 'rxjs';

import { Campaign } from '../_classes/campaign.class';
//
// http://www.christophergallup.com/angular-with-firebase-adding-and-removing-items/
// https://github.com/angular/angularfire2/blob/master/docs/2-retrieving-data-as-objects.md#deleting-data
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { Router } from "@angular/router";


declare var firebase: any;

@Injectable()
export class DataService {

 // public users: FirebaseListObservable<any>;
//  public displayName: string;
  public email: string;
 // public user: FirebaseObjectObservable<any>;
  campaigns: AngularFireList<any[]>;
  team: AngularFireList<any[]>;
  customTeam: AngularFireList<any[]>;

  foo: any[];


/*  authState: any = null;
*/

constructor(
    private http: HttpClient,
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router) {


this.campaigns = db.list('/emails');
this.team = db.list('/testTeam');
this.customTeam = db.list('/customTeam');

/*this.afAuth.authState.subscribe((auth) => {
              this.authState = auth;});*/
}


/////// GET DATA  ///////////

// Get nominated Campaign

getCampaignData(campaignName?: string, type?: string) {
    console.log('FUNC: getCampaignData(' + campaignName + ', ' + type + ') ---> Data Service' );

    let url =  "https://ngdataformdemo.firebaseio.com/" + type + "/" + campaignName + ".json";
  return this.http.get(url);
/*    .map((response: Response) => response.json());
*/}

// Get all Emails
getCampaignsData(type?: string) {
  console.log('FUNC: getCampaignsData(' + type + ') ---> Data Service' );
  let url =  "https://ngdataformdemo.firebaseio.com/"  + type + ".json";

  return this.http.get(url);
  /*  .map((response: Response) => response.json());*/
}


// Get Team Details


getTeamData(type?: string) {
      console.log('FUNC: getTeamData(' + type + ') ---> Data Service');
    let url =  "https://ngdataformdemo.firebaseio.com/" + type + ".json";
  return this.http.get(url);
/*    .map((response: Response) => response.json());
*/}

getAllTeamData() {
    console.log('FUNC: getAllTeamData() ---> Data Service');

    const teamUrl =  this.http.get('https://ngdataformdemo.firebaseio.com/testTeam.json');
    const customTeamUrl =  this.http.get('https://ngdataformdemo.firebaseio.com/customTeam.json');
// https://coryrylan.com/blog/angular-multiple-http-requests-with-rxjs
// https://www.metaltoad.com/blog/angular-2-http-observables-and-concurrent-data-loading
// return Observable.forkJoin([teamUrl, customTeamUrl]); deprecated
return forkJoin([teamUrl, customTeamUrl]);
}



/////// SET DATA  ///////////

setTeamData(

    teamMemberId: number,
    teamForm: any,
    ) {
  console.log('FUNC: setTeamData() ---> Data Service');
  let url =  "https://ngdataformdemo.firebaseio.com/testTeam/" + teamMemberId + ".json";
  const entry = JSON.stringify(teamForm.value);
  console.log(entry);

  return this.http.put(url, entry);
   /* .map((response: Response) => response.json());*/
}

writeUserData(
    teamMemberId: number,
    teamForm: any) {
   console.log('FUNC: writeUserData() ---> Data Service');
    const entry = teamForm.value;
    console.log(entry);

/*  var newPostKey = firebase.database().ref().child('testTeam').push().key;
  firebase.database().ref('testTeam/' + newPostKey).set(teamForm.value);
{teamform: {this: 'that', biff: 'baff'}}
  */
  this.customTeam.push(entry);

}

setCampaignData(
    campaignName: string,
    myForm: any,
    ) {
  console.log('FUNC: setCampaignData() ---> Data Service');
  let url =  "https://ngdataformdemo.firebaseio.com/emails/" + campaignName + ".json";
  const body = JSON.stringify(myForm.value);
      console.log(body);

   return this.http.put(url, body);
/*     .map((response: Response) => response.json());
*/}


/////// DELETE DATA  ///////////

deleteCampaignData(campaignName?: string) {
    console.log('FUNC: deleteCampaignData(' + campaignName + ') ---> Data Service');
   this.campaigns.remove(campaignName);

}

deleteMemberData(teamMemberId: string) {
      console.log('FUNC: deleteMemberData(' + teamMemberId + ') ---> Data Service');
   this.customTeam.remove(teamMemberId);

}

}
