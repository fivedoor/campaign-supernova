import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../_services/data.service';
import { Campaign } from '../_classes/campaign.class';


@Component({
 /* moduleId: module.id,*/
  selector: 'my-library',
  templateUrl: 'campaign-library.component.html',
/*  styles: ['a.disabled { pointer-events: none; cursor: default;}'],
*/  styleUrls: [ 'campaign-library.component.css' ],
  outputs: ['campaign']
})
export class LibraryComponent implements OnInit {

  public campaign: Campaign;  // Is this needed? Class does not cover all possibiliities?

  // campaign: Campaign[] = [];
  // campaign: any[];

  campaigns: any[];
  public arrayOfKeys: any;

  demoCampaigns: any[];
  demoCampaignTitles: any;


  constructor(
    private dataService: DataService,
    private router: Router
   ) {}

  ngOnInit(): void {
     // this.getCampaign();
      //  this.getCampaignNames();
        this.getCampaigns();
        this.getDemoCampaigns();
  }

    deleteCampaign(campaign: any) {
        // Prevent page clcik through
        //  not working
         // event.stopPropagation();

        // ignores tbe button function and goes to page!
        // return false;

        let r = confirm("Are you sure you want to permanently delete the data for this campaign " + campaign );
        if (r == true) {
          this.dataService
              .deleteCampaignData(campaign);
          // Refresh the loaded emails
        //   this.getCampaignNames();
        this.getCampaigns();
        this.getDemoCampaigns();
            alert("The campaign was deleted!");
        } else {
            alert("That was a close call! You almost deleted that campaign completely. Careful now. Breath. Reflect. Now let it go. Move on.");
        }
    }


    /////// GET DATA ///////////

    // Get single campaign data
    /*getCampaign(campaign: string) {
        this.dataService
          .getCampaignData(campaign)
          .subscribe(
            (campaign: any) => this.campaign = (campaign)
          );
           console.log(campaign);
    }*/

    // Get all campaign campaigns
     getCampaigns() {
        this.dataService
          .getCampaignsData('emails')
          .subscribe(
            (campaigns: any) => {
              this.campaigns = (campaigns);
              // Get names array
              this.arrayOfKeys = Object.keys(this.campaigns);
            console.log('this.campaigns: ');
            console.log(this.campaigns);
            console.log('this.arrayOfKeys: ');
            console.log(this.arrayOfKeys);

            }
          );
          console.log('Got email campaigns');
    }


       getDemoCampaigns() {
        this.dataService
          .getCampaignsData('demos')
          .subscribe(
            (demoCampaigns: any) => {
              this.demoCampaigns = (demoCampaigns);
              this.demoCampaignTitles = Object.keys(this.demoCampaigns);
             console.log('this.demoCampaigns: ');
            console.log(this.demoCampaigns);
            console.log('this.arrayOfKeys: ');
            console.log(this.arrayOfKeys);            }
          );
          console.log('Got demo campaigns');
    }

    // Get all campaign names (keys)
   /* getCampaignNames() {
        this.dataService
          .getCampaignsData()
          .subscribe(
            (campaigns: any) => this.campaignTitles = Object.keys(campaigns)
            // .slice(0, 3)
          );
          console.log('Got campaign names');

      }
*/
}
