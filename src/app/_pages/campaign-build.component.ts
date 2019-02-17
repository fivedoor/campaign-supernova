import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../_services/data.service';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import * as _ from "lodash";


@Component({
/*  moduleId: module.id,
https://stackoverflow.com/questions/37178192/angular-what-is-the-meanings-of-module-id-in-component */  selector: 'new-form',
  templateUrl: 'campaign-build.component.html',
  styleUrls: [ 'campaign-build.component.css' ],

})

export class NewFormComponent implements OnInit {

    public myForm: FormGroup;

    @ViewChild('myInput')
    myInputVariable: any;

   public campaign: any;

    // Campaign Team
   public testTeam: any[];
   public customTeam: any[];
   public fullTeam: any[];
   public arrayOfKeys: any;
    newCampaignName: string = '';
    old_values: any = {};

  constructor(
      private dataService: DataService,
      private _fb: FormBuilder,
      private router: Router

      ) {}


  ngOnInit(): void {
       

        this.dataService.getAllTeamData()
      .subscribe(
        (results: any) => {
             this.testTeam = results[0];
             this.customTeam = results[1];
             console.log('results:');
             console.log(results[0]);
             console.log('this.testTeam:');
             console.log(this.testTeam);
              console.log('this.customTeam:');
             console.log(this.customTeam);
             this.fullTeam = Object.assign(this.testTeam, this.customTeam);
             console.log('this.fullTeam:');
             console.log(this.fullTeam);
             this.arrayOfKeys = Object.keys(this.fullTeam);
             console.log(this.arrayOfKeys);
        });

   

    const versionRegex = /^[^.]+$/;


 // FORM
    this.myForm =
        this._fb.group({
                author: ['', [Validators.required]],
                authorEmail: [''],
                authorId: [''],
                owner: ['', [Validators.required]],
                ownerId: [''],
                ownerEmail: [''],
                qa: ['', [Validators.required]],
                qaEmail: [''],
                qaId: [''],
                description: ['', [Validators.required, Validators.minLength(10)]],
                title: ['', [Validators.required, Validators.minLength(3)]],
                version: [''],
                rolesrecord: [''],
        });

    }

setName() {

  const versionControl = <FormControl>this.myForm.controls['version'].value;
  const titleControl = <FormControl>this.myForm.controls['title'].value;

  let value = titleControl + '_v' + versionControl;
         this.router.navigate(['form/emails/' + value]);
}

setRolesRecord() {
    const rolesrRecord = <FormControl>this.myForm.controls['rolesrecord'];
    rolesrRecord.setValue(this.old_values);
}

//////// INFO ////////////

 infoAlert(infoId, idNumber) {
   if (!idNumber) {
    const popup = document.getElementById(infoId);
    popup.classList.toggle("show");
  }
  if (idNumber) {
     const fullId = infoId + idNumber;
    const popup = document.getElementById(fullId);
    popup.classList.toggle("show");
  }

}


/////// DISPLAY EDITOR ///////////

setPersonel(role, personId, title) {
    console.log('Func: setPersonel()');
    // Set Personel data based on id
    console.log(personId);

    const roleEmail = role + 'Email';
    console.log(roleEmail);

    const roleControl = <FormControl>this.myForm.controls[role];
    const roleEmailControl = <FormControl>this.myForm.controls[roleEmail];

    roleControl.setValue(this.testTeam[personId].name);
    roleEmailControl.setValue(this.testTeam[personId].email);

    // Prevent selecting same team member twice
    // http://jsfiddle.net/nDGu8/8/
    if (this.old_values[title]) {
        let s = document.querySelectorAll('option[value="' + this.old_values[title] + '"]');
        [].forEach.call(s, function (option) {
            option.disabled = false;
        });
    }
    let s = document.querySelectorAll('option[value="' + personId + '"]');
    [].forEach.call(s, function (option) {
        if (option.parentNode !== this) {
            option.disabled = true;
        }
    }, this);
    this.old_values[title] = personId;

 };



    /////// SET DATA ///////////

 setCampaign() {
  console.log('FUNC: setCampaign()');

    // changed var to let and "" to ''
    //  const campaignName = '/' + this.myForm.value.title + '_v' + this.myForm.value.version + '/';
    // same result either way when slahses removed?!

    this.setRolesRecord();
    
    const campaignName = this.myForm.value.title + '_v' + this.myForm.value.version ;
    console.log('campaign name is ' + campaignName);

    this.dataService
      .setCampaignData(
          campaignName,
          this.myForm
          )
      .subscribe(
        (campaignName: any) => {this.campaign = (campaignName); // WHY IS THIS BIT REQUIRED ???? 
                                this.setName();
                              });
       alert(campaignName + 'has been saved to the database');

  }



}

