import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Config } from '../_classes/config.class';
import { Logo } from '../_classes/logo.class';

@Component({
  selector: 'config-form',
  templateUrl: './config-form.component.html',
  styleUrls: ['../_pages/campaign.component.css']

})
export class ConfigFormComponent {
      @Input() module:any;
      @Input() configInput:any;
      @Input() CampaignInputisActive:any;
      @Input() viewType:string;
      @Output() sendConfigData = new EventEmitter<any>();

    public configForm: FormGroup;
    newConfig: Config;
    newLogo: Logo;

  
    constructor(
      private _fb: FormBuilder,
      ) {}


ngOnInit(): void {

      this.newConfig = new Config();
      this.newLogo = new Logo();

      this.setConfig();
      this.setLogo();
         // console.log('configInput: ');
         // console.log(this.configInput);
         // console.log('configInput.value: ');
         // console.log(this.configInput.value);
         // console.log('configInput.controls.logo: ');
         // console.log(this.configInput.controls.logo);
         // console.log('configInput.controls.logo.value: ');
         // console.log(this.configInput.controls.logo.value);


      const urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

    // FORM
 this.configForm =
        this._fb.group({
                    logo: this._fb.group({
                      href: ['', [Validators.required, Validators.pattern(urlRegex)]],
                      hrefFlag: [''],
                      type: [''],
                      typeFlag: [''],
                    }),
                    preheader: [''],
                    preheaderFlag: [''],
                    header: ['', [Validators.required]],
                    headerFlag: [''],
                    dataAmends: [''],
                    dataApproved: [''],
                    approved: [''],
        });

    
    }

 /////// PASS DATA ///////////
 
 passConfigData() {
 	 const newConfig  = this.newConfig;
   console.log('passing newConfig: ');
   console.log(this.newConfig);

    this.setConfigLogo();

    this.sendConfigData.next({newConfig});
  }

    ///////////// SET DATA /////////////

setConfig() {
    console.log('FUNC: setConfig()');

    if (this.configInput){
      // build Config from Module
      //Source
      const configInputValues = this.configInput.value;
      //Destination
      const configOutpuValues  = this.newConfig;

      for (const n in configInputValues) {
            configOutpuValues[n] = configInputValues[n];
      };
    }
  }

  setLogo() {
    console.log('FUNC: setLogo()');

    if (this.configInput){
      // build Config from Module
      //Source
      const configInputLogoValues = this.configInput.controls.logo.value;
      //Destination
      const configLogoOutpuValues  = this.newLogo;

      for (const n in configInputLogoValues) {
            configLogoOutpuValues[n] = configInputLogoValues[n];
      };
    }
  }

  setConfigLogo() {
    console.log('FUNC: setConfigLogo()');

      //Source
      const newLogo  = this.newLogo;
      //Destination
      const configLogo  = this.newConfig.logo;

      for (const n in newLogo) {
            configLogo[n] = newLogo[n];
      };
        //  console.log('configLogo: ');
        // console.log(configLogo);
  }


  }

