export class VwFuelTruckSchedule
{
    id: number;  
    fuelTruckId: number;
    deliveryDate: Date;
    badgeNumber: string;
    driver: string;
    truckNumber: string;
    totalizerId: string;
    estimatedDeliveryStartTime: Date;
    estimatedDeliveryEndTime: Date;
    isSmallDelivery: number;
    fuelTypeName: string;
    toDeliveryVolume: number;
    clientName: string;
}