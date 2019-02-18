import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../_services/data.service';
import { Campaign } from '../_classes/campaign.class';


@Component({
  selector: 'my-library',
  templateUrl: 'campaign-library.component.html',
  styleUrls: [ 'campaign-library.component.css' ],
  outputs: ['campaign']
})
export class LibraryComponent implements OnInit {

  public campaign: Campaign;  // Is this needed? Class does not cover all possibiliities?
  public campaigns: any[];
  public CampaignTitles: any;
  public demoCampaigns: any[];
  public demoCampaignTitles: any;


  constructor(
    private dataService: DataService,
    private router: Router
   ) {}

  ngOnInit(): void {
        this.getCampaigns();
        this.getDemoCampaigns();
  }

    deleteCampaign(campaign: any) {
 
        let r = confirm("Are you sure you want to permanently delete the data for this campaign " + campaign );
        if (r == true) {
          this.dataService
              .deleteCampaignData(campaign);
          // Refresh the loaded emails
        this.getCampaigns();
        this.getDemoCampaigns();
            alert("The campaign was deleted!");
        } else {
            alert("That was a close call! You almost deleted that campaign completely. Careful now. Breath. Reflect. Now let it go. Move on.");
        }
    }


    /////// GET DATA ///////////


    // Get all campaign campaigns
     getCampaigns() {
        this.dataService
          .getCampaignsData('emails')
          .subscribe(
            (campaigns: any) => {
              this.campaigns = (campaigns);
              // Get names array
              this.CampaignTitles = Object.keys(this.campaigns);
            console.log('campaigns: ');
            console.log(this.campaigns);
            console.log('CampaignTitles: ');
            console.log(this.CampaignTitles);

            }
          );
    }


       getDemoCampaigns() {
        this.dataService
          .getCampaignsData('demos')
          .subscribe(
            (demoCampaigns: any) => {
              this.demoCampaigns = (demoCampaigns);
              this.demoCampaignTitles = Object.keys(this.demoCampaigns);
             console.log('demoCampaigns: ');
            console.log(this.demoCampaigns);
            console.log('demoCampaignTitles: ');
            console.log(this.demoCampaignTitles);            }
          );
    }


}
