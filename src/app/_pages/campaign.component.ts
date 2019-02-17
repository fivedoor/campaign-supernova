import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DataService } from '../_services/data.service';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UploadService } from '../_uploads/shared/upload.service';
import { Upload } from '../_uploads/shared/upload';
import { ModalService } from '../_services/index';
import { LogoOptions } from '../_config/options';
// Controls
import { TempDataControls } from '../_controls/tempData.controls';
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
/*  moduleId: module.id,
*/  selector: 'my-form',
  templateUrl: 'campaign.component.html',
  styleUrls: [ 'campaign.component.css' ],
})

export class FormComponent implements OnInit {

    // Data from route
    campaign: any;
    id: any; 
    type: any;  // email or demos 
    
    // Display Modules
    moduleLibrary = ModuleLibrary;
    logoOptions = LogoOptions;

    // Import Controls
    tempDataControls = TempDataControls;
    scssControls = ScssControls;
    attributesControls = AttributesControls;
    logoControls = LogoControls;
    configControls = ConfigControls;
    moduleControls = ModuleControls;

    // Import Inputs
    public moduleInputs = ModuleInputs;

    // Forms
    public myForm: FormGroup;
    
    // Campaign Team
    public testTeam: any[];
    public customTeam: any[];
    public fullTeam: any[];
    public arrayOfKeys: any
    old_values: any = {};
    
    // Image Upload
    @ViewChild('myInput')
    myInputVariable: any;
    selectedFiles: FileList;
    currentUpload: Upload;
    imgHeight: number;
    imgWidth: number;

    // Text Escaping
    bracketsOpen: string = '{{';
    bracketsClose: string = '}}';
    
    // View Type
    public viewType: string = 'author';

    // Approvals
    readyForApproval: boolean = false;
    approvalDate: any;
    rejectionDate: any;

    // Show/Hide Data
    DetailsInputisActive: boolean = false;
    CampaignInputisActive: boolean = false;
    EditorIsActive: boolean = false;
    isEditor: boolean = false;
    displayEncodedCopy: boolean = false;
    formPreview: boolean = false; // modal form preview
    viewsArrowDisplay:  boolean = false;
    buttonHoverModPreviewActive: boolean = false;  
    optionSelectModTypeActive: boolean = true;  
    tableHoverModBorderActive: boolean = false; 

    // UI Editor Data
    isLastMod: boolean = false; // for scrolling preview
    currentModule: number  = 0;
    linksNotFound: boolean = false;

    // TempData
    newModel: Model;
    newLinks: Links;
    newLogo: Logo;
    newConfig: Config;

   // Pass data to nested component (now using routing instead)
   // @Input() childData: any;

  constructor(
      private dataService: DataService,
      private activatedRoute: ActivatedRoute,
      private _fb: FormBuilder,
      private upSvc: UploadService,
      private router: Router,
      private modalService: ModalService,
      ) {}

  ngOnInit(): void {

    // This seems to get the id from htp used to display heading
     this.activatedRoute.params
       .subscribe(params => {
           this.id = params['id'];
           this.type = params['type'];
       });
     console.log('Assembling the form for: ' + this.id);
     console.log('The form type is: ' + this.type);


     // This is just dummy expression in part - (REWRITE required)
    // this.buildForm();
     this.dataService
       .getCampaignsData(this.type)
        .subscribe(
          (campaign: any) => {
            this.campaign = this.activatedRoute.snapshot.data['campaign'];
            
             this.buildCampaignForm();
             this.createLinkKeys();
             this.createTxtKeys();
             this.setFormValues();
             this.readyForApprovalCheck();
             const is_chrome = /chrome/i.test( navigator.userAgent );
             
            if(is_chrome) {
      setTimeout(function(){
               // console.log('chrome detected. Fix page Jump without time out  & scroll.');
                            window.scrollTo(0, 0);
              }, 0);
          }
          });



     this.dataService
     .getAllTeamData()
      .subscribe(
        (results: any) => {
            // ng7 migration .json() removed from results[0].json()
             this.testTeam = results[0];
             this.customTeam = results[1];
             this.fullTeam = Object.assign(this.testTeam, this.customTeam);
             this.arrayOfKeys = Object.keys(this.fullTeam);
             this.setRolesRecord();
        });


    this.newModel = new Model();
    this.newLinks = new Links();
    this.newLogo = new Logo();
    this.newConfig = new Config();

    // https://stackoverflow.com/questions/1410311/regular-expression-for-url-validation-in-javascript
    const urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    const versionRegex = /^[^.]+$/;
    const logoControls =  this.logoControls;
    const configControls = this.configControls;
    const txt = this._fb.array([]);
    const links = this._fb.array([]);
    const tempDataControls = this.tempDataControls;
    const scssControls = this.scssControls;
    const attributesControls = this.attributesControls;

    // FORM
    this.myForm =
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
                tempData: this._fb.group(tempDataControls),
                modules: this._fb.array([])
        });

          // Apply imported logo Controls to imported config Controls
          this.addLogoControls();
          // Apply Txt and Links Controls to imported tempData Controls
          this.addTempDataControls();

    }


