import { BusCourseMapDetails } from "./bus-course-map-details"
import { CourseMapDetails } from "./course-map-details"
import { CourseTimelineDetails } from "./course-timeline-details"
import { CoursePassengersDetails } from "./passenger-details"

export interface HistoryCourse {

    numberOfPassenger: number
    modelTaxi: string
    immatTaxi: string
    taxiNumber: string
    arrivalTime: string
    departureTime: string
    vehicleType: 'TAXI' | 'BUS'
    type: 'shared' | 'exclusive'
    creationDate: Date
    price: string,
    polyline: string,
    timelineDetails?: CourseTimelineDetails[]
    mapDetails?: CourseMapDetails[]
    passengers?: CoursePassengersDetails[]
    busStops?: BusCourseMapDetails
}