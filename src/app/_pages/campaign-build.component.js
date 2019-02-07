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
var forms_1 = require("@angular/forms");
// import { Data } from './data.class';
// import { Model } from './model.class';
// import { IData } from './data.interface';
// import { IModel } from './model.interface';
// import { Email } from './email.interface';
var data_service_1 = require("./data.service");
var NewFormComponent = (function () {
    /*// PermData
    dataKeysTxtTypeisHeader: any = [];*/
    function NewFormComponent(dataService, _fb) {
        this.dataService = dataService;
        this._fb = _fb;
        // Showw/Hide interfaces
        this.DetailsInputisActive = true;
        this.DataKeysInputisActive = true;
        // Showw/Hide Data Tables
        // IsTextContent: boolean = false;
        this.IsDataKey = false;
        // UI Editor Data
        this.isEditor = false;
        this.linksNotFound = false;
        this.newDataKeyLinks = [];
    }
    NewFormComponent.prototype.ngOnInit = function () {
        this.newModel = new Model();
        // this.newModelTxt = new Txt();
        this.newModelLinks = new Links();
        // [Validators.pattern(urlRegex)]
        // const urlRegex = '/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g';
        this.myForm =
            this._fb.group({
                author: ['', [forms_1.Validators.required]],
                description: ['', [forms_1.Validators.required]],
                title: ['', [forms_1.Validators.required, forms_1.Validators.minLength(3)]],
                version: ['', [forms_1.Validators.required]],
                tempData: this._fb.group({
                    name: ['model', [forms_1.Validators.required, forms_1.Validators.minLength(3)]],
                    href: ['add a link'],
                    cta: ['add a cta', [forms_1.Validators.required, forms_1.Validators.minLength(3)]],
                    heading: ['add a heading', [forms_1.Validators.required, forms_1.Validators.minLength(3)]],
                    copy: ['add a heading', [forms_1.Validators.required, forms_1.Validators.minLength(3)]],
                    txt: this._fb.array([]),
                    links: this._fb.array([])
                }),
                dataKeys: this._fb.array([])
            });
    };
    /////// DISPLAY INPUTS ///////////
    NewFormComponent.prototype.toggleDetailsInput = function () {
        this.DetailsInputisActive = !this.DetailsInputisActive;
    };
    NewFormComponent.prototype.toggleDataKeyInput = function () {
        // Hide the Details input if it's expanded
        if (this.DetailsInputisActive === true) {
            this.toggleDetailsInput();
        }
        ;
        // Clear all temp/model data
        this.clearData();
        // Define UI type (for submit button)
        this.isEditor = false;
        console.log('isEditor' + this.isEditor);
        this.DataKeysInputisActive = !this.DataKeysInputisActive;
    };
    /* move () {
         this._router.navigate( ['/somepath', id ], {fragment: 'test'});
    }*/
    /////// DISPLAY EDITOR ///////////
    NewFormComponent.prototype.toggleEditorInput = function (i) {
        // Clear All data
        this.clearData();
        // Define UI type (for submit button)
        this.isEditor = true;
        console.log(this.isEditor);
        // console.log('currentDataKey: ' + this.currentDataKey);
        // If clicking 'edit' on the same dataKey UI that IS open/'active' - just close it
        if (this.currentDataKey === i && this.DataKeysInputisActive === true) {
            this.toggleDataKeyInput();
            this.DataKeysInputisActive = false;
            console.log('DataKeysInputisActive is: ' + this.DataKeysInputisActive);
        }
        else {
            this.currentDataKey = i;
            console.log('currentDataKey: ' + this.currentDataKey);
            this.setModel(i);
            this.setModelLinks();
            this.setDataKeyLinks();
            this.setTempDataLinks();
            // clear the data when closing the UI
            // this.toggleDataKeyInput();
            /* if (this.DataKeysInputisActive === false ) {
                 this.DataKeysInputisActive = !this.DataKeysInputisActive;
             };*/
            this.DataKeysInputisActive = true;
            console.log('DataKeysInputisActive is: ' + this.DataKeysInputisActive);
        }
        ;
    };
    /////////// TESTING ////////////
    NewFormComponent.prototype.isEditorTrue = function (i) {
        console.log('currentdataKey was ' + this.currentDataKey);
        this.isEditor = true;
        console.log(this.isEditor);
        this.currentDataKey = i;
        console.log('currentdataKey is ' + this.currentDataKey);
    };
    /////////// TESTING ////////////
    NewFormComponent.prototype.flip = function () {
        if (this.DataKeysInputisActive === false) {
            this.DataKeysInputisActive = !this.DataKeysInputisActive;
        }
        ;
    };
    NewFormComponent.prototype.setModel = function (i) {
        // build Model from DataKey
        var dataKeysValues = this.myForm.value['dataKeys'][i];
        var modelValues = this.newModel;
        for (var n in dataKeysValues) {
            modelValues[n] = dataKeysValues[n];
        }
        ;
    };
    NewFormComponent.prototype.setModelLinks = function () {
        // build ModelLinks from Model.links
        var modelLinksValues = this.newModel.links;
        var modLinks = this.newModelLinks;
        for (var n in modelLinksValues) {
            modLinks[n] = modelLinksValues[n];
        }
        ;
    };
    NewFormComponent.prototype.setDataKeyLinks = function () {
        var modelLinksValues = this.newModel.links;
        var DataKeyLinksValues = this.newDataKeyLinks;
        for (var n in modelLinksValues) {
            DataKeyLinksValues[n] = modelLinksValues[n];
        }
        ;
    };
    NewFormComponent.prototype.setTempDataLinks = function () {
        // build tempDataLinks from Model.links
        var modelLinksValues = this.newModel.links;
        var tempDataControl = this.myForm.controls['tempData'];
        var tempDatalinkControl = tempDataControl.controls['links'];
        for (var i in modelLinksValues) {
        }
    };
    NewFormComponent.prototype.initModelLinks = function (i) {
        return this._fb.group({
            linkName: [this.newModelLinks[i].linkName],
            text: [this.newModelLinks[i].text],
            href1: [this.newModelLinks[i].href1],
            link: [this.newModelLinks[i].link],
        });
    };
    /*  buildTempData() {
      // Values
      // let dataKeysValues = this.myForm.value['dataKeys'][i];
    
      // dataKeysControl
      const tempDataControl = <FormGroup>this.myForm.controls['tempData'];
      const tempDataValue = <FormGroup>this.myForm.value['tempData'];
    
      // const tempDatalinkControl = <FormArray> tempDataControl.controls['links'];
    
    
      const dataKeysControl = <FormArray>this.myForm.controls['dataKeys'];
      const dataKeyControl = <FormGroup>dataKeysControl.controls[0];
    
      console.log('dk: ' + dataKeyControl);
      console.log('temp: ' + tempDataControl);
    
        for (let n in dataKeyControl) {
              tempDataControl[n] = dataKeyControl[n];
        };*/
    /* let modelValues  = this.newModel;
      for (let n in modelValues) {
            tempDataControl[n] = modelValues[n];
      };*/
    //}
    /*
     buildNewDataKeyLinks() {
      let linksValues = this.newDataKeyLinks;
      let modLinks  = this.newModelLinks;
    
        for (let i in modLinks) {
            linksValues[i] = modLinks[i];
           };
    }*/
    /*rebuildTempDataLinks() {
       // let dataKeysLinkValues = this.myForm.value['dataKeys'][i]['links'];
        let modelLinksValues = this.newModel.links;
    
        const tempDataControl = <FormGroup>this.myForm.controls['tempData'];
        const tempDatalinkControl = <FormArray> tempDataControl.controls['links'];
    
        for (let i in modelLinksValues) {
            //  console.log(modelLinksValues[i]);
             tempDatalinkControl.push(this.initModelLinks(i));
             }
      }*/
    /////// DISPLAY LINKS UI ///////////
    NewFormComponent.prototype.getLinks = function (i) {
        this.clearLinksData();
        this.findLinks(); // Ready to push to dataKey
        this.buildModelLinks();
        this.buildTempDataLinks();
    };
    NewFormComponent.prototype.buildModelLinks = function () {
        // build ModelLinks from newDataKeyLinks
        var linksValues = this.newDataKeyLinks;
        var modLinks = this.newModelLinks;
        for (var n in linksValues) {
            modLinks[n] = linksValues[n];
        }
        ;
    };
    NewFormComponent.prototype.buildTempDataLinks = function () {
        // build tempDataLinks from newDataKeyLinks
        var linksValues = this.newDataKeyLinks;
        var tempDataControl = this.myForm.controls['tempData'];
        var tempDataLinkControl = tempDataControl.controls['links'];
        for (var i in linksValues) {
        }
    };
    NewFormComponent.prototype.initDataKeyLinks = function (i) {
        return this._fb.group({
            linkName: [this.newDataKeyLinks[i].linkName],
            text: [this.newDataKeyLinks[i].text],
            href1: [this.newDataKeyLinks[i].href1],
            link: [this.newDataKeyLinks[i].link],
        });
    };
    /*  pushTempData() {
            // Array of dataKeys
            const control = <FormArray>this.myForm.controls['tempData'];
            control.push(this.initData());
      }*/
    /////// SAVE DATA KEY ///////////
    NewFormComponent.prototype.addNew = function (i, j) {
        // Array of dataKeys
        var control = this.myForm.controls['dataKeys'];
        // create newDataKeyLinks array to push to new dataKey   
        // this.compileCopyLinks();
        // map tempData to new dataKey formGroup
        control.push(this.initData());
        // If this is the first dataKey being added then display the dataKey table
        if (this.IsDataKey === false) {
            this.IsDataKey = !this.IsDataKey;
        }
        ;
        // Clear tempData
        // this.clearData();
        // Close UI 
        // causing tempdata not to clear or repopulate??????
        this.toggleDataKeyInput();
        // Move back up to view DataKeys table
        window.location.hash = '#anchorName';
        // This resets - removing the anchor from url:
        // this is a hack fix as the has only works the first time it's clicked!! 
        history.pushState('', document.title, window.location.pathname
            + window.location.search);
        // window.location.hash = 'anchorName';
        // location.hash = '#anchorName';
        // this._router.navigate( ['/somepath', id ], {fragment: 'test'});
    };
    NewFormComponent.prototype.saveChanges = function (j) {
        var modelControl = this.myForm.controls['tempData'];
        var modelNameControl = modelControl.controls['name'];
        var dataKeysControl = this.myForm.controls['dataKeys'];
        var dataKeyControl = dataKeysControl.controls[this.currentDataKey];
        var dataKeyNameControl = dataKeyControl.controls['name'];
        /*console.log(modelControl.value);
        console.log(modelNameControl.value);
        console.log(dataKeyNameControl.value);
        console.log(this.currentDataKey);*/
        // If the dataKey allready exists - update the existing values
        if (modelNameControl.value === dataKeyNameControl.value) {
            console.log('Upoating Existing DataKey');
            // build DataKeyValues from tempData Values
            var dataKeysValues = this.myForm.value['dataKeys'][this.currentDataKey];
            var tempDataValues = modelControl.value;
            for (var o in tempDataValues) {
                dataKeysValues[o] = tempDataValues[o];
            }
            ;
        }
        else {
            // Array of dataKeys
            var control = this.myForm.controls['dataKeys'];
            // create newDataKeyLinks array to push to new dataKey   
            // this.compileCopyLinks();
            // map tempData to new dataKey formGroup
            control.push(this.initData());
        }
        // If this is the first dataKey being added then display the dataKey table
        if (this.IsDataKey === false) {
            this.IsDataKey = !this.IsDataKey;
        }
        ;
        // Close UI 
        // causing tempdata not to clear or repopulate??????
        this.toggleDataKeyInput();
        // Move back up to view DataKeys table
        window.location.hash = '#anchorName';
        // This resets - removing the anchor from url:
        // this is a hack fix as the has only works the first time it's clicked!! 
        history.pushState('', document.title, window.location.pathname
            + window.location.search);
        // window.location.hash = 'anchorName';
        // location.hash = '#anchorName';
        // this._router.navigate( ['/somepath', id ], {fragment: 'test'});*/
    };
    NewFormComponent.prototype.findLinks = function () {
        var copy = this.newModel.copy;
        var copyLinks = this.newDataKeyLinks;
        var obj = {};
        if (copy) {
            var outputLinks = function (match, p1, p2, offset, string) {
                obj = {};
                obj['linkName'] = p1;
                obj['text'] = p2;
                obj['href1'] = '';
                obj['link'] = "{% import 'macros/link-macro.html' as Link -%}{{Link.declare(" + p1 + ")}";
                copyLinks.push(obj);
            };
            copy.replace(/{{(.*?)\|(.*?)}}/g, outputLinks);
        }
        // Show error if no links found
        console.log(copyLinks);
        if (!copyLinks.length) {
            this.linksNotFound = true;
        }
        else {
            this.linksNotFound = false;
        }
        ;
    };
    /*pushDataKey(i: number, j: number) {
          // Array of dataKeys
          const control = <FormArray>this.myForm.controls['dataKeys'];
          control.push(this.initData());
    }*/
    // map tempData to new formGroup
    NewFormComponent.prototype.initData = function () {
        return this._fb.group({
            name: [this.newModel.name],
            href: [this.newModel.href],
            cta: [this.newModel.cta],
            heading: [this.newModel.heading],
            copy: [this.newModel.copy],
            /*txt: this._fb.array(
                 this.newDataKeyTxt
            ),*/
            links: this._fb.array(this.newDataKeyLinks)
        });
    };
    /////// CLEAR / DELETE DATA ///////////
    NewFormComponent.prototype.clearData = function () {
        // this.clearInputs();
        this.clearModel();
        this.clearModelLinks();
        this.clearNewDataKeyLinks();
        this.clearTempDataLinks();
        this.clearTempData();
    };
    /*clearInputs() {
    // Clear input Values
            (<HTMLInputElement>document.getElementById('name')).value;
            (<HTMLInputElement>document.getElementById('href')).value;
            (<HTMLInputElement>document.getElementById('cta')).value;
            (<HTMLInputElement>document.getElementById('heading')).value;
            (<HTMLInputElement>document.getElementById('copy')).value;
    }*/
    NewFormComponent.prototype.clearLinksData = function () {
        this.clearModelLinks();
        this.clearNewDataKeyLinks();
        this.clearTempDataLinks();
    };
    NewFormComponent.prototype.clearModel = function () {
        var obj = this.newModel;
        for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
            var prop = _a[_i];
            delete obj[prop];
        }
    };
    NewFormComponent.prototype.clearModelLinks = function () {
        // Empty ModelLinks
        var obj = this.newModelLinks;
        for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
            var prop = _a[_i];
            delete obj[prop];
        }
    };
    NewFormComponent.prototype.clearModelDotlinks = function () {
        // Empty Model.links
        var obj = this.newModel.links;
        for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
            var prop = _a[_i];
            delete obj[prop];
        }
    };
    NewFormComponent.prototype.clearNewDataKeyLinks = function () {
        // Empty DataKeys 'Links'
        /* for (n in  this.newDataKeyLinks) {
   
           let link = this.newDataKeyLinks[n];
   
             for (m in  this.temp) {
   
               if link !== this.temp[m];
             }
          }*/
        this.newDataKeyLinks = [];
    };
    NewFormComponent.prototype.clearTempData = function () {
        var modelValue = this.myForm.value['tempData'];
        for (var i in modelValue) {
            delete modelValue[i];
        }
    };
    NewFormComponent.prototype.clearTempDataLinks = function () {
        var modelControl = this.myForm.controls['tempData'];
        var linkControl = modelControl.controls['links'];
        // Empty Temp Data 'Links'
        // http://stackoverflow.com/questions/36839088/remove-multiple-controls-from-controlarray
        while (linkControl.length) {
            linkControl.removeAt(0);
        }
        ;
    };
    NewFormComponent.prototype.removeDataKey = function (i) {
        var control = this.myForm.controls['dataKeys'];
        control.removeAt(i);
        // this.dataKeysTxtTypeisHeader.splice(i, 1);
    };
    /////// SET DATA ///////////
    NewFormComponent.prototype.setCampaign = function () {
        var _this = this;
        // changed var to let and "" to ''
        //  const campaignName = '/' + this.myForm.value.title + '_v' + this.myForm.value.version + '/';
        // same result either way when slahses removed?!
        var campaignName = this.myForm.value.title + '_v' + this.myForm.value.version;
        console.log('campaign name is ' + campaignName);
        this.dataService
            .setCampaignData(campaignName, this.myForm)
            .subscribe(function (campaignName) { return _this.campaign = (campaignName); } // WHY IS THIS BIT REQUIRED ???? 
        );
        alert(campaignName + 'has been saved to the database');
    };
    return NewFormComponent;
}());
NewFormComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'new-form',
        templateUrl: 'new-form.component.html',
        styleUrls: ['form.component.css'],
    }),
    __metadata("design:paramtypes", [data_service_1.DataService,
        forms_1.FormBuilder])
], NewFormComponent);
exports.NewFormComponent = NewFormComponent;
var Campaign = (function () {
    function Campaign(author, description, title, version, tempData, datakeys) {
        this.author = author;
        this.description = description;
        this.title = title;
        this.version = version;
        this.tempData = tempData;
        this.datakeys = datakeys;
    }
    return Campaign;
}());
exports.Campaign = Campaign;
var Model = (function () {
    function Model() {
    }
    return Model;
}());
exports.Model = Model;
var Datakeys = (function () {
    function Datakeys() {
    }
    return Datakeys;
}());
exports.Datakeys = Datakeys;
var Links = (function () {
    function Links() {
    }
    return Links;
}());
exports.Links = Links;
//# sourceMappingURL=new-form.component.js.map