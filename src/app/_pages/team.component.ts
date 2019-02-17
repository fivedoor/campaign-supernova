import { Component, OnInit, Output } from '@angular/core';
import { DataService } from '../_services/data.service';
import { Router } from '@angular/router';
import { Campaign } from '../_classes/campaign.class';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';



@Component({
 /* moduleId: module.id,*/
  selector: 'my-team',
  templateUrl: 'team.component.html',
/*  styles: ['a.disabled { pointer-events: none; cursor: default;}'],
*/  styleUrls: [ 'team.component.css' ]
})
export class TeamComponent implements OnInit {
    
    public memberForm: FormGroup;
    public testTeam: any;
    public arrayOfTeamIds: any;

    public customTeam: any;
    public arrayOfCustomTeamIds: any;

   TeamInputisActive: boolean = false;

    // objectKeys = Object.keys;

  constructor(
    private router: Router,
    private dataService: DataService,
    private _fb: FormBuilder,
    ) {
  }


  ngOnInit(): void {
          this.getTeam();
          this.getCustomTeam();


const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      // FORM
    this.memberForm =
        this._fb.group({
                name: ['', [Validators.required, Validators.minLength(3)]],
                email: ['', [Validators.required, Validators.pattern(emailRegex)]],
                role: ['', [Validators.required, Validators.minLength(3)]],
        });
  }


toggleTeamInput(): void {
      console.log('FUNC: toggleTeamInput()');
      this.TeamInputisActive = !this.TeamInputisActive;
      // location.hash = '#details';
    }


getTeam() {
     this.dataService.getTeamData('testTeam')
      .subscribe(
        (testTeam: any) => {
          this.testTeam = testTeam;
             console.log('testTeam:');
             console.log(testTeam);
             console.log('this.testTeam:');
             console.log(this.testTeam);
             this.arrayOfTeamIds = Object.keys(this.testTeam);
             console.log('this.arrayOfTeamIds:' + this.arrayOfTeamIds);
        });
    }

 getCustomTeam() {
     this.dataService.getTeamData('customTeam')
      .subscribe(
        (customTeam: any) => {
          this.customTeam = customTeam;
             console.log('customTeam:');
             console.log(customTeam);
             console.log('this.customTeam:');
             console.log(this.customTeam);
             this.arrayOfCustomTeamIds = Object.keys(this.customTeam);
             console.log('this.arrayOfTeamIds:' + this.arrayOfCustomTeamIds);
        });
    }

 addMember() {
       console.log('FUNC: addMember()');
       const teamMember = this.memberForm.value.name;
       const teamMemberId = this.memberForm.value.id;

        this.dataService
          .writeUserData(
              teamMemberId,
              this.memberForm
              )
         // this.getTeam();
          this.getCustomTeam();
          this.clearFormData();
          this.toggleTeamInput();
         /* .subscribe(
            (testTeam: any) => this.memberForm = (testTeam)
          );*/
           alert(teamMember + ' has been saved to the database');
          /* this.router.navigate(['campaign-team/']);*/
         
    }

 clearFormData() {
    // Causes tempData to repopulate ??
       console.log('FUNC: clearFormData()');
       const nameControl =  <FormControl>this.memberForm.controls['name'];
       const emailControl =  <FormControl>this.memberForm.controls['email'];
       const roleControl =  <FormControl>this.memberForm.controls['role'];

       nameControl.patchValue('');
       emailControl.patchValue('');
       roleControl.patchValue('');
  }

   deleteMember(teamMemberId: any, name: string) {

        let r = confirm("Are you sure you want to permanently delete " + name + ". Personally I'm not a fan of this loser but it's your call." );
        if (r == true) {
          this.dataService
              .deleteMemberData(teamMemberId);
          // Refresh the loaded emails
       // this.getTeam();
       this.getCustomTeam();

            alert(name + " was deleted!");
        } else {
            alert("That was a close call! You almost deleted a valuable member of your team! I was only kidding by the way, I have a lot of respect for " + name + ". ");
        }
    }

}
