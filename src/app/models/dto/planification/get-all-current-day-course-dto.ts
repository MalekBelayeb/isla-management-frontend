import { Injectable } from '@angular/core';
import { CurrentDayCourse } from '@models/old/current-day-course';
import { BusCourseMapDetailsDTO } from './bus-course-map-details-dto';
import { GetTimelineDetailsDTO } from './timeline-details-course-dto';
import { CoursePassengersDetailsDTO } from './course-passengers-details-dto';
import { CourseMapDetailsDTO } from './course-map-details-dto';
import { VehiculeType } from '@models/old/vehicule-type';
import { checkObjectIsSocietyType } from '@core/helpers';

@Injectable({
  providedIn: 'root',
})
export class GetAllCurrentDayCoursesDTO {
  constructor(
    private busCourseMapDetailsDTO: BusCourseMapDetailsDTO,
    private getTimelineDetailsDto: GetTimelineDetailsDTO,
    private coursePassengersDetailsDto: CoursePassengersDetailsDTO,
    private courseMapDetailsDto: CourseMapDetailsDTO,
  ) {}

  getTaxiCourse(item: any): CurrentDayCourse {
    return {
      id: item.idRoom ?? item.idTripSociety ?? '',
      immatTaxi: `${item.immatTaxi ?? ''}`,
      modelTaxi: `${item.modelTaxi ?? ''}`,
      taxiNumber: `${item.taxiNumber ?? ''}`,

      numberOfPassenger: item.byPassenger ?? '',
      creationDate: new Date(item.startTime * 1000),
      departureTime: `${new Date(item.startTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      arrivalTime: `${new Date(item.endTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      type: item.tripType == 'SHARED' ? 'shared' : 'exclusive',
      totalPrice: item.totalPrice ? `${item.totalPrice} TND` : '--',
      polyline: item.polyline,
      vehicleType: item.vehicleType,
      status: item?.status ?? '',
      distanceMeters: 0,
      passengers: this.coursePassengersDetailsDto.fromResponse(
        item.passengerDetails,
      ),
      timelineDetails: this.getTimelineDetailsDto.fromResponse(
        item.detailsVisits,
      ),
      mapDetails: this.courseMapDetailsDto.fromResponse(item.detailsVisits),
    };
  }

  getBusCourse(item: any): CurrentDayCourse {
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
    const busCourseDetails = this.busCourseMapDetailsDTO.fromResponse(
      item.stopsBusModel,
      entreprise,
    );

    return {
      id: item.idRoom ?? item.idTripSociety ?? '',
      immatTaxi: `${item.immatTaxi ?? ''}`,
      modelTaxi: `${item.modelTaxi ?? ''}`,
      taxiNumber: `${item.taxiNumber ?? ''}`,
      numberOfPassenger: item.passengerNumber,
      creationDate: new Date(item.startTime * 1000),
      departureTime: `${new Date(item.startTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      arrivalTime: `${new Date(item.endTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      type: item.tripType == 'SHARED' ? 'shared' : 'exclusive',
      totalPrice: item.totalPrice ? `${item.totalPrice} TND` : '--',
      polyline: item.polyline,
      vehicleType: item.vehicleType,
      status: item?.status ?? '',
      distanceMeters: 0,
      busStops: busCourseDetails,
      passengers: this.coursePassengersDetailsDto.fromResponse(
        uniquePassengersDetails,
      ),
      timelineDetails:
        this.getTimelineDetailsDto.fromResponse(passengersDetails),
      mapDetails: this.courseMapDetailsDto.fromResponse(passengersDetails),
    };
  }

  fromResponse(dataResponse: any): CurrentDayCourse[] {
    return dataResponse.map((item: any): CurrentDayCourse => {
      const vehicleType: VehiculeType =
        item.vehicleType == 'TAXI' ? 'TAXI' : 'BUS';

      return vehicleType === 'TAXI'
        ? this.getTaxiCourse(item)
        : this.getBusCourse(item);
    });
  }
}
