export interface VwAppPermission{
    id: string;
    roleName: string;
    actionName: string;
    iconName:string;
    displayName: string;
    canCreate: number;
    canUpdate: number;
    canDelete: number;
    isAdmin:number;
    isReport:number;
    orderNumber:number;
    updatedAt:Date
}