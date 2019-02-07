import { IModel } from '../_interfaces/model.interface';

export class Model implements IModel {
    public name: string;
    public number: number;
    public numberFlag: boolean;
    public type: string;
    public typeId: number;
    public typeFlag: boolean;
    public href: string;
    public href_1: string;
    public href_2: string;
    public hrefFlag: boolean;
    public img: string;
    public img_1: string;
    public img_2: string;
    public imgFlag: boolean;
    public key: string;
    public src: string;
    public src_1: string;
    public src_2: string;
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