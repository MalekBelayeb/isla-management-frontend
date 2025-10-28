export interface PlanificationEmployee {

    fullname: string,
    phoneNumber: string
    tripType: 'SHARED' | 'EXCLUSIVE',
    dropoff: string,
    pickup: string,
    time: string,
    stopLocation: string,
}