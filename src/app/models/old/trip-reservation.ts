import { CourseTimelineDetails } from './course-timeline-details';

export interface TripReservation {
  id: string;
  vehicleNumber: string;
  passengerFullname: string;
  startTime: string;
  endTime: string;
  pickupAddress: string;
  dropoffAddress: string;
  totalPrice: string;
  tripType: 'PREMIUM' | 'STANDARD';
  status: string;
  timelineDetails?: CourseTimelineDetails[];
}
