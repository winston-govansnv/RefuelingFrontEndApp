export interface VwFuelDelivery{
    id: string;
    deliveryDate: string;
    clientName: string;
    truckNumber: string;
    fueltype: string;
    driver: string;
    meterOpen: string;
    meterClose: string;
    startTime: string;
    endTime: string;
    totalCostInAWG: number;
    estimatedCost:number;
    longitude: number;
    latitude: number;
    customer: string;
    isSmallDelivery:number;
    toDeliveryVolume: number;
    fuelPriceUsedOnDate: number;
    delivered: number;
    extraPoints: string;
    totalFueled: number;
    fuelLiters:string;
    fuelDeliveryId: number;
    closedBatch:number;
}