/////// BUILD FORM AND LOAD DATA ////////

 addLogoControls() {
    console.log('FUNC: addLogoControls()');

    const logoControls =  this.logoControls;
    const logoControlsGroup = this._fb.group(logoControls);
    // console.log('logoControlsGroup:');
    // console.log(logoControlsGroup);

    const config = <FormGroup> this.myForm.controls['config'];
    // console.log('config:');
    // console.log(config);

    config.setControl('logo', logoControlsGroup); 
    // console.log('config AFTER:');
    // console.log(config);
   }

 addTempDataControls() {
    console.log('FUNC: addTempDataControls()');

    const tempData = <FormGroup> this.myForm.controls['tempData'];
    console.log('tempData:');
    console.log(tempData);

    tempData.setControl('txt', this._fb.array([])); 
    tempData.setControl('links', this._fb.array([])); 

    console.log('tempData AFTER:');
    console.log(tempData);
    
   }

  buildCampaignForm() {
    console.log('FUNC: buildCampaignForm()');

        const sourceModules = this.campaign['modules'];

          for (const i in sourceModules) {
            // Just need a reference to SourceModules[i]
            console.log('FUNC: buildCampaignForm(). Sourcing data from db.');
            console.log('this.campaign.modules[' + i + ']');
            console.log(sourceModules[i]);

            const iterator = sourceModules[i];

            const control = <FormArray>this.myForm.controls['modules'];
            control.push(this.initModule());
          }
  }

  initModule() {
        console.log('FUNC: initModule()');

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
        console.log('moduleControlsGroup.value');
        console.log(moduleControlsGroup.value)

        /*console.log('moduleControls');
        console.log(moduleControls);
        console.log('moduleControlsGroup');
        console.log(moduleControlsGroup);
        console.log('moduleControlsGroup.value');
        console.log(moduleControlsGroup.value);*/


  return moduleControlsGroup;

    }

  createLinkKeys() {
    console.log('FUNC: createLinkKeys()');

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
          const modulesControl = <FormArray> this.myForm.controls['modules'];
          const moduleControl = <FormGroup> modulesControl.controls[n];
          const moduleLinksControl = <FormArray> moduleControl.controls['links'];
      // Add a links object to the corresponding Module Links array (from the form)
        moduleLinksControl.push(this.initModuleLinks());
        }
      }
    }

  }

 initModuleLinks() {
        return this._fb.group({
            linkName: [''],
            text: [''],
            linkFlag: [''],
            href: [''],
            link: [''],
        });
    }


  createTxtKeys() {
    console.log('FUNC: createTxtKeys()');

    const SourceModules = this.campaign['modules'];

    // For each object in Modules array (from the db)
    for (const n in SourceModules) {

      const SourceModuleTxt = this.campaign['modules'][n]['txt'];

     // If there's a txt array then...
      if ( SourceModuleTxt) {

      // For each object in the txt array (from the db)
        for (const i in SourceModuleTxt) {
          const iterator = i;
          const modulesControl = <FormArray> this.myForm.controls['modules'];
          const moduleObjControl = <FormGroup> modulesControl.controls[n];
          const moduleTxtControl = <FormArray> moduleObjControl.controls['txt'];
          // Add a txt object to the corresponding Module txt array (from the form)
          moduleTxtControl.push(this.initTModuleTxt()); 
        }
      }
    }
  }

  initTModuleTxt() {
        return this._fb.group({
            paragraph: ['']
        });
    }


  // WHY IS THIS WORKING FOR ALL DATAKEYS????????????
  // Map Values to the modules just created
  setFormValues() {
    console.log('FUNC: setFormValues()');

    for (const key in this.campaign) {

      const mainCtrl = <FormControl>this.myForm.controls[key];

      if ( mainCtrl !== undefined ) {
      mainCtrl.patchValue(this.campaign[key]);
      // The patchValue() API method supports partial form updates, where we only need to specify some of the fields: 
      // setValue() API method that needs an object with all the form fields. If there is a field missing, we will get an error.
      console.log('FUNC: setFormValues(). Setting the form values');

      }
    }
  }





/////// APPROVALS  ///////////

  toggleCampaignStatus(approvalSubmitted): void {
    console.log('FUNC: toggleCampaignApproved()');
    const approvalStatus = <FormControl> this.myForm.controls['approved'];

     approvalStatus.setValue(approvalSubmitted);

          // Record Date
    const date = new Date();
    let year = date.getUTCFullYear();
    let month = date.getUTCMonth();
    const day = date.getUTCDate();
     
     if (approvalStatus.value === true) {
          this.approvalDate = day + '/' + month + "/" + year;

      // Reset dataApproved
      // const dataApproved = <FormControl> this.myForm.controls['dataApproved'];
      // dataApproved.setValue('');

      // Reset modules approved
      // const modulesControl = <FormArray> this.myForm.controls['modules'];
      // const moduleControls = modulesControl.controls;
      // for (let i in moduleControls) {
      //    const mod = <FormGroup>modulesControl.controls[i];
      //     const approved = <FormControl>mod.controls['approved'];
      //        approved.setValue('');
      // };
     }
     if (approvalStatus.value === false) {
          this.rejectionDate = day + '/' + month + "/" + year;

       const rejectionDate = <FormControl> this.myForm.controls['rejectionDate'];
       rejectionDate.setValue(this.rejectionDate);

     }
}

toggleCampaignDataStatus(approvalSubmitted): void {
    console.log('FUNC: toggleCampaignDataStatus()');
    const config = <FormGroup> this.myForm.controls['config'];
    const dataApproved = <FormControl> config.controls['dataApproved'];

//    const dataApproved = <FormControl> this.myForm.controls['dataApproved'];
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
      const modulesControl = <FormArray> this.myForm.controls['modules'];
      const moduleControl = <FormGroup> modulesControl.controls[i];
      const approved = <FormControl> moduleControl.controls['approved'];
      approved.setValue(approvalSubmitted);
      this.readyForApprovalCheck();
 }

readyForApprovalCheck() {
      console.log('FUNC: readyForApprovalCheck()');

      const modulesControl = <FormArray> this.myForm.controls['modules'];
      // const dataApproved = <FormControl> this.myForm.controls['dataApproved'];
      const config = <FormGroup> this.myForm.controls['config'];
      const dataApproved = <FormControl> config.controls['dataApproved'];

       console.log('Check if all mods and data are qa-approved');
       console.log('If true then set flag to show request owner approval');
       console.log('Check if all mods and data are qa-approved');

     // Check if all mods and data are qa-approved.
      // If true then set flag to show request owner approval
      // If data approved check if modules are all approved
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


//////// INFO ////////////

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
 // }
}

 demoAlert() {
    alert('This is a demo campaign. You can have a play around here. Controls are the same as a normal campaign but the "Save Campaign Data" and "Save Comments" buttons are disabled.');
}


