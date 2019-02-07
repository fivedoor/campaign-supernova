import { ICampaign } from '../_interfaces/campaign.interface';

export class Campaign implements ICampaign {
    constructor (
        public author: string,
        public authorEmail: string,
        public authorId: number,
        public owner: string,
        public ownerId: string,
        public ownerFeedback: string,
        public ownerEmail: string,
        public qa: string,
        public qaEmail: string,
        public qaId: string,
        public description: string,
        public title: string,
        public version: number,
        public rolesrecord: string[],
        public approved: boolean,
        public approvalDate: any,
        public rejectionDate: any,
        public config: any[],
        public scss: any[],
        public attributes: any[],
        public tempData: any,
        public modules: any[],
        ) {}
}

       
  
               