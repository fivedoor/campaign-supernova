import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { DataService } from './_services/data.service';

@Injectable()
export class CampaignResolve implements Resolve<any> {

  constructor(private dataService: DataService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.dataService.getCampaignData(route.params['id'], route.params['type']);
  }
}

// Angular2 - turn 'activatedRoute.params' into promise
//http://stackoverflow.com/questions/39902216/angular2-turn-activatedroute-params-into-promise

