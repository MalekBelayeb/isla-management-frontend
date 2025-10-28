import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { CustomMarkerMap } from '../searchable-maps/searchable-maps.component';
import { MapDetailsRealTimeCourse } from '@models/old/map-details-real-time-course';
import { decode, encode } from "@googlemaps/polyline-codec";
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { MarkerWithLabel } from '@googlemaps/markerwithlabel';
import { BusCourseMarkerEntityMap } from '@models/old/bus-course-map-details';

@Component({
  selector: 'app-bus-maps',
  templateUrl: './bus-maps.component.html',
  styleUrls: ['./bus-maps.component.css']
})
export class BusMapsComponent implements OnInit, AfterViewInit {

  busStopsMarkers: MarkerWithLabel[] = []
  passengerMarkers: google.maps.Marker[] = []

  polylineOptions: any;

  @Input() mapDetails?: MapDetailsRealTimeCourse
  @Output() onCancelClicked = new EventEmitter<void>()
  @ViewChild(GoogleMap, { static: false }) map?: GoogleMap

  zoom = 14;
  passengerLength = 0
  mapOptions: google.maps.MapOptions = {

    zoomControl: true,
    fullscreenControl: true,
    mapTypeControl: false,
    streetViewControl: false,

  }

  onCancel() {
    this.onCancelClicked.emit()
  }

  ngOnInit(): void {


    this.initCurrentPostion()
    this.polylineOptions = {
      path: decode(this.mapDetails?.polyline ?? "", 5).map((item): google.maps.LatLngLiteral => { return { lat: item[0], lng: item[1] } }),
      strokeColor: '#FEBB1B',
      strokeOpacity: 1.0,
      strokeWeight: 4,
    }
  }



  initCurrentPostion() {

    navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {

      const lat = position.coords.latitude
      const lng = position.coords.longitude
      const bounds = new google.maps.LatLngBounds();

      this.map?.googleMap?.setCenter({ lat, lng })

      const entrepriseMarker = new MarkerWithLabel({
        map: this.map?.googleMap,
        position: new google.maps.LatLng(this.mapDetails?.busStops?.entreprise?.lat ?? 0, this.mapDetails?.busStops?.entreprise?.lng ?? 0),
        icon: {
          url: '',
        },
        labelContent: `<div style='position:absolute'>
          <img src='${this.mapDetails?.busStops?.entreprise?.iconUrl ?? ''}'>
        </div>`,
        labelAnchor: new google.maps.Point(-17, -48),
      })

      this.busStopsMarkers = (this.mapDetails?.busStops?.busStops ?? []).map((item, index): MarkerWithLabel => {
        const marker = new MarkerWithLabel({
          map: this.map?.googleMap,
          position: new google.maps.LatLng(item.lat, item.lng),
          icon: {
            url: '',
          },
          labelContent: `<div style='position:absolute'>
          <img src='${item.iconUrl ?? ''}'>
          <span style='width: 18px;
          position:absolute;
          top: -5px;
          right: 0px;
          display: flex;
          justify-content: center;
          align-items: center;
                    height: 18px;border-radius: 50%; background-color:#f5365c;text-align: center;font-size: 10px;color:white;
                    margin-left: 1px;
                    margin-right: 1px; '> ${item.passengers.length} </span>
      </div>`,
          labelAnchor: new google.maps.Point(-17, -48),
        })

        marker.addListener("click", (markerLabel: any) => {
          const infoWindow = new google.maps.InfoWindow();
          const passengers = (this.mapDetails?.busStops?.busStops ?? [])[index].passengers.map((passenger: BusCourseMarkerEntityMap): google.maps.Marker => {
            const passengerMarker = new google.maps.Marker({
              map: this.map!.googleMap!,
              icon: {
                url: passenger.iconUrl ?? ''
              },
              position: new google.maps.LatLng(passenger.lat, passenger.lng)
            })

            passengerMarker.addListener("click", () => {
              infoWindow.close();
              infoWindow.setContent(`
              
              <html>
              <style>

              .gm-ui-hover-effect > span {
                width:18px !important;
                height:18px !important;
                margin-left:25px !important
              }
              </style>
              
              <span> <strong> ${passenger.name}  </strong> </span> <br> <span> ${passenger.phoneNumber} </span> <br> <span> ${passenger.adress} </span></html>`);
              infoWindow.open(passengerMarker.getMap(), passengerMarker);
            });

            return passengerMarker
          })

          this.showPassengerMarkers(passengers)

        });
        return marker
      }) ?? []

      this.busStopsMarkers.push(entrepriseMarker)

      this.busStopsMarkers.forEach((item) => {
        if (!item.getPosition()) return
        bounds.extend(item.getPosition()!)
      })

      if (this.busStopsMarkers.length > 0) {
        this.map?.googleMap?.fitBounds(bounds)
      }

    })
  }

  ngAfterViewInit(): void {
    this.map?.googleMap?.setZoom(this.zoom)
    this.map?.googleMap?.setOptions(this.mapOptions)
  }
  
  showPassengerMarkers(passengers: google.maps.Marker[]) {
    this.hidePassengerMarkers()
    if (!this.map) return
    for (let i = 0; i < passengers.length; i++) {
      passengers[i].setMap(this.map.googleMap!)
      this.passengerMarkers.push(passengers[i])
    }
  }

  hidePassengerMarkers() {
    for (let i = 0; i < this.passengerMarkers.length; i++) {
      this.passengerMarkers[i].setMap(null)
    }
  }

}
