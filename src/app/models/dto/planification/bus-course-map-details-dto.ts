import { CoursePassengersDetails } from '@models/old/passenger-details';
import {
  BusCourseMapDetails,
  BusCourseMarkerEntityMap,
  BusStopCourseMarkerEntityMap,
} from '../../old/bus-course-map-details';
import { Injectable } from '@angular/core';
import { checkObjectIsSocietyType } from '@core/helpers';

@Injectable({
  providedIn: 'root',
})
export class BusCourseMapDetailsDTO {
  fromResponse(
    busStopsResponse: any[],
    entreprise: any,
  ): BusCourseMapDetails | undefined {
    if (!busStopsResponse) return undefined;

    const entrepriseEntityMap: BusCourseMarkerEntityMap = {
      lat: entreprise.societyLat,
      lng: entreprise.societyLng,
      iconUrl: 'assets/img/logo-entreprise-marker.svg',
      name: '',
      adress: entreprise.societyAdress,
      phoneNumber: entreprise.phoneNumber,
      isPickup: false,
    };

    const busStopsEntityMap: BusStopCourseMarkerEntityMap[] =
      busStopsResponse.map(
        (item): BusStopCourseMarkerEntityMap => ({
          lat: item?.lat ?? 0,
          lng: item?.lng ?? 0,
          iconUrl:
            entrepriseEntityMap.lat === item?.lat &&
            entrepriseEntityMap.lng === item?.lng
              ? 'assets/img/logo-entreprise-marker.svg'
              : 'assets/img/logo-station-marker.svg',
          passengers: (item?.passengerDetailsModel ?? [])
            .filter((_item: any) => !checkObjectIsSocietyType(_item))
            .map(
              (passenger: any): BusCourseMarkerEntityMap => ({
                lat: passenger?.destinationLat ?? 0,
                lng: passenger?.destinationLng ?? 0,
                iconUrl: 'assets/img/logo-passenger-marker.svg',
                name: `${passenger?.fullname ?? ''}`,
                adress: checkObjectIsSocietyType(passenger)
                  ? (passenger?.societyAdress ?? '')
                  : (passenger?.destinationAdress ?? ''),
                phoneNumber: passenger?.phoneNumber ?? '',
                isPickup: passenger?.isPickup ?? false,
                id: passenger?.userId ?? '',
              }),
            ),
        }),
      );

    console.log(busStopsEntityMap, entrepriseEntityMap);

    return {
      entreprise: entrepriseEntityMap,
      isBack: false,
      busStops: busStopsEntityMap,
      passengers: [],
    };
  }
}
