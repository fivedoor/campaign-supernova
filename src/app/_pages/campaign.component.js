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
var router_1 = require("@angular/router");
// import { Data } from './data.class';
// import { Model } from './model.class';
// import { IData } from './data.interface';
// import { IModel } from './model.interface';
// import { Email } from './email.interface';
var data_service_1 = require("./data.service");
//import { ViewContainerRef, ViewEncapsulation } from '@angular/core';
//import { Overlay, overlayConfigFactory } from 'angular2-modal';
//import { Modal } from 'angular2-modal/plugins/bootstrap';
//import { CustomModalContext, CustomModal } from './custom-modal-sample';
//import * as saveAs from 'file-saver'; // FAILING
// http://stackoverflow.com/questions/40240796/angular-2-best-approach-to-use-filesaver-js
// https://github.com/eligrey/FileSaver.js/issues/308
var saveAs = require('file-saver');
//let file = new Blob([data], { type: 'text/csv;charset=utf-8' });
//saveAs(file, 'helloworld.csv');
//import * as jsonfile from 'jsonfile';
var FormComponent = (function () {
    // Edit Data test
    // newDatakeys: Datakeys;
    // PermData
    // dataKeysTxtTypeisHeader: any = [];
    // Pass data to nested component (now using routing instead)
    // @Input() childData: any;
    function FormComponent(
        // public modal: Modal,
        dataService, activatedRoute, _fb) {
        this.dataService = dataService;
        this.activatedRoute = activatedRoute;
        this._fb = _fb;
        // Approvals buttons
        this.CampaignAproved = false;
        // Showw/Hide interfaces
        this.DetailsInputisActive = false;
        this.DataKeysInputisActive = false;
        this.DataKeysEditorisActive = [];
        // Showw/Hide Data Tables
        // IsTextContent: boolean = false;
        this.IsDataKey = false;
        // UI Editor Data
        this.isEditor = false;
        this.currentDataKey = 0;
        this.linksNotFound = false;
        this.newDataKeyLinks = [];
    }
    FormComponent.prototype.ngOnInit = function () {
        var _this = this;
        // This seems to get the id from htp used to display heading
        this.activatedRoute.params
            .subscribe(function (params) {
            _this.id = params['id'];
        });
        console.log('Assembling the form for ' + this.id);
        // This is just dummy expression in part - NEED TP REWRITE!!!!
        // this.buildForm();
        this.dataService.getCampaignData('BigBank_v2')
            .subscribe(function (campaign) {
            _this.campaign = _this.activatedRoute.snapshot.data['campaign'];
            _this.createDataKeys();
            _this.createLinkKeys();
            // this.createTextKeys();
            _this.setFormValues();
            _this.setAprovalStatus();
        });
        // this.newDatakeys = new Datakeys (); // Edit Data test
        this.newModel = new Model();
        // this.newModelTxt = new Txt();
        this.newModelLinks = new Links();
        // [Validators.pattern(urlRegex)]
        // const urlRegex = '/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g';
        // FORM
        this.myForm =
            this._fb.group({
                author: ['', [forms_1.Validators.required]],
                owner: ['', [forms_1.Validators.required]],
                description: ['', [forms_1.Validators.required]],
                title: ['', [forms_1.Validators.required, forms_1.Validators.minLength(3)]],
                version: ['', [forms_1.Validators.required]],
                aproved: [false, [forms_1.Validators.required]],
                tempData: this._fb.group({
                    name: ['', [forms_1.Validators.required, forms_1.Validators.minLength(3)]],
                    href: [''],
                    cta: ['', [forms_1.Validators.minLength(3)]],
                    heading: ['', [forms_1.Validators.minLength(3)]],
                    copy: ['', [forms_1.Validators.minLength(3)]],
                    txt: this._fb.array([]),
                    links: this._fb.array([])
                }),
                dataKeys: this._fb.array([])
            });
    };
    /////// BUILD FORM AND LOAD DATA ////////
    /*buildForm(): void {
               this.campaign = this.activatedRoute.snapshot.data['campaign'];
               this.createDataKeys();
               this.createTextKeys();
               this.setFormValues();
     }*/
    FormComponent.prototype.createDataKeys = function () {
        var SourceDataKeys = this.campaign['dataKeys'];
        for (var i in SourceDataKeys) {
            // Just need a reference to SourceDataKeys[i]
            // console.log(dataKeysArray[i]);
            var iterator = SourceDataKeys[i];
            var control = this.myForm.controls['dataKeys'];
            control.push(this.initDataKey());
        }
        // If the above change was made then confirm
        if (this.IsDataKey === true) {
            console.log('Created the Data Keys Nodes. IsDataKey now set to ' + this.IsDataKey + ' so dataKeys table should display');
        }
        ;
    };
    FormComponent.prototype.initDataKey = function () {
        return this._fb.group({
            name: [''],
            href: [''],
            cta: [''],
            heading: [''],
            copy: [''],
            txt: this._fb.array([]),
            links: this._fb.array([])
        });
    };
    FormComponent.prototype.createLinkKeys = function () {
        var SourceDataKeys = this.campaign['dataKeys'];
        // For each object in DataKeys array (from the db)
        for (var n in SourceDataKeys) {
            var SourceDataKeyLinks = this.campaign['dataKeys'][n]['links'];
            // If there's a Links array then...
            if (SourceDataKeyLinks) {
                // For each object in the Links array (from the db)
                for (var i in SourceDataKeyLinks) {
                    // console.log(SourceDataKeyLinks[i]);
                    var iterator = i;
                    var dataKeysControl = this.myForm.controls['dataKeys'];
                    var dataKeyObjControl = dataKeysControl.controls[n];
                    var dataKeyLinksControl = dataKeyObjControl.controls['links'];
                    // Add a links object to the corresponding DataKey Links array (from the form)
                    dataKeyLinksControl.push(this.initLinks()); // recode
                }
            }
        }
    };
    FormComponent.prototype.initLinks = function () {
        return this._fb.group({
            linkName: [''],
            text: [''],
            href1: [''],
            link: [''],
        });
    };
    /*  createTextKeys() {
        let SourceDataKeys = this.campaign['dataKeys'];
    
        // For each obj in DataKeys (from db)
        for (let j in SourceDataKeys) {
    
          let SourceDataKeyText = this.campaign['dataKeys'][j]['txt'];
    
          // If there's a text array then...
          if ( SourceDataKeyText) {
    
          // For each obj in Text
          for (let i in SourceDataKeyText) {
    
            let SourceDataKeyTextObj = Object.keys(SourceDataKeyText[i]);
    
            const dataKeysControl = <FormArray> this.myForm.controls['dataKeys'];
            const dataKeyObjControl = <FormGroup> dataKeysControl.controls[j];
            const dataKeytxtControl = <FormArray> dataKeyObjControl.controls['txt'];
    
    
            // For each first key (as only one key:value in each txt obj)
            if ( SourceDataKeyTextObj[0] === 'heading' ) {
    
                  dataKeytxtControl.push(this.initHeading());
                  // console.log(Object.keys(SourceDataKeyText[i]));
                  this.dataKeysTxtTypeisHeader[j] = this.dataKeysTxtTypeisHeader[j] || [];
                  this.dataKeysTxtTypeisHeader[j].push(true);
                   // console.log('created heading');
    
                // Since there's text then display the text table
                if (this.IsTextContent === false ) {this.IsTextContent = !this.IsTextContent; };
    
               } else {
                   dataKeytxtControl.push(this.initParagraph());
                   // console.log(Object.keys(SourceDataKeyText[i]));
                   this.dataKeysTxtTypeisHeader[j] = this.dataKeysTxtTypeisHeader[j] || [];
                   this.dataKeysTxtTypeisHeader[j].push(false);
                   // console.log('created paragraph');
    
                   // Since there's text then display the text table
                if (this.IsTextContent === false ) {this.IsTextContent = !this.IsTextContent; };
               }
            }
           }
           // If there's not a text array then...
           // add a blank array to  dataKeysTxtTypeisHeader
           else {
               let blankArray: any = [null];
             this.dataKeysTxtTypeisHeader.push(blankArray); }
    
        }
    
        if (this.IsTextContent === true ) {
          console.log('Created the Data Keys Text Nodes. IsTextContent is now set to ' + this.IsTextContent + ' so dataKeys text table should now display');
        };
      }*/
    // WHY IS THIS WORKING FOR ALL DATAKEYS????????????
    // Map Values to the dataKeys just created
    FormComponent.prototype.setFormValues = function () {
        for (var key in this.campaign) {
            var mainCtrl = this.myForm.controls[key];
            if (mainCtrl !== undefined) {
                mainCtrl.patchValue(this.campaign[key]);
                // The patchValue() API method supports partial form updates, where we only need to specify some of the fields: 
                // setValue() API method that needs an object with all the form fields. If there is a field missing, we will get an error.
                console.log(' Setting the form values');
            }
        }
    };
    FormComponent.prototype.setAprovalStatus = function () {
        var aprovalStatus = this.myForm.value['aproved'];
        if (aprovalStatus === true) {
            this.CampaignAproved = true;
        }
    };
    /////// DISPLAY INPUTS ///////////
    FormComponent.prototype.toggleCampaignAproved = function () {
        this.CampaignAproved = !this.CampaignAproved;
    };
    FormComponent.prototype.toggleDetailsInput = function () {
        this.DetailsInputisActive = !this.DetailsInputisActive;
        // location.hash = '#details';
    };
    FormComponent.prototype.toggleDataKeyInput = function (i) {
        console.log('dkInput start');
        // Define UI type (for submit button
        this.isEditor = false;
        console.log('isEditor: ' + this.isEditor);
        // Clear all temp/model data
        this.clearData();
        this.currentDataKey = i;
        console.log('currentDataKey: ' + this.currentDataKey);
        // Hide the Details input if it's expanded
        // if (this.DetailsInputisActive === true ) {this.toggleDetailsInput(); };
        this.DataKeysInputisActive = true;
        console.log('DataKeysInputisActive is: ' + this.DataKeysInputisActive);
        // Move to Editor UI 
        window.location.hash = '';
        window.location.hash = 'form-editor';
        console.log('dkInput end');
    };
    FormComponent.prototype.closeInput = function () {
        // Clear all temp/model data
        this.clearData();
        this.DataKeysInputisActive = false;
        console.log('DataKeysInputisActive is: ' + this.DataKeysInputisActive);
        window.location.hash = '';
        window.location.hash = 'dataKey' + this.currentDataKey;
    };
    /////// DISPLAY EDITOR ///////////
    FormComponent.prototype.toggleEditorInput = function (i) {
        console.log('dkEdit start');
        // Clear All data
        this.clearData();
        // Define UI type (for submit button)
        this.isEditor = true;
        console.log('isEditor: ' + this.isEditor);
        /* // If clicking 'edit' on the same dataKey UI that IS open/'active' - just close it
         if (this.currentDataKey === i && this.DataKeysInputisActive === true) {
           // this.toggleDataKeyInput(i);
            this.DataKeysInputisActive  = false;
            console.log('DataKeysInputisActive is: ' + this.DataKeysInputisActive);
       
          // window.location.hash = '';
          // window.location.hash = 'dataKey' + this.currentDataKey;
          }
         else {
       */
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
        // Move to Editor UI 
        window.location.hash = '';
        window.location.hash = 'form-editor';
        console.log('dkEdit end');
        //};
    };
    //// TEST /////
    /*clearme() {
     // Clear All data
      this.clearData();
    }
    
    setEditor(): void {
      // Define UI type (for submit button)
      this.isEditor = true;
      console.log('isEditor: ' + this.isEditor);
    }
    
    setCurrentDataKey(i: number): void {
    this.currentDataKey = i;
         console.log('currentDataKey: ' + this.currentDataKey);
    }
    
    setStuff(i: number): void {
         this.setModel(i);
         this.setModelLinks();
         this.setDataKeyLinks();
         this.setTempDataLinks();
     }
    
    setInput(): void {
         this.DataKeysInputisActive  = true;
         console.log('DataKeysInputisActive is: ' + this.DataKeysInputisActive);
    }
    
    move(): void {
         // Move to Editor UI
         window.location.hash = '';
         window.location.hash = 'form-editor';
    }*/
    FormComponent.prototype.setModel = function (i) {
        // build Model from DataKey
        var dataKeysValues = this.myForm.value['dataKeys'][i];
        var modelValues = this.newModel;
        for (var n in dataKeysValues) {
            modelValues[n] = dataKeysValues[n];
        }
        ;
    };
    FormComponent.prototype.setModelLinks = function () {
        // build ModelLinks from Model.links
        var modelLinksValues = this.newModel.links;
        var modLinks = this.newModelLinks;
        for (var n in modelLinksValues) {
            modLinks[n] = modelLinksValues[n];
        }
        ;
    };
    FormComponent.prototype.setDataKeyLinks = function () {
        var modelLinksValues = this.newModel.links;
        var DataKeyLinksValues = this.newDataKeyLinks;
        for (var n in modelLinksValues) {
            DataKeyLinksValues[n] = modelLinksValues[n];
        }
        ;
    };
    FormComponent.prototype.setTempDataLinks = function () {
        // build tempDataLinks from Model.links
        var modelLinksValues = this.newModel.links;
        var tempDataControl = this.myForm.controls['tempData'];
        var tempDatalinkControl = tempDataControl.controls['links'];
        for (var i in modelLinksValues) {
            // console.log(modelLinksValues[i]);
            var iterator = parseInt(i, 10);
            tempDatalinkControl.push(this.initModelLinks(iterator)); //recode
        }
    };
    FormComponent.prototype.initModelLinks = function (i) {
        return this._fb.group({
            linkName: [this.newModelLinks[i].linkName],
            text: [this.newModelLinks[i].text],
            href1: [this.newModelLinks[i].href1, [forms_1.Validators.required, forms_1.Validators.minLength(3)]],
            link: [this.newModelLinks[i].link],
        });
    };
    /////// DISPLAY LINKS UI ///////////
    FormComponent.prototype.getLinks = function () {
        this.clearTextData();
        this.clearLinksData();
        this.findLinks(); // Ready to push to dataKey
        this.findText(); // Assemble paragraphstmpD
        this.buildModelLinks();
        this.buildTempDataLinks();
    };
    FormComponent.prototype.buildModelLinks = function () {
        // build ModelLinks from newDataKeyLinks
        var linksValues = this.newDataKeyLinks;
        var modLinks = this.newModelLinks;
        for (var n in linksValues) {
            modLinks[n] = linksValues[n];
        }
        ;
    };
    FormComponent.prototype.buildTempDataLinks = function () {
        // build tempDataLinks from newDataKeyLinks
        var linksValues = this.newDataKeyLinks;
        var tempDataControl = this.myForm.controls['tempData'];
        var tempDataLinkControl = tempDataControl.controls['links'];
        for (var i in linksValues) {
            // console.log(linksValues[i]);
            var iterator = parseInt(i, 10);
            tempDataLinkControl.push(this.initDataKeyLinks(iterator)); // recode
        }
    };
    FormComponent.prototype.initDataKeyLinks = function (i) {
        return this._fb.group({
            linkName: [this.newDataKeyLinks[i].linkName],
            text: [this.newDataKeyLinks[i].text],
            href1: [this.newDataKeyLinks[i].href1],
            link: [this.newDataKeyLinks[i].link],
        });
    };
    /////// SAVE DATA KEY ///////////
    FormComponent.prototype.addNew = function (i, j) {
        // Array of dataKeys
        var control = this.myForm.controls['dataKeys'];
        // create newDataKeyLinks array to push to new dataKey   
        // this.compileCopyLinks();
        // map tempData to new dataKey formGroup
        // control.push(this.initData());
        // map tempData to new dataKey formGroup  - insert after the currentDataKey formGroup
        // https://angular.io/docs/ts/latest/api/forms/index/FormArray-class.html#!#insert-anchor
        control.insert(this.currentDataKey + 1, this.initData());
        // If this is the first dataKey being added then display the dataKey table
        if (this.IsDataKey === false) {
            this.IsDataKey = !this.IsDataKey;
        }
        ;
        // Clear tempData
        // this.clearData();
        // Close UI 
        // causing tempdata not to clear or repopulate??????
        this.closeInput();
        /*this.toggleDataKeyInput(i);

        window.location.hash = '';
        window.location.hash = 'dataKey' + this.currentDataKey;*/
        // Move back up to view DataKeys table
        // window.location.hash = '#anchorName';
        // This resets - removing the anchor from url:
        // this is a hack fix as the has only works the first time it's clicked!! 
        // history.pushState('', document.title, window.location.pathname
        //  + window.location.search);
        // window.location.hash = 'anchorName';
        // location.hash = '#anchorName';
        // this._router.navigate( ['/somepath', id ], {fragment: 'test'});
    };
    // Update array that shows/hides each dataKey edit box. Add 'false' so does not display by default
    /*updateDataKeysEditisActive() {
       this.DataKeysEditorisActive.push(false);
   }*/
    FormComponent.prototype.saveChanges = function (i, j) {
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
        this.closeInput();
        // Move back up to view DataKeys table
        // window.location.hash = '#anchorName';
        // This resets - removing the anchor from url:
        // this is a hack fix as the has only works the first time it's clicked!! 
        // history.pushState('', document.title, window.location.pathname
        //       + window.location.search);
        // location.hash = '#anchorName';
        // this._router.navigate( ['/somepath', id ], {fragment: 'test'});*/
    };
    /*pushDataKey(i: number, j: number) {
          // Array of dataKeys
          const control = <FormArray>this.myForm.controls['dataKeys'];
          control.push(this.initData());
    }*/
    FormComponent.prototype.findLinks = function () {
        var copy = this.newModel.copy;
        var copyLinks = this.newDataKeyLinks;
        var obj = {};
        if (copy) {
            var outputLinks = function (match, p1, p2, offset, string) {
                obj = {};
                // p1 = p1 + '.link';
                obj['linkName'] = p1;
                obj['text'] = p2;
                obj['href1'] = '';
                obj['link'] = "{% import 'macros/link-macro.html' as Link -%}{{Link.declare(" + p1 + ".link" + ")}";
                copyLinks.push(obj);
            };
            copy.replace(/{{(.*?)\|(.*?)}}/g, outputLinks);
        }
        // Show error if no links found
        if (!copyLinks.length) {
            this.linksNotFound = true;
        }
        else {
            this.linksNotFound = false;
        }
        ;
    };
    FormComponent.prototype.findText = function () {
        // const modelControl = <FormGroup>this.myForm.controls['tempData'];
        // const textControl = <FormArray> modelControl.controls['txt'];
        var textValue = this.myForm.value['tempData']['txt'];
        var copy = this.newModel.copy;
        // let paragraphs: any = [];
        var obj = {};
        var outputText = function (match, p1) {
            // console.log('Match: ' + match );
            // console.log('p1: ' + p1 );
            //  p1 = p1 + '.link';
            obj = {};
            obj['paragraph'] = p1;
            // paragraphs.push(obj);
            textValue.push(obj); // WHAT IS THE PROLBLEM??
        };
        // reformat links for njucks 
        copy = copy.replace(/\|(.*?)}}/g, '.link|safe}}');
        // split paragraphs
        copy.replace(/([^\n]+)/g, outputText);
        // console.log(paragraphs);
    };
    // map tempData to new formGroup
    FormComponent.prototype.initData = function () {
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
    FormComponent.prototype.clearData = function () {
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
    FormComponent.prototype.clearLinksData = function () {
        this.clearModelLinks();
        this.clearNewDataKeyLinks();
        this.clearTempDataLinks();
    };
    FormComponent.prototype.clearTextData = function () {
        this.clearTempDataText();
    };
    FormComponent.prototype.clearModel = function () {
        var obj = this.newModel;
        for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
            var prop = _a[_i];
            delete obj[prop];
        }
    };
    FormComponent.prototype.clearModelLinks = function () {
        // Empty ModelLinks
        var obj = this.newModelLinks;
        for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
            var prop = _a[_i];
            delete obj[prop];
        }
    };
    FormComponent.prototype.clearModelDotlinks = function () {
        // Empty Model.links
        var obj = this.newModel.links;
        for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
            var prop = _a[_i];
            delete obj[prop];
        }
    };
    FormComponent.prototype.clearNewDataKeyLinks = function () {
        // Empty DataKeys 'Links'
        /* for (n in  this.newDataKeyLinks) {
   
           let link = this.newDataKeyLinks[n];
   
             for (m in  this.temp) {
   
               if link !== this.temp[m];
             }
          }*/
        this.newDataKeyLinks = [];
    };
    FormComponent.prototype.clearTempData = function () {
        var modelValue = this.myForm.value['tempData'];
        for (var i in modelValue) {
            delete modelValue[i];
        }
    };
    FormComponent.prototype.clearTempDataLinks = function () {
        var modelControl = this.myForm.controls['tempData'];
        var linkControl = modelControl.controls['links'];
        // console.log(linkControl);
        // Empty Temp Data 'Links'
        // http://stackoverflow.com/questions/36839088/remove-multiple-controls-from-controlarray
        while (linkControl.length) {
            linkControl.removeAt(0);
        }
        ;
        // console.log(linkControl);
    };
    FormComponent.prototype.clearTempDataText = function () {
        var modelControl = this.myForm.controls['tempData'];
        var textControl = modelControl.controls['txt'];
        // http://stackoverflow.com/questions/41852183/angular-2-remove-all-items-from-a-formarray
        textControl.reset([]);
    };
    FormComponent.prototype.removeDataKey = function (i) {
        var control = this.myForm.controls['dataKeys'];
        control.removeAt(i);
        // this.dataKeysTxtTypeisHeader.splice(i, 1);
    };
    /*
        // Delete Text Input
        removeTxtInput(j: number) {
          const modelControl = <FormGroup>this.myForm.controls['tempData'];
          const txtControl = <FormArray> modelControl.controls['txt'];
          // const control = <FormArray>this.myForm.get('txt'); // fails
    
          txtControl.removeAt(j); // delete from tempData
          this.newModelTxtTypeisHeader.splice(j, 1); // delete so input does not display
    
          // delete object property. can't splice array
          // delete this.newModelTxt[j]; causes break in numbering inputs
          // e.g. produces  {"0": "zero", "2": "two", "3": "three"} not  {"0": "zero", “1”: "two", “2”: "three"}
          for (let i = j; i < Object.keys(this.newModelTxt).length; i++) {
             this.newModelTxt[i] = this.newModelTxt[i + 1];
          }
          delete this.newModelTxt[Object.keys(this.newModelTxt).length];
    
          this.newModelTxtType.splice(j, 1); // delete from TextType array
        }
    
        // Delete from display table
        removeDataKey(i: number) {
          const control = <FormArray>this.myForm.controls['dataKeys'];
          control.removeAt(i);
          this.dataKeysTxtTypeisHeader.splice(i, 1);
        }*/
    /////// SET DATA ///////////
    FormComponent.prototype.setCampaign = function () {
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
    /////// DOWNLOAD/BUILD CAMPAIGN DATA JSON ///////////
    FormComponent.prototype.buildCampaign = function () {
        // const txtControl = <FormArray> modelControl.controls['txt'];
        var campaignDataNjks = {};
        // const modelControl = <FormArray>this.myForm.controls['dataKeys'];
        var campaignData = this.myForm.controls['dataKeys'].value;
        // For each dataKey object
        for (var i in campaignData) {
            // console.log(campaignData[i]);
            var linksData = this.myForm.controls['dataKeys'].value[i]['links'];
            // forEach works but gets error
            /*for (let j in linksData) {
              linksData.forEach(function(j: any){
                campaignDataNjks[j['linkName']] = j;
              });
           }*/
            for (var k = 0; k < linksData.length; k++) {
                campaignDataNjks[linksData[k]['linkName']] = linksData[k];
            }
        }
        // const campaignData = <FormArray>this.myForm.controls['dataKeys'].value;
        // const test = JSON.stringify(campaignData);
        // forEach works but gets error
        /*campaignData.forEach(function(currentObject: any){
        campaignDataNjks[currentObject['name']] = currentObject;
        });*/
        // Reformat for Nunjucks / Gulp
        for (var i = 0; i < campaignData.length; i++) {
            campaignDataNjks[campaignData[i]['name']] = campaignData[i];
        }
        // convert to JSON 
        var campaignDataJson = JSON.stringify(campaignDataNjks, null, 2);
        var file = new Blob([campaignDataJson], { type: 'text/json;charset=utf-8' });
        saveAs(file, this.id + '_data.json');
    };
    /* nameNode(currentObject: any) {
             let campaignDataNjks = {};
             campaignDataNjks[currentObject['name']] = currentObject;
         }*/
    FormComponent.prototype.approvalStatus = function () {
        var campaignName = this.myForm.value.title + '_v' + this.myForm.value.version;
        var owner = 'Zorren Looja';
        var approveDate = '14th April 2017';
        alert(campaignName + ' has been approved by ' + owner + ' on' + approveDate);
    };
    FormComponent.prototype.pendingStatus = function () {
        var campaignName = this.myForm.value.title + '_v' + this.myForm.value.version;
        var owner = 'Zorren Looja';
        alert('Approval for ' + campaignName + 'is still required from ' + owner);
    };
    return FormComponent;
}());
FormComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'my-form',
        templateUrl: 'form.component.html',
        styleUrls: ['form.component.css'],
    }),
    __metadata("design:paramtypes", [data_service_1.DataService,
        router_1.ActivatedRoute,
        forms_1.FormBuilder])
], FormComponent);
exports.FormComponent = FormComponent;
var Campaign = (function () {
    function Campaign(author, description, title, version, model, datakeys) {
        this.author = author;
        this.description = description;
        this.title = title;
        this.version = version;
        this.model = model;
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
var Txt = (function () {
    function Txt() {
    }
    return Txt;
}());
exports.Txt = Txt;
var Links = (function () {
    function Links() {
    }
    return Links;
}());
exports.Links = Links;
//# sourceMappingURL=form.component.js.map