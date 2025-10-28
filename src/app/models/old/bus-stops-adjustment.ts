
export interface BusStopMarker {
    id?: string
    position: google.maps.LatLngLiteral
    icon: string
}

export interface RealBusStop {
    name: string,
    address: string
    marker: BusStopMarker
}

export interface VirtualBusStop {

    name: string,
    address: string
    marker: BusStopMarker

}

export interface PassengerMapAdjustment {
    marker: BusStopMarker
}

export interface EntrepriseBusStopAdjustement {

    labelTarget: string,
    lat: number,
    lng: number,
}

export interface BusStopAdjustment {
    society: EntrepriseBusStopAdjustement,
    virtualStops: VirtualBusStop[],
    realStops: RealBusStop[],
    passengers: PassengerMapAdjustment[]
}