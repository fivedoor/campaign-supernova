import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { UploadService } from '../_uploads/shared/upload.service';
import { Upload } from '../_uploads/shared/upload';
import { Model } from '../_classes/model.class';

@Component({
  selector: 'four-pid-form',
  templateUrl: './four-pid-form.component.html',
  styleUrls: ['../_pages/campaign.component.css']

})
export class FourPidFormComponent {
      @Input() module:any;
      @Input() i:number;
      
  @Output() sendModelData = new EventEmitter<any>();

    public fourPidForm: FormGroup;
    newModel: Model;

   // Text Escaping
    bracketsOpen: string = '{{';
    bracketsClose: string = '}}';
  
  // Image Upload
   @ViewChild('myInput1')
    myInputVariable_1: any;

  @ViewChild('myInput2')
    myInputVariable_2: any;

     @ViewChild('myInput3')
    myInputVariable_3: any;

      @ViewChild('myInput4')
    myInputVariable_4: any;

    selectedFiles: FileList;
    currentUpload: Upload;
    imgHeight: number;
    imgWidth: number;

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

 this.fourPidForm =
        this._fb.group({
                    name: ['', [Validators.required, Validators.minLength(3)]],
                    number: [''],
                    numberFlag: [''],
                    type: [''],
                    typeFlag: [''],
                    typeId: [''],
                    href_1: ['', [Validators.required, Validators.pattern(this.urlRegex)]],
                    href_1Flag: [''],
                    title_1: [''],
                    description_1: [''],
                    price_1: [''],
                    img_1: ['', [Validators.required, Validators.minLength(3)]],
                    img_1Flag: [''],
                    src_1: [''],
                    src_1Flag: [''],
                    key_1: [''],
                    href_2: ['', [Validators.required, Validators.pattern(this.urlRegex)]],
                    href_2Flag: [''],
                    title_2: [''],
                    description_2: [''],
                    price_2: [''],
                    img_2: ['', [Validators.required, Validators.minLength(3)]],
                    img_2Flag: [''],
                    src_2: [''],
                    src_2Flag: [''],
                    key_2: [''],
                    href_3: ['', [Validators.required, Validators.pattern(this.urlRegex)]],
                    href_3Flag: [''],
                    title_3: [''],
                    description_3: [''],
                    price_3: [''],
                    img_3: ['', [Validators.required, Validators.minLength(3)]],
                    img_3Flag: [''],
                    src_3: [''],
                    src_3Flag: [''],
                    key_3: [''],
                    href_4: ['', [Validators.required, Validators.pattern(this.urlRegex)]],
                    href_4Flag: [''],
                    title_4: [''],
                    description_4: [''],
                    price_4: [''],
                    img_4: ['', [Validators.required, Validators.minLength(3)]],
                    img_4Flag: [''],
                    src_4: [''],
                    src_4Flag: [''],
                    key_4: [''],
                    moduleAmends: [''],
                    approved: ['']
        });
    
 
    
    }

 /////// PASS DATA ///////////
 
 passModelData() {
 	 const newModel  = this.newModel;
 	 const selectedFiles  = this.selectedFiles;
 	 const currentUpload  = this.currentUpload;


    this.sendModelData.next({newModel,selectedFiles,currentUpload});
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

updateModelImage(i) {
  console.log('FUNC: updateModelImage()');
   if (this.currentUpload !== undefined ) {

   let name = this.currentUpload.name;
   let url = this.currentUpload.url;

      this.newModel['img_'+i] = name; 
      this.newModel['src_'+i] = url;


        /*if (i === 1 ) {
            this.newModel.img_1 = name; 
            this.newModel.src_1 = url;

        } else {
            this.newModel.img_2 = name; 
             this.newModel.src_2 = url;
        }*/

   }
}
 
// https://angularfirebase.com/lessons/reactive-crud-app-with-angular-and-firebase-tutorial/
detectFiles(event) {
      console.log('FUNC: detectFiles()');

      this.selectedFiles = event.target.files;
      let fileArray = Array.from(this.selectedFiles);
     
      console.log('selectedFiles: ');
      console.log(this.selectedFiles);
      this.uploadSingle();
  }

  uploadSingle() {
    console.log('FUNC: uploadSingle()');
    const file = this.selectedFiles.item(0);
    this.currentUpload = new Upload(file);
    this.upSvc.pushUpload(this.currentUpload);
    console.log('this.currentUpload:');
    console.log(this.currentUpload);

  }

// http://plnkr.co/edit/0FJ0kKCVNjUP1hGaZzTt?p=preview
  resetImage(myInputVariable, i: number) {

    if ( myInputVariable !== undefined ) {

    console.log(myInputVariable.nativeElement.files);
    myInputVariable.nativeElement.value = "";
    console.log(myInputVariable.nativeElement.files);
    }
    this.clearModelImageData(i);
  }
  
   clearModelImageData(i: number) {
    console.log('FUNC: clearModelImageData()');
    const obj =  this.newModel;
 
        delete obj['img_'+i];
        delete obj['src_'+i];
        delete obj['key_'+i];
  }


  }


