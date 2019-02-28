import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DataService } from '../_services/data.service';
import { DetergentService } from '../_services/detergent.service';

import { FormControl, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UploadService } from '../_uploads/shared/upload.service';
import { Upload } from '../_uploads/shared/upload';
import { ModalService } from '../_services/index';
import { LogoOptions } from '../_config/options';
// Controls
import { ScssControls } from '../_controls/scss.controls';
import { AttributesControls } from '../_controls/attributes.controls';
import { ConfigControls } from '../_controls/config.controls';
import { LogoControls } from '../_controls/logo.controls';
import { ModuleControls } from '../_controls/module.controls';
// Modules
import { ModuleLibrary } from '../_modules/modules.library';
// Inputs
import { ModuleInputs } from '../_modules/modules.inputs';
// Classes
import { Config } from '../_classes/config.class';
import { Module } from '../_classes/module.class';
import { Campaign } from '../_classes/campaign.class';
import { Model } from '../_classes/model.class';
import { Links } from '../_classes/links.class';
import { Logo } from '../_classes/logo.class';

import * as _ from "lodash";
// http://stackoverflow.com/questions/40240796/angular-2-best-approach-to-use-filesaver-js
// https://github.com/eligrey/FileSaver.js/issues/308
import * as FileSaver from "file-saver";
import * as detergent from "detergent";
import { Router } from '@angular/router';


@Component({
 selector: 'my-form',
templateUrl: 'campaign.component.html',
styleUrls: [ 'campaign.component.css' ],
})

export class FormComponent implements OnInit {

  // Data from route
  public campaign: any;
  public campaignId: any;
  public campaignType: any;  // email or demos
  // Module Inputs and Diplay Options
  public moduleInputs = ModuleInputs;
  public moduleLibrary = ModuleLibrary;
  public logoOptions = LogoOptions; // referenced in html
  // Form Controls
  public scssControls = ScssControls;
  public attributesControls = AttributesControls;
  public logoControls = LogoControls;
  public configControls = ConfigControls;
  public moduleControls = ModuleControls;
  // Form
  public campaignForm: FormGroup;
  // Campaign Team
  public testTeam: any[];
  public customTeam: any[];
  public fullTeam: any[];
  public arrayOfPersonnelIds: any;
  public personnelAssignedToRole: any = {};
  // Image Upload
  @ViewChild('myInput')
  public imageInputVariable: any;
  public imageFile: FileList;
  public currentUpload: Upload;
  // Text Escaping
  public bracketsOpen: string = '{{';
  public bracketsClose: string = '}}';
  // View Type
  public viewType: string = 'author';
  // Approvals
  public readyForApproval: boolean = false;
  public approvalDate: any;
  public rejectionDate: any;
  // Show/Hide Data
  public detailsInputisActive: boolean = false;
  public campaignInputisActive: boolean = false;
  public editorIsActive: boolean = false;
  public isEditor: boolean = false;
  public displayEncodedCopy: boolean = false;
  public formPreview: boolean = false; // modal form preview
  public viewsArrowDisplay:  boolean = false;
  public buttonHoverModPreviewActive: boolean = false;
  public tableHoverModBorderActive: boolean = false;
  // public optionSelectModTypeActive: boolean = true; // Not required removed from div within *ngIf="moduleInputs.preview" div
  // UI Editor Data
  public isLastMod: boolean = false; // for scrolling preview
  public currentModule: number  = 0;
  public linksNotFound: boolean = false;

  newModel: Model;
  newLinks: Links;
  newLogo: Logo;
  newConfig: Config;

  // Pass data to nested component (now using routing instead)
  // @Input() childData: any;

  constructor(
    private dataService: DataService,
    private detergentService: DetergentService,
    private activatedRoute: ActivatedRoute,
    private _fb: FormBuilder,
    private upSvc: UploadService,
    private router: Router,
    private modalService: ModalService,
    ) {}

  ngOnInit(): void {

    // This appears to get the id from htp used to display heading
    this.activatedRoute.params
    .subscribe(params => {
      this.campaignId = params['id'];
      this.campaignType = params['type'];
    });
    console.log('Assembling the form for: ' + this.campaignId);
    console.log('The form type is: ' + this.campaignType);


 this.dataService.getCampaignsData(this.campaignType)
      .subscribe(
      (campaign: any) => {
        this.campaign = this.activatedRoute.snapshot.data['campaign'];
        this.buildCampaignForm();
        this.createLinkKeys();
        this.createTxtKeys();
        this.setFormValues();
        this.readyForApprovalCheck();
        
   this.dataService.getAllTeamData()
    .subscribe(
          (results: any) => {
             this.testTeam = results[0];
        this.customTeam = results[1];
        this.fullTeam = Object.assign(this.testTeam, this.customTeam);
        this.arrayOfPersonnelIds = Object.keys(this.fullTeam);
       
        const is_chrome = /chrome/i.test( navigator.userAgent );
            if(is_chrome) {
              setTimeout(function(){
                // console.log('chrome detected. Fix page Jump without time out  & scroll.');
                window.scrollTo(0, 0);
              }, 0);
            }
          }
        );
      });


    this.newModel = new Model();
    this.newLinks = new Links();
    this.newLogo = new Logo();
    this.newConfig = new Config();

    // https://stackoverflow.com/questions/1410311/regular-expression-for-url-validation-in-javascript
    const urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/; // these should be imported
    const versionRegex = /^[^.]+$/; // these should be imported
    // Form Controls asign from import
    const logoControls =  this.logoControls;
    const configControls = this.configControls;
    const txt = this._fb.array([]);
    const links = this._fb.array([]);
    const scssControls = this.scssControls;
    const attributesControls = this.attributesControls;

    // FORM
    this.campaignForm =
    this._fb.group({
      author: ['', [Validators.required, Validators.minLength(3)]],
      authorEmail: ['', [Validators.required, Validators.minLength(3)]],
      authorId: [''],
      owner: ['', [Validators.required, Validators.minLength(3)]],
      ownerId: [''],
      ownerEmail: ['', [Validators.required, Validators.minLength(3)]],
      ownerFeedback: [''],
      qa: ['', [Validators.required, Validators.minLength(3)]],
      qaEmail: ['', [Validators.required, Validators.minLength(3)]],
      qaId: [''],
      description: ['', [Validators.required, Validators.minLength(3)]],
      title: ['', [Validators.required, Validators.minLength(3)]],
      version: ['', [Validators.required, Validators.pattern(versionRegex)]],
      rolesrecord: [''],
      approved: [''],
      approvalDate: [''],
      rejectionDate: [''],
      config: this._fb.group(configControls),
      scss: this._fb.group(scssControls),
      attributes: this._fb.group(attributesControls),
      modules: this._fb.array([])
    });

    // Apply imported logo Controls to imported config Controls
    this.addLogoControls();


  }


