import { Injectable } from '@angular/core';
import { HistoryCourse } from '@models/old/history-course';
import { VehiculeType } from '@models/old/vehicule-type';
import { checkObjectIsSocietyType } from '@core/helpers';
import { GetTimelineDetailsDTO } from '../planification/timeline-details-course-dto';
import { CoursePassengersDetailsDTO } from '../planification/course-passengers-details-dto';
import { CourseMapDetailsDTO } from '../planification/course-map-details-dto';
import { TripHistoryEmployeeDetails } from '@models/old/trip-history-employee-details';

@Injectable({
  providedIn: 'root',
})
export class GetTripHistoryEmployeeDetailsDTO {
  constructor(
    private getTimelineDetailsDto: GetTimelineDetailsDTO,
    private courseMapDetailsDto: CourseMapDetailsDTO,
  ) {}

  fromResponse(dataResponse: any): HistoryCourse[] {
    console.log(dataResponse);

    return dataResponse.map((item: any): TripHistoryEmployeeDetails => {
      return {
        immatTaxi: `${item.immatTaxi ?? ''}`,
        modelTaxi: `${item.modelTaxi ?? ''}`,
        taxiNumber: `${item.taxiNumber ?? ''}`,
        numberOfPassenger: item.passengerNumber ?? '',
        creationDate: new Date(item.startTime * 1000),
        departureTime: `${new Date(item.startTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        arrivalTime: `${new Date(item.endTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        type: item.tripType == 'SHARED' ? 'shared' : 'exclusive',
        price: item.totalPrice ? `${item.totalPrice} TND` : '--',
        polyline: item.polyline,
        vehicleType: item.vehicleType,

        timelineDetails: this.getTimelineDetailsDto.fromResponse(
          item.detailsVisits,
        ),
        mapDetails: this.courseMapDetailsDto.fromResponse(item.detailsVisits),
      };
    });
  }
}
