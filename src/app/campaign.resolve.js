"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var data_service_1 = require("./data.service");
var CampaignResolve = (function () {
    function CampaignResolve(dataService) {
        this.dataService = dataService;
    }
    CampaignResolve.prototype.resolve = function (route) {
        return this.dataService.getCampaignData(route.params['id']);
    };
    return CampaignResolve;
}());
CampaignResolve = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [data_service_1.DataService])
], CampaignResolve);
exports.CampaignResolve = CampaignResolve;
// Angular2 - turn 'activatedRoute.params' into promise
//http://stackoverflow.com/questions/39902216/angular2-turn-activatedroute-params-into-promise
//# sourceMappingURL=campaign.resolve.js.map