  /////// BUILD FORM AND LOAD DATA ////////

  addLogoControls() {
    console.log('FUNC: addLogoControls() ---> Building Form Controls - Assign imported logoControls to configControls');
    const logoControls =  this.logoControls;
    const logoControlsGroup = this._fb.group(logoControls);
    // console.log('logoControlsGroup:');
    // console.log(logoControlsGroup);
    const config = <FormGroup> this.campaignForm.controls['config'];
    // console.log('config:');
    // console.log(config);
    config.setControl('logo', logoControlsGroup); 
    // console.log('config AFTER:');
    // console.log(config);
  }


  buildCampaignForm() {
    console.log('FUNC: buildCampaignForm() ---> Building Form - based on db campaign data');
    console.log('buildCampaignForm(). Sourcing data from this.activatedRoute.snapshot.data.campaign.');

    const sourceModules = this.campaign['modules'];

    for (const i in sourceModules) {
      // Just need a reference to SourceModules[i]
      console.log('buildCampaignForm(). this.campaign.modules[' + i + ']' + ':');
      console.log(sourceModules[i]);

      const iterator = sourceModules[i];

      const control = <FormArray>this.campaignForm.controls['modules'];
      control.push(this.buildModuleControls());
    }
  }

  buildModuleControls() {
    console.log('FUNC: buildModuleControls() ---> Building Form - based on db campaign data');

    const txt = this._fb.array([]);
    const links = this._fb.array([]);
    const moduleControls = this.moduleControls;
    const moduleControlsGroup = this._fb.group(moduleControls);
    const moduleControlsGroupControls = moduleControlsGroup.controls;
    const moduleControlsGroupValue = moduleControlsGroup.value;

    // Add links and Text controls for Module
    moduleControlsGroupControls['txt'] = this._fb.array([]);
    moduleControlsGroupControls['links'] = this._fb.array([]);
    moduleControlsGroupValue['txt'] = [];
    moduleControlsGroupValue['links'] = [];

    return moduleControlsGroup;

  }

  createLinkKeys() {
    console.log('FUNC: createLinkKeys() ---> Building Form - based on db campaign data');

    const SourceModules = this.campaign['modules'];

    // For each object in Modules array (from the db)
    for (const n in SourceModules) {

      const SourceModuleLinks = this.campaign['modules'][n]['links'];

      // If there's a Links array then...
      if ( SourceModuleLinks) {

        // For each object in the Links array (from the db)
        for (const i in SourceModuleLinks) {
          // console.log(SourceModuleLinks[i]);
          const iterator = i;
          const modulesControl = <FormArray> this.campaignForm.controls['modules'];
          const moduleControl = <FormGroup> modulesControl.controls[n];
          const moduleLinksControl = <FormArray> moduleControl.controls['links'];
          // Add a links object to the corresponding Module Links array (from the form)
          moduleLinksControl.push(this.initModuleLinks());
        }
      }
    }

  }

  initModuleLinks() {
    console.log('FUNC: initModuleLinks() ---> Building Form - based on db campaign data');
    return this._fb.group({
      linkName: [''],
      text: [''],
      linkFlag: [''],
      href: [''],
      link: [''],
    });
  }


  createTxtKeys() {
    console.log('FUNC: createTxtKeys() ---> Building Form - based on db campaign data' );

    const SourceModules = this.campaign['modules'];

    // For each object in Modules array (from the db)
    for (const n in SourceModules) {

      const SourceModuleTxt = this.campaign['modules'][n]['txt'];

      // If there's a txt array then...
      if ( SourceModuleTxt) {

        // For each object in the txt array (from the db)
        for (const i in SourceModuleTxt) {
          const iterator = i;
          const modulesControl = <FormArray> this.campaignForm.controls['modules'];
          const moduleObjControl = <FormGroup> modulesControl.controls[n];
          const moduleTxtControl = <FormArray> moduleObjControl.controls['txt'];
          // Add a txt object to the corresponding Module txt array (from the form)
          moduleTxtControl.push(this.initTModuleTxt()); 
        }
      }
    }
  }

  initTModuleTxt() {
        console.log('FUNC: initTModuleTxt() ---> Building Form - based on db campaign data' );
    return this._fb.group({
      paragraph: ['']
    });
  }


  // WHY IS THIS WORKING FOR ALL DATAKEYS? - is this expected behaviour
  // Map Values to the modules just created
  setFormValues() {
    console.log('FUNC: setFormValues() ---> Setting Form Values - map campaign data values to the new form created' );

    for (const key in this.campaign) {

      const mainCtrl = <FormControl>this.campaignForm.controls[key];

      if ( mainCtrl !== undefined ) {
        mainCtrl.patchValue(this.campaign[key]);
        // The patchValue() API method supports partial form updates, where we only need to specify some of the fields: 
        // setValue() API method that needs an object with all the form fields. If there is a field missing, we will get an error.

      }
    }
  }



  ////////////// SET VIEW /////////////

