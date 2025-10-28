import { BusCourseMapDetails } from './bus-course-map-details';
import { CourseMapDetails } from './course-map-details';

export interface MapDetailsRealTimeCourse {
  polyline: string;
  points: CourseMapDetails[];
  eta: string;
  passengerNumber: string;
  busStops?: BusCourseMapDetails;
  type: 'BUS' | 'TAXI';
}
