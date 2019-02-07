import { IConfig } from '../_interfaces/config.interface';

export class Config implements IConfig {
    public header: string;
    public headerFlag: boolean;
    public preheader: string;
    public preheaderFlag: boolean;
    public dataAmends: string;
    public dataApproved: boolean;
    public logo: string[];
    public approved: boolean;
}