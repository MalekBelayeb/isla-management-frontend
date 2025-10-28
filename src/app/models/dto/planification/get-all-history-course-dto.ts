import { Injectable } from '@angular/core';
import { HistoryCourse } from '@models/old/history-course';
import { BusCourseMapDetailsDTO } from './bus-course-map-details-dto';
import { GetTimelineDetailsDTO } from './timeline-details-course-dto';

import { CoursePassengersDetailsDTO } from './course-passengers-details-dto';
import { CourseMapDetailsDTO } from './course-map-details-dto';
import { VehiculeType } from '@models/old/vehicule-type';
import { checkObjectIsSocietyType } from '@core/helpers';

@Injectable({
  providedIn: 'root',
})
export class GetAllHistoryCourseDTO {
  constructor(
    private busCourseMapDetailsDto: BusCourseMapDetailsDTO,
    private getTimelineDetailsDto: GetTimelineDetailsDTO,
    private coursePassengersDetailsDto: CoursePassengersDetailsDTO,
    private courseMapDetailsDto: CourseMapDetailsDTO,
  ) {}

  getTaxiCourse(item: any): HistoryCourse {
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
      passengers: this.coursePassengersDetailsDto.fromResponse(
        item.passengerDetails,
      ),
      timelineDetails: this.getTimelineDetailsDto.fromResponse(
        item.detailsVisits,
      ),
      mapDetails: this.courseMapDetailsDto.fromResponse(item.detailsVisits),
    };
  }

  getBusCourse(item: any): HistoryCourse {
    const passengersDetails = item.stopsBusModel
      .map((stopBusModel: any) => stopBusModel.passengerDetailsModel)
      .flat();

    const entreprise = passengersDetails?.find((_item: any) =>
      checkObjectIsSocietyType(_item),
    );
    const uniquePassengersDetails = Array.from(
      new Set(passengersDetails.map((_item: any) => _item.userId)),
    ).map((userId) => {
      return passengersDetails.find((_item: any) => _item.userId === userId);
    });
    const busCourseDetails = this.busCourseMapDetailsDto.fromResponse(
      item.stopsBusModel,
      entreprise,
    );

    return {
      immatTaxi: `${item.immatTaxi ?? ''}`,
      modelTaxi: `${item.modelTaxi ?? ''}`,
      taxiNumber: `${item.taxiNumber ?? ''}`,
      numberOfPassenger: item.passengerNumber,
      creationDate: new Date(item.startTime * 1000),
      departureTime: `${new Date(item.startTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      arrivalTime: `${new Date(item.endTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      type: item.tripType == 'SHARED' ? 'shared' : 'exclusive',
      price: item.totalPrice ? `${item.totalPrice} TND` : '--',
      polyline: item.polyline,
      vehicleType: item.vehicleType,
      busStops: busCourseDetails,
      passengers: this.coursePassengersDetailsDto.fromResponse(
        uniquePassengersDetails,
      ),
      timelineDetails:
        this.getTimelineDetailsDto.fromResponse(passengersDetails),
      mapDetails: this.courseMapDetailsDto.fromResponse(passengersDetails),
    };
  }

  fromResponse(dataResponse: any): HistoryCourse[] {
    console.log(dataResponse);

    return dataResponse.map((item: any): HistoryCourse => {
      const vehicleType: VehiculeType =
        item.vehicleType == 'TAXI' ? 'TAXI' : 'BUS';

      return vehicleType === 'TAXI'
        ? this.getTaxiCourse(item)
        : this.getBusCourse(item);
    });
  }
}
