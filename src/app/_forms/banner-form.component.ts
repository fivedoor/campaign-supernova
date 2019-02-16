import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Model } from '../_classes/model.class';

@Component({
  selector: 'banner-form',
  templateUrl: './banner-form.component.html',
  styleUrls: ['../_pages/campaign.component.css']

})
export class BannerFormComponent {
      @Input() module:any;
      @Input() i:number;
      
  @Output() sendModelData = new EventEmitter<any>();

    public bannerForm: FormGroup;
    newModel: Model;
 
  
    constructor(

      private _fb: FormBuilder,
      ) {}


ngOnInit(): void {

        this.newModel = new Model();
      this.setModel();
        //  console.log('module: ');
        //  console.log(this.module);
        //  console.log('module.value: ');
        //  console.log(this.module.value);
 
    // FORM
  this.bannerForm =
        this._fb.group({
                    name: ['', [Validators.required, Validators.minLength(3)]],
                    number: [''],
                    numberFlag: [''],
                    type: [''],
                    typeFlag: [''],
                    typeId: [''],
                    moduleAmends: [''],
                    approved: ['']
        });

    
    }

 /////// PASS DATA ///////////
 
 passModelData() {
 	 const newModel  = this.newModel;

    this.sendModelData.next({newModel});
  }

    ///////////// SET DATA /////////////

setModel() {
    console.log('FUNC: setModel()');

    if (this.module){
      // build Model from Module
      //Source
      const modulesValues = this.module.value;
      //Destination
      const modelValues  = this.newModel;

      for (const n in modulesValues) {
            modelValues[n] = modulesValues[n];
      };
    }
  }


  }