////////////// SET VIEW /////////////

setView(view) {
    console.log('FUNC: setView()');
    console.log(view);

    // Close details editor table if open
    this.DetailsInputisActive  = false;
    // Close campaign editor table if open
    this.CampaignInputisActive  = false;
    // Close module editor table if open
    this.EditorIsActive = false;
    // reset isEditor
    this.isEditor = false;

    this.viewType = view;

    // Reset module  and hover preview selection
    this.tableHoverModBorderActive = false;
    this.buttonHoverModPreviewActive = false;
    
    // Reset last Mod
    this.isLastMod = false;
};


////////////// QA FLAGS /////////////



toggleModFlag(i, foo): void {
      console.log('FUNC: toggleModFlag()');
      console.log(foo);
      console.log(i);

//     const dataApproved = <FormControl> this.myForm.controls['dataApproved'];
      const config = <FormGroup> this.myForm.controls['config'];
      const dataApproved = <FormControl> config.controls['dataApproved'];

      if (foo === '') {
           console.log('flagControl value is undefined so set true: )' + foo.value);

            foo.setValue(true);
           console.log('modApproved set false');

            if (i === undefined)  {
              console.log('i is undefined so set dataApproved to false');
            dataApproved.setValue(false);
            }
            else {
                const modulesControl = <FormArray> this.myForm.controls['modules'];
                const moduleControl = <FormGroup> modulesControl.controls[i];
                const modApproved = <FormControl> moduleControl.controls['approved'];
               
               console.log('i is defined so set modApproved to false');
               modApproved.setValue(false);
            }
      }
      else
      {
        console.log('flagControl.value: (defined so set opposite)' + foo.value);
        foo.setValue(!foo.value);

        if (foo.value === true)  {
           console.log('flagControl value is true!');
          
            if (i === undefined)  {
              console.log('i is undefined so set dataApproved to false');
            dataApproved.setValue(false);
            }
            else {
                const modulesControl = <FormArray> this.myForm.controls['modules'];
                const moduleControl = <FormGroup> modulesControl.controls[i];
                const modApproved = <FormControl> moduleControl.controls['approved'];
               console.log('i is defined so set modApproved to false');
               modApproved.setValue(false);
            }

        }
      };
    }




/////// ENCODED FLAG ///////////

toggleEndcodedFlag(i): void {
      console.log('FUNC: toggleEndcodedFlag()');
      console.log(i);

      const modulesControl = <FormArray> this.myForm.controls['modules'];
      const moduleControl = <FormGroup> modulesControl.controls[i];
      const encodedFlagControl = <FormControl> moduleControl.controls['encodedFlag'];
      console.log(modulesControl);
      console.log(moduleControl);
      console.log(encodedFlagControl);
  
      encodedFlagControl.setValue(!encodedFlagControl.value);
    }

toggleEncodedCopy(i): void {
      this.displayEncodedCopy = !this.displayEncodedCopy;
       const modulePosition =  i;
  
   // Hack fix for page jump in Safari
   // Chrome has both 'Chrome' and 'Safari' inside userAgent string.
   // https://stackoverflow.com/questions/5899783/detect-safari-using-jquery
    if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {

      setTimeout(function(){
        console.log('Safari detected. Timeout hash fix used.');

       window.location.hash = '';
       window.location.hash = 'module' + modulePosition;
      }, 100);
    }
}

/////// DISPLAY INPUTS ///////////

toggleDetailsInput(): void {
      console.log('FUNC: toggleDetailsInput()');
      this.DetailsInputisActive = !this.DetailsInputisActive;
      // location.hash = '#details';
    }

toggleCampaignInput(state: string): void {
      console.log('FUNC: toggleCampaignInput()');
    
    this.currentModule = -1;

    this.CampaignInputisActive = !this.CampaignInputisActive;

    // reset hover preview  selection
    this.buttonHoverModPreviewActive = false;


    if (state === 'open') {
     console.log('state is: ' + state);
     // Show Module Position in Preview
     this.tableHoverModBorderActive  = true;
     console.log('buttonHoverModPreviewActive is: ' + this.buttonHoverModPreviewActive);

     // This freezes activity of other preview while campaign editor is open:
    // not sure why
     this.EditorIsActive  = true;
     this.isEditor = true;

    } 
    else {
     console.log('state is: ' + state);
     this.tableHoverModBorderActive = false;
     this.isEditor = false;
     this.EditorIsActive  = false;

     // Copy scss to attribute values 
     const attributesControl = <FormGroup> this.myForm.controls['attributes'];
     const scssControl = <FormGroup> this.myForm.controls['scss'];

     // scss
     const body_background = <FormControl>scssControl.controls['body_background'];
     const global_width = <FormControl>scssControl.controls['global_width'];
     const hero_colour = <FormControl>scssControl.controls['hero_colour'];
     const secondary_colour = <FormControl>scssControl.controls['secondary_colour'];
     const container_background = <FormControl>scssControl.controls['container_background'];
     const one_col_width = <FormControl>scssControl.controls['one_col_width'];
     const two_col_width = <FormControl>scssControl.controls['two_col_width'];
     const three_col_width = <FormControl>scssControl.controls['three_col_width'];
     const four_col_width = <FormControl>scssControl.controls['four_col_width'];

     // attributes
     const bodyBackground = attributesControl.controls['bodyBackground'];
     const globalWidth = attributesControl.controls['globalWidth'];
     const heroColour = attributesControl.controls['heroColour'];
     const secondaryColour = attributesControl.controls['secondaryColour'];
     const containerBackground = attributesControl.controls['containerBackground'];

    bodyBackground.setValue(body_background.value);
    globalWidth.setValue(global_width.value);
    heroColour.setValue(hero_colour.value);
    secondaryColour.setValue(secondary_colour.value);
    containerBackground.setValue(container_background.value);

    // Add units to scss
    global_width.setValue(global_width.value + 'px');
    one_col_width.setValue(one_col_width.value + 'px');
    two_col_width.setValue(two_col_width.value + 'px');
    three_col_width.setValue(three_col_width.value + 'px');
    four_col_width.setValue(four_col_width.value + 'px');

     console.log('EditorIsActive is: ' + this.EditorIsActive);
    }

}

