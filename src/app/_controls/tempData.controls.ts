    import { FormControl, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';



export const versionRegex = /^[^.]+$/;
export const urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

 const txt = '';
 const links = '';


export const TempDataControls = {
                    name: ['', [Validators.required, Validators.minLength(3)]],
                    number: [''],
                    numberFlag: [''],
                    type: [''],
                    typeFlag: [''],
                    typeId: [''],
                    href: ['', [Validators.required, Validators.pattern(urlRegex)]],
                    hrefFlag: [''],
                    img: ['', [Validators.required, Validators.minLength(3)]],
                    imgFlag: [''],
                    key: [''],
                    src: [''],
                    srcFlag: [''],
                    height: [''],
                    width: [''],
                    cta: ['', [Validators.required, Validators.minLength(3)]],
                    ctaFlag: [''],
                    heading: ['', [Validators.required, Validators.minLength(3)]],
                    headingFlag: [''],
                    copy: ['', [Validators.required, Validators.minLength(3)]],
                    copyFlag: [''],
                    encodedFlag: [false],
                    txt: txt,
                    links: links,
                    moduleAmends: [''],
                    approved: ['']
                };
