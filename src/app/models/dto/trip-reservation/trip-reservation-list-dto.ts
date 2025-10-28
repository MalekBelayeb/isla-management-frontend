import { Injectable } from '@angular/core';
import { TripReservation } from '@models/old/trip-reservation';
import { GetTimelineDetailsDTO } from '../planification/timeline-details-course-dto';

@Injectable({
  providedIn: 'root',
})
export class TripReservationListDTO {

  constructor(
    private getTimelineDetailsDto: GetTimelineDetailsDTO,
  ) {}
  getPickupAdress(detailsVisits: any[]) {
    if (detailsVisits.length == 0) return '';

    const pickups = detailsVisits.filter((item) => {
      return item.isPickup == true;
    });
    return pickups.length > 0 ? pickups[0].destinationAdress : '';
  }

  getDropoffAdress(detailsVisits: any[]) {
    if (detailsVisits.length == 0) return '';

    const dropoffs = detailsVisits.filter((item) => {
      return item.isPickup == false;
    });
    return dropoffs.length > 0 ? dropoffs[0].destinationAdress : '';
  }
  fromResponse(response: any[]): TripReservation[] {
    const results: TripReservation[] = response.map(
      (item): TripReservation => ({
        id: item.idRoom ?? item.idTripSociety ?? '',
        vehicleNumber: `${item.immatTaxi ?? ''} ${item.modelTaxi ?? ''}`,
        passengerFullname:
          item.passengerDetails?.length > 0
            ? item.passengerDetails[0].fullname
            : '',
        startTime: `${new Date(item.startTime * 1000).toLocaleTimeString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}`,
        endTime: `${new Date(item.endTime * 1000).toLocaleTimeString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}`,
        pickupAddress: this.getPickupAdress(item.detailsVisits),
        dropoffAddress: this.getDropoffAdress(item.detailsVisits),
        tripType: item.planningType ?? 'STANDARD',
        totalPrice: item.totalPrice ? `${item.totalPrice} TND` : '--',
        status: item?.status ?? '',
        timelineDetails: this.getTimelineDetailsDto.fromResponse(item.detailsVisits),
      }),
    );
    return results;
  }
}
