import { BusCourseMapDetails } from "./bus-course-map-details"
import { CourseMapDetails } from "./course-map-details"
import { CourseTimelineDetails } from "./course-timeline-details"
import { CoursePassengersDetails } from "./passenger-details"

export interface CurrentDayCourse {
    id: string,
    numberOfPassenger: string,
    taxiNumber: string,
    modelTaxi: string,
    immatTaxi: string,
    arrivalTime: string,
    departureTime: string,
    creationDate: Date,
    distanceMeters: number,
    vehicleType: 'BUS' | 'TAXI',
    type: 'shared' | 'exclusive',
    status: string,
    totalPrice: string,
    polyline: string,
    busStops?: BusCourseMapDetails
    timelineDetails?: CourseTimelineDetails[],
    mapDetails?: CourseMapDetails[],
    passengers?: CoursePassengersDetails[]

}