  setView(view) {
    console.log('FUNC: setView()  ---> toggle between author,owner & QA');
    console.log('view is set to' + view);
    // Close details editor table if open
    this.detailsInputisActive  = false;
    // Close campaign editor table if open
    this.campaignInputisActive  = false;
    // Close module editor table if open
    this.editorIsActive = false;
    // reset isEditor
    this.isEditor = false;
    // set view
    this.viewType = view;
    // Reset module and hover preview selection
    this.tableHoverModBorderActive = false;
    this.buttonHoverModPreviewActive = false;
    // Reset last Mod
    this.isLastMod = false;
  }



  /////// DISPLAY INPUTS ///////////

  toggleDetailsInput(): void {
    console.log('FUNC: toggleDetailsInput()');
    this.setPersonnelAssignedToRole();
    this.detailsInputisActive = !this.detailsInputisActive;
    // location.hash = '#details';
  }

  toggleCampaignConfigInput(state: string): void {
    console.log('FUNC: toggleCampaignConfigInput()');

    this.currentModule = -1;

    this.campaignInputisActive = !this.campaignInputisActive;

    // reset hover preview  selection
    this.buttonHoverModPreviewActive = false;


    if (state === 'open') {
      console.log('state is: ' + state);
      // Show Module Position in Preview
      this.tableHoverModBorderActive  = true;
      console.log('buttonHoverModPreviewActive is: ' + this.buttonHoverModPreviewActive);

      // This freezes activity of other preview while campaign editor is open:
      // not sure why
      this.editorIsActive  = true;
      this.isEditor = true;

    } 
    else {
      console.log('state is: ' + state);
      this.tableHoverModBorderActive = false;
      this.isEditor = false;
      this.editorIsActive  = false;


      console.log('editorIsActive is: ' + this.editorIsActive);
    }

  }

  toggleIsEditorFalse(): void {
    console.log('FUNC: toggleIsEditorFalse()');
    this.isEditor = false;
  }


  buttonHoverModPreview(moduleNumber: number, isLast: boolean) {
    console.log('FUNC: buttonHoverModPreview()');
    // console.log('editorIsActive: ' + this.editorIsActive);
    //  console.log('isEditor: ' + this.isEditor);
    // console.log('campaignForm.controls.approved.value:');
    // console.log(this.campaignForm['controls'].approved.value);
    // console.log('moduleInputs.preview: ' + this.moduleInputs.preview);

    if (this.editorIsActive === false) {
      this.currentModule = moduleNumber;
      console.log('currentModule: ' + this.currentModule);
    }
    if (this.editorIsActive === false) {
      this.buttonHoverModPreviewActive  = !this.buttonHoverModPreviewActive;
      console.log('buttonHoverModPreviewActive is: ' + this.buttonHoverModPreviewActive);
    }

    // only scroll to bottom of template preview when adding new mod after last existing mod
    // https://stackoverflow.com/questions/35841158/ngif-for-html-attribute-in-angular2
    // https://stackoverflow.com/questions/35232731/angular2-scroll-to-bottom-chat-style

    if (isLast === true) {
      this.isLastMod  = true;
      console.log('isLastMod is: ' + this.isLastMod);
    } 
    else {
      this.isLastMod  = false;
      console.log('isLastMod is: ' + this.isLastMod);

    }
  }

  tableHoverModBorder(i: number) {
    console.log('FUNC: tableHoverModBorder()');

    // Reset:
    this.isLastMod = false;

    if (this.editorIsActive === false) {
      this.currentModule = i;
      console.log('currentModule: ' + this.currentModule);
    }
    if (this.editorIsActive === false) {
      this.tableHoverModBorderActive  = !this.tableHoverModBorderActive;
      console.log('tableHoverModBorderActive is: ' + this.tableHoverModBorderActive);
    }
  }




  /////// DISPLAY EDITOR ///////////

  OpenEditor(moduleNumber: number, isEditor: boolean, callback): void {
    console.log('FUNC: OpenEditor(). ----> OPEN EDITOR');

    // Clear All data
    console.log('subFuncs: clearData()');
    this.clearData();

    // RESET DISPLAY
    // if is Editor === false (add new was clicked) and this.isEditor === true (editor is open)
    if (isEditor === false && this.isEditor === true) {
      // then hide hovered table preview border
      this.tableHoverModBorderActive = false;
    }
    if (isEditor === true && this.isEditor === false) {
      this.tableHoverModBorderActive = true;
    }
    // Show Module Position in Preview
    if (isEditor === false) {
      this.buttonHoverModPreviewActive  = true;
      console.log('buttonHoverModPreviewActive is: ' + this.buttonHoverModPreviewActive);
    }

    // RESET GLOBAL SETTINGS
    // based on inputed variables 
    this.isEditor = isEditor;
    console.log('isEditor: ' + this.isEditor);
    this.currentModule = moduleNumber;
    console.log('currentModule: ' + this.currentModule);
    this.editorIsActive  = true;
    console.log('editorIsActive is: ' + this.editorIsActive);

    // RESET DISPLAY
    // Close details editor table if open
    this.detailsInputisActive  = false;
    // Close campaign editor table if open
    this.campaignInputisActive  = false;



    // If editing existing module then populate model with data from module
    if (isEditor === true) {
      console.log('Setting Model with nested Funcs:');
      this.setModel(moduleNumber);
      this.setLinks();

      const modulesControl = <FormArray> this.campaignForm.controls['modules'];
      const moduleControl = <FormGroup> modulesControl.controls[moduleNumber];
      const typeId = <FormControl> moduleControl.controls['typeId'].value;
      this.setInputs(typeId);
    }

    // console.log('currentModule: ' + this.currentModule);
    // const modulePosition = this.currentModule;

    // Move to module edit table
    if (navigator.userAgent.indexOf('Chrome/')!=-1 || navigator.userAgent.indexOf('Safari/')!=-1) {
      setTimeout(function(){
        // callback(modulePosition, isEditor);
      }, 100);
      console.log('Chrome detected. Timeout hash fix used.');
      if (this.newModel.txt === undefined) {
        console.log('Setting empty Model Text:');
        this.clearModelText(); // creates empty array in case there is no data
      }
      if (this.newModel.links === undefined) {
        console.log('Setting empty Model Links:');
        this.clearModelLinks(); // creates empty array in case there is no data
      }
    }
    else {

      if (this.newModel.txt === undefined) {
        console.log('Setting empty Model Text:');
        this.clearModelText(); // creates empty array in case there is no data
      }
      if (this.newModel.links === undefined) {
        console.log('Setting empty Model Links:');
        this.clearModelLinks(); // creates empty array in case there is no data
      }
    }

    console.log('currentModule: ' + this.currentModule);
  }


