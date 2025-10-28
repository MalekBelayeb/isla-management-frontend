import {
  BusStopAdjustment,
  EntrepriseBusStopAdjustement,
  PassengerMapAdjustment,
  RealBusStop,
  VirtualBusStop,
} from '@models/old/bus-stops-adjustment';

interface RealBusStopsLocation {
  lat: number;
  lng: number;
  labelTarget: string;
}
interface RealBusStopsAdjustmentBodyRequest {
  name: string;
  location: RealBusStopsLocation;
}
export interface BusStopAdjustmentBodyRequest {
  hour: number;
  minMinute: number;
  maxMinute: number;
  selectedDay: string;
  stops: RealBusStopsAdjustmentBodyRequest[];
}

export interface ShiftBusStopsAdjustmentBodyRequest {
  selectedDay: string;
  hour: number;
  minMinute: number;
  maxMinute: number;
}
export class BusStopAdjustmentDTO {
  realStopBusMarkerIcon = 'assets/img/logo-station-marker.svg';
  selectedRealStopBusMarkerIcon = 'assets/img/logo-active-station-marker.svg';
  passengerMarkerIcon = 'assets/img/logo-passenger-marker.svg';
  entrepriseMarkerIcon = 'assets/img/logo-entreprise-marker.svg';
  virtualStopBusMarkerIcon = 'assets/img/logo-virtual-station-marker.svg';

  toBodyRequest(
    shiftBusStops: ShiftBusStopsAdjustmentBodyRequest,
    busStopsAdjustment: BusStopAdjustment,
  ): BusStopAdjustmentBodyRequest {
    const realBusStopsAdjustmentBodyRequest: RealBusStopsAdjustmentBodyRequest[] =
      busStopsAdjustment.realStops.length == 0
        ? busStopsAdjustment.virtualStops.map(
            (item): RealBusStopsAdjustmentBodyRequest => ({
              location: {
                lat: item.marker.position.lat,
                lng: item.marker.position.lng,
                labelTarget: item.address,
              },
              name: item.name,
            }),
          )
        : busStopsAdjustment.realStops.map(
            (item: any): RealBusStopsAdjustmentBodyRequest => ({
              location: {
                lat: item.marker.position.lat,
                lng: item.marker.position.lng,
                labelTarget: item.address,
              },
              name: item.name,
            }),
          );
    return {
      selectedDay: shiftBusStops.selectedDay,
      hour: shiftBusStops.hour,
      maxMinute: shiftBusStops.maxMinute,
      minMinute: shiftBusStops.minMinute,
      stops: realBusStopsAdjustmentBodyRequest,
    };
  }

  fromResponse(data: any): BusStopAdjustment {
    const entreprise: EntrepriseBusStopAdjustement = {
      labelTarget: data.societyLocation.labelTarget,
      lat: data.societyLocation.lat,
      lng: data.societyLocation.lng,
    };

    const passengers: PassengerMapAdjustment[] = data.usersPlans.map(
      (item: any): PassengerMapAdjustment => {
        return {
          marker: {
            position: { lat: item.pickupLat, lng: item.pickupLng },
            icon: this.passengerMarkerIcon,
          },
        };
      },
    );

    const virtualStops = data.virtualStops.map(
      (item: any): VirtualBusStop => ({
        name: item.name,
        address: item.location.labelTarget,
        marker: {
          icon: this.virtualStopBusMarkerIcon,
          position: { lat: item.location.lat, lng: item.location.lng },
        },
      }),
    );
    const realStops: RealBusStop[] = data.stopsUsersPlans.map(
      (item: any): RealBusStop => ({
        name: item.name,
        address: item.location.labelTarget,
        marker: {
          icon: this.realStopBusMarkerIcon,
          position: { lat: item.location.lat, lng: item.location.lng },
        },
      }),
    );

    return {
      society: entreprise,
      passengers,
      virtualStops,
      realStops,
    };
  }
}
