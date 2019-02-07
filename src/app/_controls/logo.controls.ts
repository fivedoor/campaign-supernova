import { FormControl, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

export const urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

 const logo = '';

export const LogoControls = {
                     href: ['', [Validators.required, Validators.pattern(urlRegex)]],
                     hrefFlag: [''],
                     type: ['supernova'],
                     typeFlag: [''],
                };
