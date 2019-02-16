import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../_services/data.service';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import * as _ from "lodash";


@Component({
  selector: 'new-form',
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
  public arrayOfPersonnelIds: any;
  public newCampaignName: string = '';
  public personnelAssignedToRole: any = {};

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
        // console.log('results:');
        // console.log(results[0]);
        console.log('this.testTeam:');
        console.log(this.testTeam);
        console.log('this.customTeam:');
        console.log(this.customTeam);
        this.fullTeam = Object.assign(this.testTeam, this.customTeam);
        console.log('this.fullTeam:');
        console.log(this.fullTeam);
        this.arrayOfPersonnelIds = Object.keys(this.fullTeam);
        console.log(this.arrayOfPersonnelIds);
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
    rolesrRecord.setValue(this.personnelAssignedToRole);
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

  setPersonnel(role, personnelId, Idtype) {
    console.log('Func: setPersonnel()');
    console.log('personnelId: ' + personnelId);
    console.log('role: ' + role);

    // Set Personnel data based on role and id    
    const roleEmail = role + 'Email';
    const roleControl = <FormControl>this.myForm.controls[role];
    const roleEmailControl = <FormControl>this.myForm.controls[roleEmail];
    roleControl.setValue(this.testTeam[personnelId].name);
    roleEmailControl.setValue(this.testTeam[personnelId].email);

    // Prevent selecting same team member twice
    // http://jsfiddle.net/nDGu8/8/
    if (this.personnelAssignedToRole[Idtype]) {
      let s = document.querySelectorAll('option[value="' + this.personnelAssignedToRole[Idtype] + '"]');
      [].forEach.call(s, function (option) {
        option.disabled = false;
      });
    }
    let s = document.querySelectorAll('option[value="' + personnelId + '"]');
    [].forEach.call(s, function (option) {
      if (option.parentNode !== this) {
        option.disabled = true;
      }
    }, this);
    this.personnelAssignedToRole[Idtype] = personnelId;

  }



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
      (campaignName: any) => {this.campaign = (campaignName); // WHY IS THIS BIT REQUIRED?
        this.setName();
      });
    alert(campaignName + 'has been saved to the database'); //rewrite - succes/fail

  }



}

