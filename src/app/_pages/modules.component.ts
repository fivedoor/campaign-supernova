import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Campaign } from '../_classes/campaign.class';
import { ModalService } from '../_services/index';



@Component({
/*  moduleId: module.id,
*/  selector: 'my-modules',
  templateUrl: 'modules.component.html',
/*  styles: ['a.disabled { pointer-events: none; cursor: default;}'],
*/  styleUrls: [ 'modules.component.css' ]
})
export class ModuleComponent implements OnInit {

  public moduleTypeArray = [

    {
      type: 'hero',
      name: 'Hero Module',
      file: 'macros/hero-macro.html',
      preview: 'https://firebasestorage.googleapis.com/v0/b/ngdataformdemo.appspot.com/o/hero_sample.jpg?alt=media&token=563d3106-cb37-4e56-9baa-356c0c535aa1',
      description: "Requirements: Hero image should be 600px (or 1200px for high res) width.",
      typeId: 0,
      href: true,
      img: true,
      src: true,
      cta: false,
      heading: true,
      copy: false,
    },
    {
      type: 'textMod',
      name: 'Text Module',
      file: 'macros/1uptext-macro.html',
      preview: 'https://firebasestorage.googleapis.com/v0/b/ngdataformdemo.appspot.com/o/uploads%2Ftext_sample.jpg?alt=media&token=80a453ca-677f-4b1e-9d24-bc261f4652c2',
      description: "",
      typeId: 1,
      href: false,
      img: false,
      src: false,
      cta: false,
      heading: false,
      copy: true,
    },
    {
      type: 'buttonMod',
      name: 'Button Module',
      file: 'macros/1upcta-macro.html',
      preview: 'https://firebasestorage.googleapis.com/v0/b/ngdataformdemo.appspot.com/o/button_mod_ccc.png?alt=media&token=29fa42d4-e78d-462d-b5cc-cddab6f9ef14',
      description: "",
      typeId: 2,
      href: true,
      img: false,
      src: false,
      cta: true,
      heading: true,
      copy: true,
    },
    {
      type: 'bannerMod',
      name: 'Banner Module',
      file: 'macros/1upbox-macro.html',
       preview: 'https://firebasestorage.googleapis.com/v0/b/ngdataformdemo.appspot.com/o/reg_banner_lo.jpg?alt=media&token=8691f9f0-63c7-4303-90f3-ec43917d137c',
      description: "Promo banner - preset image, size and link url. No editable variables.",
      typeId: 3,
      href: false,
      img: false,
      src: false,
      cta: false,
      heading: false,
      copy: false,
    },
    {
      type: 'footer',
      name: 'Footer Module',
      file: 'macros/footer-macro.html',
      preview: 'https://firebasestorage.googleapis.com/v0/b/ngdataformdemo.appspot.com/o/footer_sample.jpg?alt=media&token=5b06432c-6bfe-4165-9715-b09c7de554ff',
      description: "",
      typeId: 4,
      href: false,
      img: false,
      src: false,
      cta: false,
      heading: false,
      copy: true,
    }
    ];
 



  constructor(
    private modalService: ModalService,
    private router: Router
   ) {}

  ngOnInit(): void {
     // this.getCampaign();
       
  }
  openModal(index: string){

  const id = 'custom-modal-' + index;
  console.log(id);
        this.modalService.open(id);
    }
 
  closeModal(index: string){
    const id = 'custom-modal-' + index;
        this.modalService.close(id);
    }

}
