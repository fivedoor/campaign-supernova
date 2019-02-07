import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'footer-form',
  templateUrl: './footer-form.component.html',
  styleUrls: ['../_pages/campaign.component.css']

})
export class FooterFormComponent {
      @Input() module:any;
      @Input() i:number;

    @Output() sendModelData = new EventEmitter<any>();
    @Output() sendLinksData = new EventEmitter<any>();

    public footerForm: FormGroup;
    newModel: Model;
    newLinks: Links;

        // Text Escaping
    bracketsOpen: string = '{{';
    bracketsClose: string = '}}';

    // UI Editor Data
    linksNotFound: boolean = false;

    // URL Valifation
    urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
   
    // Show/Hide Data
    viewsArrowDisplay:  boolean = false;


    constructor(
      private _fb: FormBuilder,
      ) {}


	ngOnInit(): void {

	    this.newModel = new Model();
	    this.newLinks = new Links();
      this.setModel();

	    // FORM

	 	this.footerForm =
        this._fb.group({
                    name: ['', [Validators.required, Validators.minLength(3)]],
                    number: [''],
                    numberFlag: [''],
                    type: [''],
                    typeFlag: [''],
                    typeId: [''],
                    copy: ['', [Validators.required, Validators.minLength(3)]],
                    copyFlag: [''],
                    encodedFlag: [false],
                    txt: this._fb.array([]),
                    links: this._fb.array([]),
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


//////// INFO ////////////

// myPopupInput
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



    /////// DISPLAY LINKS UI ///////////

    getLinks (formType) {
     // formType is the destinationForLinksData
     console.log('FUNC: getLinks()');

     //  this.clearTextData();
     this.clearLinksData();
     this.clearThisFormLinks(formType);
     this.findLinks(this.newModel.copy, this.newModel.links); // Ready to push to module
     this.buildLinks();
     this.buildFormLinks(formType);
    }

  	findLinks(copySource, linksOutput) {
        console.log('FUNC: findLinks()');
        let obj = {};

        if (copySource) {
          const outputLinks = function (match: string, p1: string, p2: string, p3: string, offset: number, string: string): any {
              obj = {};
              // p1 = p1 + '.link';
              obj['linkName'] = p1;
              obj['text'] = p2;
              obj['linkFlag'] = false;   // p3: string, 
              obj['href'] = '';
              obj['link'] = "{% import 'macros/link-macro.html' as Link -%}{{Link.declare(" + p1 + ")}}";

              linksOutput.push(obj);
          };

          copySource.replace(/{{(.*?)\|(.*?)}}/g, outputLinks);
        }
         // Show error if no links found
        if (!linksOutput.length) {
           this.linksNotFound = true;
        }
        else {this.linksNotFound = false;
        };
    }

    buildLinks() {
    console.log('FUNC: buildLinks()');

    // Source
    const linksValues = this.newModel.links;
    // Destinatnion
    const modLinks  = this.newLinks;

     // build Links from newModel links
    for (const n in linksValues) {
        modLinks[n] = linksValues[n];
       };
  	}

  	buildFormLinks(formType) {
    console.log('FUNC: buildFormLinks()');
    // formType is the destinationForLinksData

    // Source
    const modelLinksValues = this.newModel.links;
    console.log('modelLinksValues:');
    console.log(modelLinksValues);

    // Destinatnion
    const stagingControl = <FormGroup> formType;
    console.log('stagingControl:');
    console.log(stagingControl);
    const staginglinkControl = <FormArray> stagingControl.controls['links'];
    console.log('staginglinkControl:');
    console.log(staginglinkControl);

    // Control seems to be required to display inputs on editor
    for (const i in modelLinksValues) {
         const iterator = parseInt(i, 10);
         staginglinkControl.push(this.initLinks(iterator, this.newLinks)); 
         }
  	}

  	initLinks(i: number, source) {
      const urlRegex = this.urlRegex;
        return this._fb.group({
            linkName: [source[i].linkName],
            text: [source[i].text],
            linkFlag: [source[i].linkFlag],
            href: [source[i].href, [Validators.required, Validators.pattern(urlRegex)]],
            link: [source[i].link],
        });
    }




     /////// CLEAR / DELETE DATA ///////////

	clearLinksData() {
            this.clearLinks();
            this.clearModelLinks();
          //  this.clearTempDataLinks();
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

    clearModelLinks() {
      console.log('FUNC: clearModelLinks()');
      console.log('newModel.links before:');
      console.log(this.newModel.links);
      this.newModel.links = [];
      console.log('newModel.links after:');
      console.log(this.newModel.links);

    }

	clearThisFormLinks(thisForm) {
	      console.log('FUNC: clearThisFormLinks()');
	      const tempDataControl = <FormGroup> thisForm;
	      console.log('thisForm - tempDataControl:');
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




}


export interface ILinks {
    linkName?: string;
    text?: string;
    href?: string;
    hrefFlag?: boolean;
    link?: string;
    linkFlag?: string;

}
export class Links implements ILinks {
     public linkName: string;
     public text: string;
     public href: string;
     public hrefFlag: boolean;
     public link: string;
     public linkFlag: string;

}

export interface IModel {
    name?: string;
    number?: number;
    numberFlag?: boolean;
    type?: string;
    typeId?: number;
    typeFlag?: boolean;
    href?: string;
    hrefFlag?: boolean;
    img?: string;
    imgFlag?: boolean;
    key?: string;
    src?: string;
    srcFlag?: boolean;
    width?: string;
    height?: string;
    cta?: string;
    ctaFlag?: boolean;
    heading?: string;
    headingFlag?: boolean;
    copy?: string;
    copyFlag?: boolean;
    txt?: string[];
    links?: string[];
    moduleAmends?: string;
    approved?: string;
    approvalDate?: any;
    rejectionDate?: any;

}
export class Model implements IModel {
    public name: string;
    public number: number;
    public numberFlag: boolean;
    public type: string;
    public typeId: number;
    public typeFlag: boolean;
    public href: string;
    public hrefFlag: boolean;
    public img: string;
    public imgFlag: boolean;
    public key: string;
    public src: string;
    public srcFlag: boolean;
    public width: string;
    public height: string;
    public cta: string;
    public ctaFlag: boolean;
    public heading: string;
    public headingFlag: boolean;
    public copy: string;
    public copyFlag: boolean;
    public txt: string[];
    public links: string[];
    public moduleAmends: string;
    public approved: string;
    public approvalDate: any;
    public rejectionDate: any;

}