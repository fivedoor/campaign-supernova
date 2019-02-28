import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { UploadService } from '../_uploads/shared/upload.service';
import { Upload } from '../_uploads/shared/upload';
import { Model } from '../_classes/model.class';

@Component({
  selector: 'hero-form',
  templateUrl: './hero-form.component.html',
  styleUrls: ['../_pages/campaign.component.css']

})
export class HeroFormComponent {
   @Input() module:any;
   @Input() i:number;
   @Output() sendModelData = new EventEmitter<any>();

    public heroForm: FormGroup;
    newModel: Model;
  
  // Image Upload
     @ViewChild('myInput')
    imageInputVariable: any;

    imageFile: FileList;
    currentUpload: Upload;

   // URL Valifation
    urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

    constructor(

      private _fb: FormBuilder,
      private upSvc: UploadService

      ) {}


ngOnInit(): void {

        this.newModel = new Model();
      this.setModel();

    // FORM

 this.heroForm =
        this._fb.group({
                    name: ['', [Validators.required, Validators.minLength(3)]],
                    number: [''],
                    numberFlag: [''],
                    type: [''],
                    typeFlag: [''],
                    typeId: [''],
                    href: ['', [Validators.required, Validators.pattern(this.urlRegex)]],
                    hrefFlag: [''],
                    img: ['', [Validators.required, Validators.minLength(3)]],
                    imgFlag: [''],
                    key: [''],
                    src: [''],
                    srcFlag: [''],
                    height: [''],
                    width: [''],
                    heading: ['', [Validators.required, Validators.minLength(3)]],
                    headingFlag: [''],
                    moduleAmends: [''],
                    approved: ['']
        });


    
    }

 /////// PASS DATA ///////////
 
 passModelData() {
 	 const newModel  = this.newModel;
 	 const imageFile  = this.imageFile;
 	 const currentUpload  = this.currentUpload;


    this.sendModelData.next({newModel,imageFile,currentUpload});
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



/////////IMAGE UPLOAD ///////////

updateModelImage() {
  console.log('FUNC: updateModelImage()');
   if (this.currentUpload !== undefined ) {

     // Source 
   let name = this.currentUpload.name;
   let url = this.currentUpload.url;
   // let key = this.currentUpload.key;

   // Destination
    this.newModel.img = name; // JH added to update model label
    this.newModel.src = url;
    //  this.newModel.key = key;

    console.log('this.newModel.img: ');
    console.log(this.newModel.img);
    console.log('this.newModel.src: ');
    console.log(this.newModel.src);
   }
}
 
// https://angularfirebase.com/lessons/reactive-crud-app-with-angular-and-firebase-tutorial/
detectFiles(event) {
      console.log('FUNC: detectFiles()');

      this.imageFile = event.target.files;
      let fileArray = Array.from(this.imageFile);
     
      console.log('imageFile: ');
      console.log(this.imageFile);
      this.uploadSingle();
  }

  uploadSingle() {
    console.log('FUNC: uploadSingle()');
    //Source 
    const file = this.imageFile.item(0);
    this.currentUpload = new Upload(file);

    //Destination
    this.upSvc.pushUpload(this.currentUpload);
    console.log('this.currentUpload:');
    console.log(this.currentUpload);

  }


// http://plnkr.co/edit/0FJ0kKCVNjUP1hGaZzTt?p=preview
  resetImage() {
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

  
  }


