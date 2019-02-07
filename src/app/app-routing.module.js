"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var dashboard_component_1 = require("./dashboard.component");
var form_component_1 = require("./form.component");
var new_form_component_1 = require("./new-form.component");
var campaign_resolve_1 = require("./campaign.resolve");
var can_deactivate_guard_service_1 = require("./can-deactivate-guard.service");
var routes = [
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        component: dashboard_component_1.DashboardComponent,
        canDeactivate: [can_deactivate_guard_service_1.CanDeactivateGuard]
    },
    {
        path: 'form/:id',
        component: form_component_1.FormComponent,
        //    data : {some_data : 'some value'}
        resolve: { campaign: campaign_resolve_1.CampaignResolve }
    },
    {
        path: 'new-form',
        component: new_form_component_1.NewFormComponent
    }
];
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    return AppRoutingModule;
}());
AppRoutingModule = __decorate([
    core_1.NgModule({
        imports: [router_1.RouterModule.forRoot(routes)],
        exports: [router_1.RouterModule]
    })
], AppRoutingModule);
exports.AppRoutingModule = AppRoutingModule;
exports.routedComponents = [dashboard_component_1.DashboardComponent, form_component_1.FormComponent, new_form_component_1.NewFormComponent];
//# sourceMappingURL=app-routing.module.js.map