export interface ICampaign {
    author?: string;
    authorEmail?: string;
    authorId?: number;
    owner?: string;
    ownerId?: string;
    ownerEmail?: string;
    qa?: string;
    qaEmail?: string;
    qaId?: string;
    description?: string;
    title?: string;
    version?: number;
    dataAmends?: string;
    dataApproved?: boolean;
    rolesrecord?: string[];
    approved?: boolean;
    approvalDate?: any;
    rejectionDate?: any;
    preheader?: string;
    preheaderFlag?: boolean;
    header?: string;
    headerFlag?: boolean;
    logo?: string[];
    scss?: any[];
    attributes?: any[];
    tempData?: any;
    modules?: any[];
    
}
     