toggleModulePreview(): void {
       console.log('FUNC: toggleModulePreview()');
      this.optionSelectModTypeActive = !this.optionSelectModTypeActive;
    }

 toggleIsEditorFalse(): void {
       console.log('FUNC: toggleIsEditorFalse()');
      this.isEditor = false;
    }



buttonHoverModPreview(i: number, isLast: boolean) {
    console.log('FUNC: buttonHoverModPreview()');

    // Clear All data
   // console.log('subFuncs: clearData()');
   // this.clearData();

  console.log('EditorIsActive: ' + this.EditorIsActive);
  console.log('isEditor: ' + this.isEditor);

  console.log('myForm.controls.approved.value:');
  console.log(this.myForm['controls'].approved.value);

  console.log('moduleInputs.preview: ' + this.moduleInputs.preview);

   if (this.EditorIsActive === false) {
    this.currentModule = i;
    console.log('currentModule: ' + this.currentModule);
  }
    if (this.EditorIsActive === false) {
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

    if (this.EditorIsActive === false) {
    this.currentModule = i;
    console.log('currentModule: ' + this.currentModule);
  }
    if (this.EditorIsActive === false) {
    this.tableHoverModBorderActive  = !this.tableHoverModBorderActive;
    console.log('tableHoverModBorderActive is: ' + this.tableHoverModBorderActive);
  }
}

  openModal(){
this.formPreview = !this.formPreview;
  const id = 'custom-modal';
        this.modalService.open(id);
    }
 
  closeModal(){
    this.formPreview = !this.formPreview;
    const id = 'custom-modal';
        this.modalService.close(id);
    }


/////// DISPLAY EDITOR ///////////

OpenEditor(i: number, isEditor: boolean, callback): void {
    console.log('------------------------------------');
    console.log('FUNC: OpenEditor(). OPEN EDITOR');

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
    // Define UI type (for submit button)
    this.isEditor = isEditor;
    console.log('isEditor: ' + this.isEditor);
    this.currentModule = i;
    console.log('currentModule: ' + this.currentModule);
    this.EditorIsActive  = true;
    console.log('EditorIsActive is: ' + this.EditorIsActive);

    // RESET DISPLAY
    // Close details editor table if open
    this.DetailsInputisActive  = false;
    // Close campaign editor table if open
    this.CampaignInputisActive  = false;
     // This resets the Select Box to default:
     const tempDataControl = <FormGroup>this.myForm.controls['tempData'];
     const typeControl = <FormControl>tempDataControl.controls['type'];
     typeControl.setValue('');


     // If editing existing module then populate model with data from module 
     if (isEditor === true) {
     console.log('Setting Model with nested Funcs:');
     this.setModel(i);
     this.setLinks();
     this.setTempDataLinks(); // I think this is needed to add formControls as well as data??
     this.setTempDataTxt(); // txt doesn't populate without this within this function??
     this.setTempData(); //  working on own in separated tests but not in this function

    const modulesControl = <FormArray> this.myForm.controls['modules'];
    const moduleControl = <FormGroup> modulesControl.controls[i];
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


OpenEditorTest1(i: number, isEditor: boolean): void {
    console.log('------------------------------------');
    console.log('FUNC: OpenEditorTest1(). OPEN EDITOR');

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
    // Define UI type (for submit button)
    this.isEditor = isEditor;
    console.log('isEditor: ' + this.isEditor);
    this.currentModule = i;
    console.log('currentModule: ' + this.currentModule);
    this.EditorIsActive  = true;
    console.log('EditorIsActive is: ' + this.EditorIsActive);

    // RESET DISPLAY
    // Close details editor table if open
    this.DetailsInputisActive  = false;
    // Close campaign editor table if open
    this.CampaignInputisActive  = false;
     // This resets the Select Box to default:
     const tempDataControl = <FormGroup>this.myForm.controls['tempData'];
     const typeControl = <FormControl>tempDataControl.controls['type'];
     typeControl.setValue('');
}


setInputTest(i) {
    console.log('FUNC: setInputTest()');
     // If editing existing module then populate model with data from module 
    const modulesControl = <FormArray> this.myForm.controls['modules'];
    const moduleControl = <FormGroup> modulesControl.controls[i];
    const typeId = <FormControl> moduleControl.controls['typeId'].value;
    this.setInputs(typeId);
    
    }


closeEditor() {
   console.log('FUNC: closeEditor()');
  // Clear all temp/model data
  console.log('subFUNC: clearData()');
  this.clearData();

  this.EditorIsActive = false;
  console.log('EditorIsActive is: ' + this.EditorIsActive);
  console.log('currentModule is: ' + this.currentModule);

  // Hide Module Position Preview
  this.buttonHoverModPreviewActive  = false;
}

// https://stackoverflow.com/questions/33700266/how-can-i-get-new-selection-in-select-in-angular-2
setInputs(selectedModule) {
    console.log('FUNC: setInputs()');
    console.log(selectedModule);
    this.moduleInputs.typeId = selectedModule;
    this.moduleInputs.file = this.moduleLibrary[selectedModule]['file'];
    this.moduleInputs.type = this.moduleLibrary[selectedModule]['type'];
    this.moduleInputs.name = this.moduleLibrary[selectedModule]['name'];
    this.moduleInputs.preview = this.moduleLibrary[selectedModule]['preview'];
    this.moduleInputs.href = this.moduleLibrary[selectedModule]['href'];
/*    this.moduleInputs.href_1 = this.moduleLibrary[selectedModule]['href_1'];
    this.moduleInputs.href_2 = this.moduleLibrary[selectedModule]['href_2'];
    this.moduleInputs.href_3 = this.moduleLibrary[selectedModule]['href_3'];
    this.moduleInputs.href_4 = this.moduleLibrary[selectedModule]['href_4'];*/
    this.moduleInputs.img = this.moduleLibrary[selectedModule]['img'];
    this.moduleInputs.src = this.moduleLibrary[selectedModule]['src'];
    this.moduleInputs.cta = this.moduleLibrary[selectedModule]['cta'];
    this.moduleInputs.heading = this.moduleLibrary[selectedModule]['heading'];
    this.moduleInputs.copy = this.moduleLibrary[selectedModule]['copy'];
};

setPersonel(role, personId, Idtype) {
    console.log('FUNC: setPersonel()');
    // Set Personel data based on id
    console.log('role: ' + role);
    console.log('personId: ' + personId);
    console.log('Idtype: ' + Idtype);

    const roleEmail = role + 'Email';
    console.log(roleEmail);

    const roleControl = <FormControl>this.myForm.controls[role];
    const roleEmailControl = <FormControl>this.myForm.controls[roleEmail];

    roleControl.setValue(this.testTeam[personId].name);
    roleEmailControl.setValue(this.testTeam[personId].email);



  // Prevent selecting same team member twice
  // http://jsfiddle.net/nDGu8/8/
  if (this.old_values[Idtype]) {
        console.log('Found Existing Team Members');

        let s = document.querySelectorAll('option[value="' + this.old_values[Idtype] + '"]');
        [].forEach.call(s, function (option) {
            option.disabled = false;
        });
    }
    let s = document.querySelectorAll('option[value="' + personId + '"]');
    [].forEach.call(s, function (option) {
        if (option.parentNode !== this) {
            option.disabled = true;
        }
    }, this);
    this.old_values[Idtype] = personId;

  };



  setRolesRecord() {
    console.log('FUNC: setRolesRecord()');

    // build Model from Module
    const rolesRecord = <FormControl>this.myForm.controls['rolesrecord'].value;
    const oldlValues  = this.old_values;

    for (const n in rolesRecord) {
          oldlValues[n] = rolesRecord[n];
    };

    const authorId = oldlValues['authorId'];
    const ownerId = oldlValues['ownerId'];
    const qaId = oldlValues['qaId'];

   this.setPersonel('author', '-KvlDTnb7qrW_Mdl6YaQ', 'authorId');
   this.setPersonel('owner', '-KvlD4gHef8ao1LAcxhu', 'ownerId');
   this.setPersonel('qa', '-KvlYHv9u-0sZ-yMw2q7', 'qaId');

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

  setModel(i: number) {
    console.log('FUNC: setModel()');

    // build Model from Module
    const modulesValues = this.myForm.value['modules'][i];
    const modelValues  = this.newModel;

    for (const n in modulesValues) {
          modelValues[n] = modulesValues[n];
    };
  }

  setLinks() {
     console.log('FUNC: setLinks()');

    // build ModelLinks from Model.links
  const modelLinksValues = this.newModel.links;
  const modLinks  = this.newLinks;

    for (const n in modelLinksValues) {
        modLinks[n] = modelLinksValues[n];
       };
  }

  setTempData() {
     console.log('FUNC: setTempData()');
    // build tempData from Model
     const modelValues = this.newModel;
     const tempDataValue = <FormGroup>this.myForm.value['tempData'];
     const tempDataControl = <FormGroup>this.myForm.controls['tempData'];
     const tempDataControlValue = tempDataControl.value;


     for (const i in modelValues) {
       // console.log(modelLinksValues[i]);
       const iterator = parseInt(i, 10);
       tempDataControlValue[i] = modelValues[i];
       }

  }

  setTempDataLinks() {
    console.log('FUNC: setTempDataLinks()');
    // build tempDataLinks from Model.links
    const modelLinksValues = this.newModel.links;

    console.log('this.newModel.links:');
    console.log(this.newModel.links);

    const tempDataControl = <FormGroup>this.myForm.controls['tempData'];
    const tempDatalinkControl = <FormArray> tempDataControl.controls['links'];
    // const tempDatalinkControlValue = <FormArray> tempDatalinkControl.value;
    // Control seems to be required to display inputs on editor
    console.log('tempDatalinkControl:');
    console.log(tempDatalinkControl);

    for (const i in modelLinksValues) {
         // console.log(modelLinksValues[i]);
         const iterator = parseInt(i, 10);
         tempDatalinkControl.push(this.initLinks(iterator, this.newLinks)); //recode
    }
  }

  setTempDataTxt() {
     console.log('FUNC: setTempDataTxt()');
    // build tempDataLinks from Model.links
    const modelTxtValues = this.newModel.txt;

    const tempDataControl = <FormGroup>this.myForm.controls['tempData'];
    // const tempDataTxtControl = <FormArray> tempDataControl.controls['txt'];
    const tempDataTxtValue = <FormArray> tempDataControl.controls['txt'].value;

    console.log('modelTxtValues: ');
    console.log(modelTxtValues);
    console.log('tempDataTxtValue: ');
    console.log(tempDataTxtValue);

    for (const n in modelTxtValues) {
        tempDataTxtValue[n] = modelTxtValues[n];
    };

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
         console.log('FUNC: addConfigData()');

           // update newModel based on values from child Form
         if (event) {
             if (event.newConfig) {
               for(var k in event.newConfig) { 
                 this.newConfig[k] = event.newConfig[k]};
             }
            
         }
         const configGroup  = <FormGroup>this.myForm.controls['config'];
         const newLogo  = this.newLogo;
         const newConfigLogo  = this.newConfig.logo;


         const newConfig  = this.newConfig;

      // Hide Module Position Preview
      this.buttonHoverModPreviewActive  = false;
      this.tableHoverModBorderActive = false;
      this.CampaignInputisActive  = false;


         console.log('newConfig:');
         console.log(newConfig);

        configGroup.patchValue(newConfig);
         
         console.log('newConfig:');
         console.log(newConfig);

      this.closeEditor();
   // this.moveToData();
    this.toggleIsEditorFalse();
  }


  addData(event) {
         console.log('FUNC: addData(). ADD DATA.');

           // update newModel based on values from child Form
         if (event) {
             if (event.newModel) {
               for(var k in event.newModel) { 
                 this.newModel[k] = event.newModel[k]};
             }
             if (event.selectedFiles) {
               this.selectedFiles = event.selectedFiles;
             }
              if (event.currentUpload) {
               this.currentUpload = event.currentUpload;
             }
         }
         const modulesArray  = <FormArray>this.myForm.controls['modules'];
         const currentModule  = this.currentModule;
         const currentModuleValues  = <FormGroup>this.myForm.value['modules'][this.currentModule];
         const selectedFiles  = this.selectedFiles;
         const currentUpload  = this.currentUpload;
        
         const newLinks  = this.newLinks;

       

        // let newModelTxt  = this.newModel.txt;
        // newModelTxt value remains the same as whatever value was referenced at this time unless newModelTxt is reassigned/altered. Even if this.newModel.txt changes newModelTxt seems to stay the same
         const newModelLinks  = this.newModel.links;
         const newModel  = this.newModel;


         // Hide Module Position Preview
      this.buttonHoverModPreviewActive  = false;
      this.tableHoverModBorderActive = false;

      this.clearModelText();
      this.clearTempDataText();
      this.findText(
           this.newModel.copy,           // copySource,
           this.newModel.txt           // txtOutput
      );
          console.log('After FindText - newModel.txt');
           console.log(newModel.txt);
            console.log('After FindText - this.newModel.txt');
           console.log(this.newModel.txt);
         /*  console.log('After FindText - tempDataValues:');
           console.log(tempDataValues);*/
  
        this.newData(
            <FormArray>this.myForm.controls['modules'],          // modulesArray,
            this.currentModule,         // currentModule,
            this.selectedFiles,         // imageData,
            this.newModel,              // newdataSource
            this.newModel.txt,// tempDataTxtFormValue,  // newdataSourceTxtArray
            this.newModel.links,         // newdataSourceLinksArray,
            this.currentUpload,          // newdataSourceImgdata
            this.moduleInputs   // newdataSourceType

        );

        // If 'editor' then replace the existing module in position
         if (this.isEditor === true) {
              this.removeModule(this.currentModule);
         };

    
    this.closeEditor();
    this.moveToData();
    this.toggleIsEditorFalse();
  }


    newData(
        modulesArray,
        currentModule,
        imageData,
        newdataSource,
        newDataSourceTxtArray,
        newDataSourceLinksArray,
        newDataSourceImgdata,
        newDataSourceType
        ) {
        console.log('FUNC: newData()');
       // console.log('newDataSourceTxtArray: ');
       // console.log(newDataSourceTxtArray);
        
        // map tempData to new module formGroup  - insert after the currentModule formGroup
        // https://angular.io/docs/ts/latest/api/forms/index/FormArray-class.html#!#insert-anchor
       // console.log('NO selectedFiles detected');
       // console.log('initData');
        modulesArray.insert(currentModule + 1, this.initData(newdataSource, newDataSourceTxtArray, newDataSourceType));
        
        // Now add the new links Controls to the new module Controls...
        const modNum = currentModule + 1;
        const moduleGroup = <FormGroup>modulesArray.controls[modNum];
        const moduleGroupLinks = <FormArray>moduleGroup.controls['links'];
        for (const i in newDataSourceLinksArray) {
            const iterator = parseInt(i, 10);
            moduleGroupLinks.push(this.initLinks(iterator, newDataSourceLinksArray));
           }
     
    }
       

     // map tempData to new formGroup
    initData(dataSource, dataSourceTxtArray, dataSourceType) {
        return this._fb.group({
                  name: [dataSource.name],
                  number: [''], // module number - form actually uses [i] for display
                  numberFlag: [dataSource.numberFlag],
                  type: [dataSourceType.type],
                  typeFlag: [dataSource.typeFlag],
                  typeId: [dataSourceType.typeId],
                  file: [dataSourceType.file],
                  href: [dataSource.href],
                  href_1: [dataSource.href_1],
                  href_2: [dataSource.href_2],
                  href_3: [dataSource.href_3],
                  href_4: [dataSource.href_4],
                  hrefFlag: [dataSource.hrefFlag],
                  img: [dataSource.img],
                  img_1: [dataSource.img_1],
                  img_2: [dataSource.img_2],
                  img_3: [dataSource.img_3],
                  img_4: [dataSource.img_4],
                  imgFlag: [dataSource.imgFlag],
                  key: [dataSource.key],
                  src: [dataSource.src],
                  src_1: [dataSource.src_1],
                  src_2: [dataSource.src_2],
                  src_3: [dataSource.src_3],
                  src_4: [dataSource.src_4],
                  srcFlag: [dataSource.srcFlag],
                  height: [dataSource.height],
                  width: [dataSource.width],
                  cta: [dataSource.cta],
                  ctaFlag: [dataSource.ctaFlag],
                  heading: [dataSource.heading],
                  headingFlag: [dataSource.headingFlag],
                  copy: [dataSource.copy],
                  copyFlag: [dataSource.copyFlag],
                  description_1: [dataSource.description_1],
                  description_2: [dataSource.description_2],
                  description_3: [dataSource.description_3],
                  description_4: [dataSource.description_4],
                  title_1: [dataSource.title_1],
                  title_2: [dataSource.title_2],
                  title_3: [dataSource.title_3],
                  title_4: [dataSource.title_4],
                  price_1: [dataSource.price_1],
                  price_2: [dataSource.price_2],
                  price_3: [dataSource.price_3],
                  price_4: [dataSource.price_4],
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



 
  findText(copySource, txtOutput) {
      console.log('FUNC: findText()');
      //  copySource = this.newModel.copy,           
      // txtOutput =  this.newModel.txt  


      if (copySource) {
          console.log('this.newModel.copy detected');
          console.log('Creating Txt nodes from copy');

          let obj: any = {};

          const outputText = function(match: string, p1: string): any {
              obj = {};
              // Encode text
              p1 = detergent(p1, {

                  removeWidows: true,             // replace the last space in paragraph with &nbsp;
                  convertEntities: true,          // encode all non-ASCII chars
                  convertDashes: true,            // typographically-correct the n/m-dashes
                  convertApostrophes: true,       // typographically-correct the apostrophes
                  replaceLineBreaks: true,        // replace all line breaks with BR's
                  removeLineBreaks: false,        // put everything on one line
                  useXHTML: true,                 // add closing slashes on BR's
                  removeSoftHyphens: true,        // remove character which encodes to &#173; or &shy;
                  dontEncodeNonLatin: true,       // skip non-latin character encoding
                  keepBoldEtc: true,              // any bold, strong, i or em tags are stripped of attributes and retained
                 // enforceFullStopSpaces: false // JH added custom option to prevent adding space after '.' in the nunjucks links symbol

              });

            obj['paragraph'] = p1;
            txtOutput.push(obj);  
          };
          // reformat links for njucks
          copySource = copySource.replace(/\|(.*?)}}/g, '.link|safe}}');
          // split paragraphs
          copySource.replace(/([^\n]+)/g, outputText);
          
          console.log('txtOutput after:');
          console.log(txtOutput);
          let newModelTxt  = this.newModel.txt;
          console.log('newModelTxt after:');
          console.log(newModelTxt);   
         
      } else {
        console.log('No copy detected from copySource which is this.newModel.copy');
      }
  }




     /////// CLEAR / DELETE DATA ///////////

    clearData() {

            this.clearModel();
            this.clearTempDataLinks();
            this.clearTempDataText();
            this.clearLinks(); // needs to occur after emptying clearTempDataLinks otherwise conflicts with inputs
            this.clearTempData(); //clears data not controls
            this.clearImageData();
            this.clearModuleInputs();

    }

    clearLinksData() {
            this.clearLinks();
            this.clearModelLinks();
            this.clearTempDataLinks();
    }

    clearTextData() {
            this.clearTempDataText();
    }

    clearImageData() {
      this.clearCurrentUpload();
      this.clearSelectedFiles();
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

    clearSelectedFiles() {
      console.log('FUNC: clearSelectedFiles()');
      const obj =  this.selectedFiles;
      if ( obj !== undefined ) {
         console.log('selectedFiles:');
         console.log(obj);
      // https://stackoverflow.com/questions/3144419/how-do-i-remove-a-file-from-the-filelist
      // https://stackoverflow.com/questions/12989741/the-property-value-does-not-exist-on-value-of-type-htmlelement
      // let inputValue = (<HTMLInputElement>document.getElementById('img')).value;
      // inputValue = '';
      // document.getElementById('img').value = "";

      this.resetImage();
      console.log('selectedFiles (after resetImage()):');
      console.log(obj);
      }
    }

    // http://plnkr.co/edit/0FJ0kKCVNjUP1hGaZzTt?p=preview
  resetImage() {
    if ( this.myInputVariable !== undefined ) {

    console.log(this.myInputVariable.nativeElement.files);
    this.myInputVariable.nativeElement.value = "";
    console.log(this.myInputVariable.nativeElement.files);
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

  clearTempDataImageData() {
    // Causes tempData to repopulate ??
       console.log('FUNC: clearTempDataImageData()');
       const tempDataControl = <FormGroup>this.myForm.controls['tempData'];
       const tempDataKeyControl =  <FormControl>tempDataControl.controls['key'];
       const tempDataUrlControl =  <FormControl>tempDataControl.controls['src'];
       const tempDataImgControl =  <FormControl>tempDataControl.controls['img'];

       tempDataKeyControl.patchValue('');
       tempDataUrlControl.patchValue('');
       tempDataImgControl.patchValue('');
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
       console.log('FUNC: clearLinks()');
       // Empty ModelLinks
       const obj =  this.newLinks;
       console.log('newLinks before:');
       console.log(obj);

       for (const prop of Object.keys(obj)) {
        delete obj[prop];
       }
       console.log('newLinks after:');  // NOT WORKING???
       console.log(obj);

    }

     clearModelText() {
      console.log('FUNC: clearModelText()');
      console.log('newModel.txt before:');
      console.log(this.newModel.txt);
      this.newModel.txt = [];
      console.log('newModel.txt after:');
      console.log(this.newModel.txt);
    }

     clearModelLinks() {
      console.log('FUNC: clearModelLinks()');
      console.log('newModel.links before:');
      console.log(this.newModel.links);
      this.newModel.links = [];
      console.log('newModel.links after:');
      console.log(this.newModel.links);

    }

    clearTempData() {
        console.log('FUNC: clearTempData()');
        const tempDataValue = <FormGroup>this.myForm.value['tempData'];
             for (const i in tempDataValue) {
             delete tempDataValue[i];
            }
    }

    clearTempDataLinks() {
      console.log('FUNC: clearTempDataLinks()');
      const tempDataControl = <FormGroup>this.myForm.controls['tempData'];
      const linkControl = <FormArray> tempDataControl.controls['links'];

      console.log('tempDataControl.controls.links before:');
      console.log(linkControl);
        // Empty Temp Data 'Links'
        // http://stackoverflow.com/questions/36839088/remove-multiple-controls-from-controlarray

        while (linkControl.length) {
        linkControl.removeAt(0);
         console.log('tempDataControl.controls.links after:');
         console.log(linkControl);
       };
      
    }

    clearThisFormLinks(thisForm) {
      console.log('FUNC: clearThisFormLinks()');
      const tempDataControl = <FormGroup> thisForm;
      console.log('tempDataControl:');
      console.log(tempDataControl);

      const linkControl = <FormArray> tempDataControl.controls['links'];

      console.log('thisForm.controls.links before:');
      console.log(linkControl);
        // Empty Temp Data 'Links'
        // http://stackoverflow.com/questions/36839088/remove-multiple-controls-from-controlarray

        while (linkControl.length) {
        linkControl.removeAt(0);
         console.log('thisForm.controls.links after:');
         console.log(linkControl);
       };
      
    }

    clearTempDataText() {
        console.log('FUNC: clearTempDataText()');
        const tempDataControl = <FormGroup>this.myForm.controls['tempData'];
        const textControl = <FormArray> tempDataControl.controls['txt'];
        const tempDataTxtValue = <FormArray> tempDataControl.controls['txt'].value;
        // http://stackoverflow.com/questions/41852183/angular-2-remove-all-items-from-a-formarray
        const emptyArray = [];
        console.log('tempDataText before:');
        console.log(textControl);
        console.log(tempDataTxtValue);
        textControl.patchValue(emptyArray);
        console.log('tempDataText after:');
        console.log(textControl);
        console.log(tempDataTxtValue);
       
    }

    removeModule(i: number) {
      console.log('FUNC: removeModule()');
      const control = <FormArray>this.myForm.controls['modules'];
      control.removeAt(i);
      this.tableHoverModBorderActive = false;

    }



    /////// SAVE DATA ///////////

    setCampaign() {
      console.log('FUNC: setCampaign()');
        // changed var to let and "" to ''
        //  const campaignName = '/' + this.myForm.value.title + '_v' + this.myForm.value.version + '/';
        // same result either way when slahses removed?!
        const campaignName = this.myForm.value.title + '_v' + this.myForm.value.version ;
        console.log('campaign name is ' + campaignName);


        this.dataService
          .setCampaignData(
              campaignName,
              this.myForm
              )
          .subscribe(
            (campaignName: any) => this.campaign = (campaignName) // WHY IS THIS BIT REQUIRED ????
          );
           alert(campaignName + 'has been saved to the database');

          console.log('campaign id is ' + this.id);

           if (this.id !== campaignName) {

           //  const versionControl = <FormControl>this.myForm.controls['version'].value;
            //  const titleControl = <FormControl>this.myForm.controls['title'].value;
           // let value = titleControl + '_v' + versionControl;

             this.router.navigate(['form/emails/' + campaignName]);

           };
    }


    /////// BUILD CAMPAIGN DATA FOR DOWNLOAD JSON ///////////

    buildCampaign() {
      console.log('FUNC: buildCampaign()');

     // const txtControl = <FormArray> modelControl.controls['txt'];
      const campaignDataNjks = {};

      const moduleData = <FormArray>this.myForm.controls['modules'].value;

     console.log('FUNC: buildCampaign(moduleData)');
     console.log(moduleData);

      // Set non-module based values
      const config = <FormGroup>this.myForm.controls['config'];
      const preheader = <FormControl>config.controls['preheader'];
      const header = <FormControl>config.controls['header'];
      const logo = <FormGroup>config.controls['logo'];
      const logoLink = <FormControl>logo.controls['href'];
      const logoType = <FormControl>logo.controls['type'];
      const scssData = <FormGroup>this.myForm.controls['scss'].value;
      const attributes = <FormGroup>this.myForm.controls['attributes']
      const attributesData = <FormGroup>this.myForm.controls['attributes'].value;
     
   
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
            campaignDataNjks['scss'][newObj] = scssData[i]
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
        const linksData = <FormArray>this.myForm.controls['modules'].value[i]['links'];
        
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
      FileSaver.saveAs(file, this.id + '_data.json');

  }


/////////////// STATUS DATA /////////////////

  approvalStatus() {
      console.log('FUNC: approvalStatus()');
      const campaignName = this.myForm.value.title + '_v' + this.myForm.value.version ;
      const owner = this.myForm.value.owner;
      const approveDate =  this.approvalDate;

     alert(campaignName + ' has been approved by ' + owner +  ' on ' + approveDate);
   }

   pendingStatus() {      
      console.log('FUNC: pendingStatus()');
      const campaignName = this.myForm.value.title + '_v' + this.myForm.value.version ;
      const owner = this.myForm.value.owner;

     alert('Approval for ' + campaignName + ' is still required from ' + owner);
   }

   pendingQAStatus() {      
      console.log('FUNC: pendingQAStatus()');
      const campaignName = this.myForm.value.title + '_v' + this.myForm.value.version ;
      const qa = this.myForm.value.qa;

     alert('Approval for this module is still required from ' + qa);
   }

   rejectionStatus() {      
      console.log('FUNC: rejectionStatus()');
      const campaignName = this.myForm.value.title + '_v' + this.myForm.value.version ;
      const owner = this.myForm.value.owner;
   const rejectionDate = <FormControl> this.myForm.controls['rejectionDate'].value;
      

     alert(campaignName + ' has been rejected by ' + owner +  ' on ' + rejectionDate + '. Please check for the required amendments flagged in red');
   }





}
