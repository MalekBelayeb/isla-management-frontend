export interface RealTimeCourseStatistic {
    
    sharedDataTripPrice:number,
    sharedDataTripCount:number,
    sharedPassengerCount:number,
    
    exclusiveDataTripPrice:number,
    exclusiveDataTripCount:number,
    exclusivePassengerCount:number,
    
    totalDataTripPrice:number,
    totalDataTripCount:number,
    totalPassengerCount:number,

    totalDistances?:number,
    totalDurations?:number,
    
}