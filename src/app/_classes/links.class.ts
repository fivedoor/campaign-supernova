import { ILinks } from '../_interfaces/links.interface';

export class Links implements ILinks {
     public linkName: string;
     public text: string;
     public href: string;
     public hrefFlag: boolean;
     public link: string;
     public linkFlag: string;
}