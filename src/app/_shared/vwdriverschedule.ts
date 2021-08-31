export interface VwDriverSchedule{
    id: string;
    deliveryDate: string;
    truckNumber: string;  
    badgeNumber: string;  
    driver: string;
    driverId: string;
    clientName: string;
    fuelType: string;
    toDeliveryVolume: number;
    estimatedDeliveryStartTime: string;
    estimatedDeliveryEndTime: string;
}