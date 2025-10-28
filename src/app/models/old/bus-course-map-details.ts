import { CoursePassengersDetails } from "./passenger-details"

export interface BusStopCourseMarkerEntityMap {

    lat: number
    lng: number
    iconUrl?: string
    passengers: BusCourseMarkerEntityMap[]
}

export interface BusCourseMarkerEntityMap {
    id?: string,
    lat: number
    lng: number
    iconUrl?: string
    name: string
    adress: string
    phoneNumber: string
    isPickup: boolean,
}

export interface BusCourseMapDetails {

    entreprise?: BusCourseMarkerEntityMap
    isBack: boolean,
    busStops: BusStopCourseMarkerEntityMap[]
    passengers: CoursePassengersDetails[]

}