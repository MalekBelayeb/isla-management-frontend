import { Injectable } from '@angular/core';
import { BusCourseMapDetailsDTO } from './bus-course-map-details-dto';
import { GetTimelineDetailsDTO } from './timeline-details-course-dto';
import { SimulationCourse } from '@models/old/simulation-course';
import { CourseMapDetailsDTO } from './course-map-details-dto';
import { CoursePassengersDetailsDTO } from './course-passengers-details-dto';
import moment from 'moment';
import { checkObjectIsSocietyType } from '@core/helpers';
import { VehiculeType } from '@models/old/vehicule-type';

@Injectable({
  providedIn: 'root',
})
export class GetAllSimulationCourseDTO {
  constructor(
    private busCourseMapDetailsDTO: BusCourseMapDetailsDTO,
    private getTimelineDetailsDTO: GetTimelineDetailsDTO,
    private coursePassengersDetailsDto: CoursePassengersDetailsDTO,
    private courseMapDetailsDto: CourseMapDetailsDTO,
    private getTimelineDetailsDto: GetTimelineDetailsDTO,
  ) {}

  getTaxiCourse(item: any): SimulationCourse {
    return {
      immatTaxi: `${item.immatTaxi ?? ''}`,
      modelTaxi: `${item.modelTaxi ?? ''}`,
      taxiNumber: `${item.taxiNumber ?? ''}`,
      numberOfPassenger: item.passengerNumber ?? '',
      creationDate: new Date(item.startTime * 1000),
      departureTime: `${new Date(item.startTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      arrivalTime: `${new Date(item.endTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      travelDuration:
        `${moment.duration(Number(item.endTime - item.startTime), 'seconds').hours()}`
          .padStart(2, '0')
          .concat(' h') +
        ' ' +
        `${moment.duration(Number(item.endTime - item.startTime), 'seconds').minutes()}`
          .padStart(2, '0')
          .concat(' Min'),
      type: item.tripType == 'SHARED' ? 'shared' : 'exclusive',
      price: item.totalPrice ? `${item.totalPrice} ` : '--',
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

  getBusCourse(item: any): SimulationCourse {
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
      immatTaxi: `${item.immatTaxi ?? ''}`,
      modelTaxi: `${item.modelTaxi ?? ''}`,
      taxiNumber: `${item.taxiNumber ?? ''}`,
      numberOfPassenger: item.passengerNumber,
      creationDate: new Date(item.startTime * 1000),
      departureTime: `${new Date(item.startTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      arrivalTime: `${new Date(item.endTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      travelDuration:
        `${moment.duration(Number(item.endTime - item.startTime), 'seconds').hours()}`
          .padStart(2, '0')
          .concat(' h') +
        ' ' +
        `${moment.duration(Number(item.endTime - item.startTime), 'seconds').minutes()}`
          .padStart(2, '0')
          .concat(' Min'),
      type: item.tripType == 'SHARED' ? 'shared' : 'exclusive',
      price: item.totalPrice ? `${item.totalPrice}` : '--',
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

  fromResponse(dataResponse: any): SimulationCourse[] {
    return dataResponse.map((item: any): SimulationCourse => {
      const vehicleType: VehiculeType =
        item.vehicleType == 'TAXI' ? 'TAXI' : 'BUS';

      return vehicleType === 'TAXI'
        ? this.getTaxiCourse(item)
        : this.getBusCourse(item);
    });
  }
}