  closeEditor() {
    console.log('FUNC: closeEditor()');
    // Clear all temp/model data
    this.clearData();

    this.editorIsActive = false;
    console.log('editorIsActive is: ' + this.editorIsActive);
    console.log('currentModule is: ' + this.currentModule);

    // Hide Module Position Preview
    this.buttonHoverModPreviewActive  = false;
  }

  // https://stackoverflow.com/questions/33700266/how-can-i-get-new-selection-in-select-in-angular-2
  setInputs(selectedModule) {
    console.log('FUNC: setInputs() --> Use selectedModule as key ( moduleInputs.typeId) to define current moduleInputs based on the options from moduleLibrary');
    console.log(selectedModule);
    this.moduleInputs.typeId = selectedModule;
    this.moduleInputs.file = this.moduleLibrary[selectedModule]['file'];
    this.moduleInputs.type = this.moduleLibrary[selectedModule]['type'];
    this.moduleInputs.name = this.moduleLibrary[selectedModule]['name'];
    this.moduleInputs.preview = this.moduleLibrary[selectedModule]['preview'];
    this.moduleInputs.href = this.moduleLibrary[selectedModule]['href'];
    this.moduleInputs.img = this.moduleLibrary[selectedModule]['img'];
    this.moduleInputs.src = this.moduleLibrary[selectedModule]['src'];
    this.moduleInputs.cta = this.moduleLibrary[selectedModule]['cta'];
    this.moduleInputs.heading = this.moduleLibrary[selectedModule]['heading'];
    this.moduleInputs.copy = this.moduleLibrary[selectedModule]['copy'];
  }

