import { FormControl, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';


export const ConfigControls = {
                      preheader: [''],
                      preheaderFlag: [''],
                      header: ['', [Validators.required]],
                      headerFlag: [''],
                      dataAmends: [''],
                      dataApproved: [''],                
                      logo: ''
                };