  setPersonnel(role, personnelId, IdTitle) {
    console.log('FUNC: setPersonnel()');
    // Set Personnel data based on id
    console.log('role: ' + role);
    console.log('personnelId: ' + personnelId);
    console.log('IdTitle: ' + IdTitle);

    const roleEmail = role + 'Email';
    console.log(roleEmail);

    const roleControl = <FormControl>this.campaignForm.controls[role];
    const roleEmailControl = <FormControl>this.campaignForm.controls[roleEmail];

    roleControl.setValue(this.testTeam[personnelId].name);
    roleEmailControl.setValue(this.testTeam[personnelId].email);

    // Prevent selecting same team member twice
    // http://jsfiddle.net/nDGu8/8/
    if (this.personnelAssignedToRole[IdTitle]) {
      console.log('Found Existing Team Members');

      let s = document.querySelectorAll('option[value="' + this.personnelAssignedToRole[IdTitle] + '"]');
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
    this.personnelAssignedToRole[IdTitle] = personnelId;

  }

  setPersonnelAssignedToRole() {
    console.log('FUNC: setPersonnelAssignedToRole() ---> Set personnelAssignedToRole based on FromControl');

    // build Model from Module
    const rolesRecord = <FormControl>this.campaignForm.controls['rolesrecord'].value;
   // const personnelAssignedToRole  = this.personnelAssignedToRole;

/*    for (const n in rolesRecord) {
      this.personnelAssignedToRole[n] = rolesRecord[n];
    }*/

   // const authorId = personnelAssignedToRole['authorId'];
   // const ownerId = personnelAssignedToRole['ownerId'];
  //  const qaId = personnelAssignedToRole['qaId'];
   //  console.log('rolesRecord.authorId');
    // console.log(rolesRecord['authorId']);

   //  console.log('personnelAssignedToRole');
   //  console.log(this.personnelAssignedToRole);
   //  console.log('personnelAssignedToRole.authorId');
    // console.log(this.personnelAssignedToRole['authorId']);
     // These ids should  be variable not defined here! 
    this.setPersonnel('author', rolesRecord['authorId'], 'authorId');
    this.setPersonnel('owner', rolesRecord['ownerId'], 'ownerId');
    this.setPersonnel('qa', rolesRecord['qaId'], 'qaId');

  }

  ////////// NAVIGATE ////////////

  moveToData() {
    console.log('FUNC: moveToData()');
    // MOVE BACK TO DATA
    const modulePosition =  this.currentModule;
    const isEditor =  this.isEditor;

    if (navigator.userAgent.indexOf('Chrome/')!=-1 || navigator.userAgent.indexOf('Safari/')!=-1) {
      setTimeout(function(){
        console.log('Chrome detected. Timeout hash fix used.');

        if (isEditor === false) {
          console.log('isEditor is' + isEditor + 'Move to New Module');
          console.log('modulePosition is' + modulePosition);

          // If Add Module has been clicked from above first module
          if (modulePosition === undefined) {
            console.log('modulePosition was undefined. So added at first module position');

            window.location.hash = '';
            window.location.hash = 'module0';
          }
          else {
            const newModulePosition =  modulePosition + 1;
            console.log('modulePosition: ' +  newModulePosition);
            window.location.hash = '';
            window.location.hash = 'module' + newModulePosition;
          }
        }
        else {
          console.log('isEditor is' + isEditor + 'Move to Edited Module');
          console.log('modulePosition: ' +  modulePosition);
          window.location.hash = '';
          window.location.hash = 'module' + modulePosition;
        }
      }, 100);
    }
    else {
      if (isEditor === false) {
        console.log('isEditor is' + isEditor + 'Move to New Module');
        let k =  modulePosition + 1;
        console.log('modulePosition: ' +  k);
        window.location.hash = '';
        window.location.hash = 'module' + k;
      }
      else {
        console.log('isEditor is' + isEditor + 'Move to Edited Module');
        console.log('modulePosition: ' +  modulePosition);
        window.location.hash = '';
        window.location.hash = 'module' + modulePosition;
      }
    }
  }


  moveToFormEditor(modulePosition, isEditor) {
    console.log('FUNC: moveToFormEditor()');
    console.log('currentModule: ' + modulePosition);

    if (navigator.userAgent.indexOf('Chrome/')!=-1 || navigator.userAgent.indexOf('Safari/')!=-1) {
      setTimeout(function(){
        console.log('Chrome detected. Timeout hash fix used.');

        if (isEditor === false) {
          console.log('isEditor is' + isEditor + 'Move to New Module');
          console.log('modulePosition is' + modulePosition);

          // If Add Module has been clicked from above first module
          if (modulePosition === undefined) {
            console.log('modulePosition was undefined. So added at first module position');

            window.location.hash = '';
            window.location.hash = 'form-editor0';
          }
          else {
            // const newModulePosition =  modulePosition;
            console.log('modulePosition: ' +  modulePosition);
            window.location.hash = '';
            window.location.hash = 'form-editor' + modulePosition;
          }
        }
        else {
          console.log('isEditor is' + isEditor + 'Move to Edited Module');
          console.log('modulePosition: ' +  modulePosition);
          window.location.hash = '';
          window.location.hash = 'form-editor' + modulePosition;
        }
      }, 100);
    }
    else {
      if (isEditor === false) {
        console.log('isEditor is' + isEditor + 'Move to New Module');
        console.log('modulePosition: ' + modulePosition);
        window.location.hash = '';
        window.location.hash = 'form-editor' + modulePosition;
      }
      else {
        console.log('isEditor is' + isEditor + 'Move to Edited Module');
        console.log('modulePosition: ' +  modulePosition);
        window.location.hash = '';
        window.location.hash = 'form-editor' + modulePosition;
      }
    }
  }


  ///////////// SET DATA /////////////

  setModel(moduleNumber: number) {
    console.log('FUNC: setModel()');

    // build Model from Module
    const modulesValues = this.campaignForm.value['modules'][moduleNumber];
    const modelValues  = this.newModel;

    for (const n in modulesValues) {
      modelValues[n] = modulesValues[n];
    }
  }

  setLinks() {
    console.log('FUNC: setLinks()');

    // build ModelLinks from Model.links
    const modelLinksValues = this.newModel.links;
    const modLinks  = this.newLinks;

    for (const n in modelLinksValues) {
      modLinks[n] = modelLinksValues[n];
    }
  }

  initLinks(i: number, source) {
    const urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return this._fb.group({
      linkName: [source[i].linkName],
      text: [source[i].text],
      linkFlag: [source[i].linkFlag],
      href: [source[i].href, [Validators.required, Validators.pattern(urlRegex)]],
      link: [source[i].link],
    });
  }





  /////// SAVE DATA KEY ///////////

  addConfigData(event) {
    console.log('FUNC: addConfigData() --> update newConfig based on values from child configForm');
    if (event) {
      if (event.newConfig) {
        for(var k in event.newConfig) { 
          this.newConfig[k] = event.newConfig[k]};
        }
    }
      const configFormGroup  = <FormGroup>this.campaignForm.controls['config'];
      //  const newLogo  = this.newLogo;
      const newConfigLogo  = this.newConfig.logo;

      // Hide Module Position Preview
      this.buttonHoverModPreviewActive  = false;
      this.tableHoverModBorderActive = false;
      this.campaignInputisActive  = false;

      const newConfig  = this.newConfig;
      configFormGroup.patchValue(newConfig);
      console.log('newConfig:');
      console.log(newConfig);

      this.closeEditor();
      this.toggleIsEditorFalse();
    }


    addData(event) {
      console.log('FUNC: addData() ---> BEGIN ADD DATA FROM NESTED FORM');

      // update newModel based on values from child Form
      if (event) {
        if (event.newModel) {
          for(var k in event.newModel) { 
            this.newModel[k] = event.newModel[k]};
          }
          if (event.imageFile) {
            this.imageFile = event.imageFile;
          }
          if (event.currentUpload) {
            this.currentUpload = event.currentUpload;
          }
        }
        const modulesArray  = <FormArray>this.campaignForm.controls['modules'];
        const currentModule  = this.currentModule;
        const currentModuleValues  = <FormGroup>this.campaignForm.value['modules'][this.currentModule];
        const imageFile  = this.imageFile;
        const currentUpload  = this.currentUpload;
        const newModelLinks  = this.newModel.links;
        const newModel  = this.newModel;

        // Hide Module Position Preview
        this.buttonHoverModPreviewActive  = false;
        this.tableHoverModBorderActive = false;

        // detergent service creates this.newModel.txt  
        this.clearModelText();
        this.detergentService.findText(
          this.newModel.copy,           // copySource,
          this.newModel.txt           // txtOutput
          );
     
        this.addModule(
          <FormArray>this.campaignForm.controls['modules'],          // modulesArray,
          this.currentModule,         // currentModule,
          this.imageFile,         // imageData,
          this.newModel,              // newdataSource
          this.newModel.txt,         // newdataSourceTxtArray
          this.newModel.links,         // newdataSourceLinksArray,
          this.currentUpload,          // newdataSourceImgdata
          this.moduleInputs   // newdataSourceType

          );

        // If 'isEditor' i.e. edting existing module then replace the existing module in same position
        if (this.isEditor === true) {
          this.removeModule(this.currentModule);
        }

        this.closeEditor();
        this.moveToData();
        this.toggleIsEditorFalse();
        console.log('FUNC: addData() ---> ENDS');
      }


      addModule(
        modulesArray,
        currentModule,
        imageData, // Not used
        newdataSource,
        newDataSourceTxtArray,
        newDataSourceLinksArray,
        newDataSourceImgdata, // Not used
        newDataSourceType
        ) {
        console.log('FUNC: addModule()');
        
        // https://angular.io/docs/ts/latest/api/forms/index/FormArray-class.html#!#insert-anchor
        // Add Module to modulesArray
        modulesArray.insert(currentModule + 1, this.initModule(newdataSource, newDataSourceTxtArray, newDataSourceType));
        // Now add the new links Controls to the new module Controls...
        const newModuleNumber = currentModule + 1;
        const moduleGroup = <FormGroup>modulesArray.controls[newModuleNumber];
        const moduleGroupLinks = <FormArray>moduleGroup.controls['links'];
        for (const i in newDataSourceLinksArray) {
          const iterator = parseInt(i, 10);
          moduleGroupLinks.push(this.initLinks(iterator, newDataSourceLinksArray));
        }

      }


      // map tempData to new formGroup
      initModule(dataSource, dataSourceTxtArray, dataSourceType) {
        return this._fb.group({
          name: [dataSource.name],
          number: [''], // module number - form actually uses ngFor loop [i] for reference to display
          numberFlag: [dataSource.numberFlag],
          type: [dataSourceType.type],
          typeFlag: [dataSource.typeFlag],
          typeId: [dataSourceType.typeId],
          file: [dataSourceType.file],
          href: [dataSource.href],
          hrefFlag: [dataSource.hrefFlag],
          img: [dataSource.img],
          imgFlag: [dataSource.imgFlag],
          key: [dataSource.key],
          src: [dataSource.src],
          srcFlag: [dataSource.srcFlag],
          height: [dataSource.height],
          width: [dataSource.width],
          cta: [dataSource.cta],
          ctaFlag: [dataSource.ctaFlag],
          heading: [dataSource.heading],
          headingFlag: [dataSource.headingFlag],
          copy: [dataSource.copy],
          copyFlag: [dataSource.copyFlag],
          encodedFlag: [false],
          txt: this._fb.array(
            dataSourceTxtArray
            ),
          links: this._fb.array([]
            ),
          moduleAmends: [dataSource.moduleAmends],
          approved: [dataSource.approved],
        });
      }



      /////// CLEAR / DELETE DATA ///////////

      clearData() {
        console.log('FUNC: clearData() ---> clearModel, clearLinks, clearTempData, clearImageData, clearModuleInputs');
        this.clearModel();
        this.clearLinks();
        this.clearImageData();
        this.clearModuleInputs();

      }

      clearImageData() {
         console.log('FUNC: clearImageData()');
        this.clearCurrentUpload();
        this.clearimageFile();
      }

      clearModuleInputs() {
        console.log('FUNC: clearModuleInputs()');
        this.moduleInputs.type = '';
        this.moduleInputs.typeId = '';
        this.moduleInputs.file = '';
        this.moduleInputs.preview = '';
        this.moduleInputs.name = '';
        this.moduleInputs.href = false;
        this.moduleInputs.img = false;
        this.moduleInputs.src = false;
        this.moduleInputs.cta = false;
        this.moduleInputs.heading = false;
        this.moduleInputs.copy = false;

      }

      clearCurrentUpload() {
        console.log('FUNC: clearCurrentUpload()');
        const obj =  this.currentUpload;
        if ( obj !== undefined ) {
          console.log('clearCurrentUpload');
          console.log(obj);
          for (const prop of Object.keys(obj)) {
            delete obj[prop];
          }
          console.log(obj);
        }
      }

      clearimageFile() {
        console.log('FUNC: clearimageFile()');
        const obj =  this.imageFile;
        if ( obj !== undefined ) {
          console.log('imageFile:');
          console.log(obj);
          // https://stackoverflow.com/questions/3144419/how-do-i-remove-a-file-from-the-filelist
          // https://stackoverflow.com/questions/12989741/the-property-value-does-not-exist-on-value-of-type-htmlelement
          // let inputValue = (<HTMLInputElement>document.getElementById('img')).value;
          // inputValue = '';
          // document.getElementById('img').value = "";
          this.resetImage();
          console.log('imageFile (after resetImage()):');
          console.log(obj);
        }
      }

      // http://plnkr.co/edit/0FJ0kKCVNjUP1hGaZzTt?p=preview
      resetImage() {
        console.log('FUNC: resetImage()');
        if ( this.imageInputVariable !== undefined ) {

          console.log(this.imageInputVariable.nativeElement.files);
          this.imageInputVariable.nativeElement.value = "";
          console.log(this.imageInputVariable.nativeElement.files);
        }
        this.clearModelImageData();
      }

      clearModelImageData() {
        console.log('FUNC: clearModelImageData()');
        const obj =  this.newModel;
        delete obj.img;
        delete obj.src;
        delete obj.key;
      }


      clearModel() {
        console.log('FUNC: clearModel()');
        const obj =  this.newModel;

        for (const i in obj) {
          delete obj[i];
        }
        console.log(obj);
      }

      clearLinks() {
        console.log('FUNC: clearLinks()  --> clear newLinks');
        const obj =  this.newLinks;
       // console.log('newLinks before:');
       // console.log(obj);
        for (const prop of Object.keys(obj)) {
          delete obj[prop];
        }
       // console.log('newLinks after:');  // NOT WORKING?
       // console.log(obj);
      }

      clearModelText() {
        console.log('FUNC: clearModelText()');
        //console.log('newModel.txt before:');
       // console.log(this.newModel.txt);
        this.newModel.txt = [];
        //console.log('newModel.txt after:');
        //console.log(this.newModel.txt);
      }

      clearModelLinks() {
        console.log('FUNC: clearModelLinks()');
        //console.log('newModel.links before:');
        //console.log(this.newModel.links);
        this.newModel.links = [];
       // console.log('newModel.links after:');
        //console.log(this.newModel.links);
      }

      removeModule(i: number) {
        console.log('FUNC: removeModule()');
        const control = <FormArray>this.campaignForm.controls['modules'];
        control.removeAt(i);
        this.tableHoverModBorderActive = false;
      }



      /////// SAVE DATA ///////////

      setCampaign() {
        console.log('FUNC: setCampaign()');
        // changed var to let and "" to ''
        //  const campaignName = '/' + this.campaignForm.value.title + '_v' + this.campaignForm.value.version + '/';
        // same result either way when slahses removed?!
        const campaignName = this.campaignForm.value.title + '_v' + this.campaignForm.value.version ;
        console.log('campaign name is ' + campaignName);


        this.dataService
        .setCampaignData(
          campaignName,
          this.campaignForm
          )
        .subscribe(
          (campaignName: any) => this.campaign = (campaignName) // WHY IS THIS BIT REQUIRED ??
          );
        alert(campaignName + 'has been saved to the database');

        console.log('campaign id is ' + this.campaignId);

        if (this.campaignId !== campaignName) {
          //  const versionControl = <FormControl>this.campaignForm.controls['version'].value;
          //  const titleControl = <FormControl>this.campaignForm.controls['title'].value;
          // let value = titleControl + '_v' + versionControl;

          this.router.navigate(['form/emails/' + campaignName]);

        }
      }


      /////// BUILD CAMPAIGN DATA FOR DOWNLOAD JSON ///////////

      buildCampaign() {
        console.log('FUNC: buildCampaign()');

        // const txtControl = <FormArray> modelControl.controls['txt'];
        const campaignDataNjks = {};

        const moduleData = <FormArray>this.campaignForm.controls['modules'].value;

        console.log('FUNC: buildCampaign(moduleData)');
        console.log(moduleData);

        // Set non-module based values
        const config = <FormGroup>this.campaignForm.controls['config'];
        const preheader = <FormControl>config.controls['preheader'];
        const header = <FormControl>config.controls['header'];
        const logo = <FormGroup>config.controls['logo'];
        const logoLink = <FormControl>logo.controls['href'];
        const logoType = <FormControl>logo.controls['type'];
        const scssData = <FormGroup>this.campaignForm.controls['scss'].value;
        const attributes = <FormGroup>this.campaignForm.controls['attributes']
        const attributesData = <FormGroup>this.campaignForm.controls['attributes'].value;


        // Set Data
        console.log('Set Data');
        campaignDataNjks['preheader'] = preheader.value;
        campaignDataNjks['header'] = header.value;
        campaignDataNjks['logo'] = {};
        campaignDataNjks['logo']['href'] = logoLink.value;
        campaignDataNjks['logo']['type'] = logoType.value;

        // Set reformatted scss 
        console.log('Set reformatted scss ');
        campaignDataNjks['scss'] = {};
        for (const i in scssData) {
          //  console.log(i);
          var str = JSON.stringify(i);
          var newStr = str.replace("_", "-");
          var newObj = JSON.parse(newStr);
          campaignDataNjks['scss'][newObj] = scssData[i];
        }

        // Set attributes
        console.log('Set attributes');
        for (let i in attributesData) {
          console.log(i);
          campaignDataNjks[i] = attributesData[i];
        }

        // Extract links
        // For each module object
        console.log('Extract links');
        for (let i in moduleData) {
          const linksData = <FormArray>this.campaignForm.controls['modules'].value[i]['links'];

          for (let k = 0; k < linksData.length; k++) {
            campaignDataNjks[linksData[k]['linkName']] = linksData[k];
          }
        }

        // Reformat for Nunjucks / Gulp
        for (let i = 0; i < moduleData.length; i++) {
          campaignDataNjks['mod' + [i+1]] = moduleData[i];
        }

        // define html file for each mod
        for (let i = 0; i < moduleData.length; i++) {
          campaignDataNjks['$MOD' + [i+1]] = moduleData[i]['file'];
          //    campaignData[i]['number'] = 'mod' + [i+1];
        }


        // convert to JSON 
        const campaignDataJson = JSON.stringify(campaignDataNjks, null, 2);
        const file = new Blob([campaignDataJson], { type: 'text/json;charset=utf-8' });
        FileSaver.saveAs(file, this.campaignId + '_data.json');

      }


     /////////////// STATUS DATA /////////////////

  toggleCampaignStatus(approvalSubmitted): void {
    console.log('FUNC: toggleCampaignApproved()');
    const approvalStatus = <FormControl> this.campaignForm.controls['approved'];

    approvalStatus.setValue(approvalSubmitted);

    // Record Date
    const date = new Date();
    let year = date.getUTCFullYear();
    let month = date.getUTCMonth();
    const day = date.getUTCDate();

    if (approvalStatus.value === true) {
      this.approvalDate = day + '/' + month + "/" + year;
    }
    if (approvalStatus.value === false) {
      this.rejectionDate = day + '/' + month + "/" + year;

      const rejectionDate = <FormControl> this.campaignForm.controls['rejectionDate'];
      rejectionDate.setValue(this.rejectionDate);

    }
  }

  toggleCampaignDataStatus(approvalSubmitted): void {
    console.log('FUNC: toggleCampaignDataStatus()');
    const config = <FormGroup> this.campaignForm.controls['config'];
    const dataApproved = <FormControl> config.controls['dataApproved'];

    //  const dataApproved = <FormControl> this.campaignForm.controls['dataApproved'];
    dataApproved.setValue(approvalSubmitted);
    console.log('dataApproved: ');
    console.log(dataApproved.value);
    this.readyForApprovalCheck();

    // Record Date
    const date = new Date();
    let year = date.getUTCFullYear();
    let month = date.getUTCMonth();
    const day = date.getUTCDate();
    this.rejectionDate = day + '/' + month + "/" + year;
  }


  toggleModuleStatus(approvalSubmitted, i): void {
    console.log('FUNC: toggleModuleDataStatus()');
    const modulesControl = <FormArray> this.campaignForm.controls['modules'];
    const moduleControl = <FormGroup> modulesControl.controls[i];
    const approved = <FormControl> moduleControl.controls['approved'];
    approved.setValue(approvalSubmitted);
    this.readyForApprovalCheck();
  }

  readyForApprovalCheck() {
    console.log('FUNC: readyForApprovalCheck() ---> Check if all mods and data are qa-approved. If true then set flag to show request owner approval');

    const modulesControl = <FormArray> this.campaignForm.controls['modules'];
    // const dataApproved = <FormControl> this.campaignForm.controls['dataApproved'];
    const config = <FormGroup> this.campaignForm.controls['config'];
    const dataApproved = <FormControl> config.controls['dataApproved'];

    if (dataApproved.value === true) {
      console.log('dataApproved.value: ' + dataApproved.value);
      const moduleControls = modulesControl.controls;
      for (let j in moduleControls) {
        const mod = <FormGroup>modulesControl.controls[j];
        const eachApproved = <FormControl>mod.controls['approved'];
        // console.log(eachApproved.value);
        if (eachApproved.value !== true) {
          this.readyForApproval = false;
          console.log('eachApproved.value: ' + eachApproved.value);
          console.log(' this.readyForApproval: ' +  this.readyForApproval);
          //console.log('break');
          break;
        } 
        else {
          this.readyForApproval = true;
          console.log('eachApproved.value: ' + eachApproved.value);
          console.log(' this.readyForApproval: ' +  this.readyForApproval);
          // console.log('set');
        }
      }
    }; 
    if (dataApproved.value === false) {
      this.readyForApproval = false;
      console.log('dataApproved value is: ' + dataApproved.value);
      console.log('So setting readyForApproval to: ' + this.readyForApproval);
    }

  }

      approvalStatus() {
        console.log('FUNC: approvalStatus()');
        const campaignName = this.campaignForm.value.title + '_v' + this.campaignForm.value.version ;
        const owner = this.campaignForm.value.owner;
        const approveDate =  this.approvalDate;

        alert(campaignName + ' has been approved by ' + owner +  ' on ' + approveDate);
      }

      pendingStatus() {      
        console.log('FUNC: pendingStatus()');
        const campaignName = this.campaignForm.value.title + '_v' + this.campaignForm.value.version ;
        const owner = this.campaignForm.value.owner;

        alert('Approval for ' + campaignName + ' is still required from ' + owner);
      }

      pendingQAStatus() {      
        console.log('FUNC: pendingQAStatus()');
        const campaignName = this.campaignForm.value.title + '_v' + this.campaignForm.value.version ;
        const qa = this.campaignForm.value.qa;

        alert('Approval for this module is still required from ' + qa);
      }

      rejectionStatus() {      
        console.log('FUNC: rejectionStatus()');
        const campaignName = this.campaignForm.value.title + '_v' + this.campaignForm.value.version ;
        const owner = this.campaignForm.value.owner;
        const rejectionDate = <FormControl> this.campaignForm.controls['rejectionDate'].value;


        alert(campaignName + ' has been rejected by ' + owner +  ' on ' + rejectionDate + '. Please check for the required amendments flagged in red');
      }

  //////// ALERTS ////////////

  infoAlert(infoId: string, idNumber: any) {

    console.log('infoId: '+ infoId);
    console.log('idNumber: ' + idNumber);

    const fullId = infoId + idNumber;
    console.log('fullId: ' + fullId);

    const popup = document.getElementById(fullId);
    popup.classList.toggle("show");

    if (infoId === 'ownerInfo' || infoId === 'authorInfo' || infoId === 'qaInfo') {
      console.log('If statement true - infoId: ' + infoId);

      this.viewsArrowDisplay = !this.viewsArrowDisplay;
    }
  }

  demoAlert() {
    alert('This is a demo campaign. You can have a play around here. Controls are the same as a normal campaign but the "Save Campaign Data" and "Save Comments" buttons are disabled.');
  }

  //////// DATA PREVIEWS ////////////

  openModal(){
    console.log('FUNC: openModal() --->    Preview Email Data');
    this.formPreview = !this.formPreview;
    const id = 'custom-modal';
    this.modalService.open(id);
  }

  closeModal(){
    console.log('FUNC: openModal() --->    Close Email Data Preview');
    this.formPreview = !this.formPreview;
    const id = 'custom-modal';
    this.modalService.close(id);
  }

 ////////////// APPLY QA FLAGS /////////////

  toggleModFlag(moduleNumber, flagType): void {
    console.log('FUNC: toggleModFlag()');
    console.log(flagType);
    console.log(moduleNumber);

    //     const dataApproved = <FormControl> this.campaignForm.controls['dataApproved'];
    const config = <FormGroup> this.campaignForm.controls['config'];
    const dataApproved = <FormControl> config.controls['dataApproved'];

    if (flagType === '') {
      console.log('flagControl value is undefined so set true: )' + flagType.value);

      flagType.setValue(true);
      console.log('modApproved set false');

      if (moduleNumber === undefined)  {
        console.log('moduleNumber is undefined so set dataApproved to false');
        dataApproved.setValue(false);
      }
      else {
        const modulesControl = <FormArray> this.campaignForm.controls['modules'];
        const moduleControl = <FormGroup> modulesControl.controls[moduleNumber];
        const modApproved = <FormControl> moduleControl.controls['approved'];

        console.log('moduleNumber is defined so set modApproved to false');
        modApproved.setValue(false);
      }
    }
    else
    {
      console.log('flagControl.value: (defined so set opposite)' + flagType.value);
      flagType.setValue(!flagType.value);

      if (flagType.value === true)  {
        console.log('flagControl value is true!');

        if (moduleNumber === undefined)  {
          console.log('moduleNumber is undefined so set dataApproved to false');
          dataApproved.setValue(false);
        }
        else {
          const modulesControl = <FormArray> this.campaignForm.controls['modules'];
          const moduleControl = <FormGroup> modulesControl.controls[moduleNumber];
          const modApproved = <FormControl> moduleControl.controls['approved'];
          console.log('moduleNumber is defined so set modApproved to false');
          modApproved.setValue(false);
        }

      }
    }
  }

  /////// ENCODED FLAG ///////////

  toggleEndcodedFlag(moduleNumber): void {
    console.log('FUNC: toggleEndcodedFlag()');
    console.log('moduleNumber: ' + moduleNumber);

    const modulesControl = <FormArray> this.campaignForm.controls['modules'];
    const moduleControl = <FormGroup> modulesControl.controls[moduleNumber];
    const encodedFlagControl = <FormControl> moduleControl.controls['encodedFlag'];

    encodedFlagControl.setValue(!encodedFlagControl.value);
  }


    }
