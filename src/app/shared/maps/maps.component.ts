import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { GoogleMap, MapInfoWindow } from '@angular/google-maps';
import { CustomMarkerMap } from '../searchable-maps/searchable-maps.component';
import { MapDetailsRealTimeCourse } from '@models/old/map-details-real-time-course';
import { decode } from '@googlemaps/polyline-codec';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css'],
})
export class MapsComponent implements OnInit, AfterViewInit {
  markers: CustomMarkerMap[] = [];

  polylineOptions: any;

  @Input() mapDetails?: MapDetailsRealTimeCourse;

  @Output() onCancelClicked = new EventEmitter<void>();
  @ViewChild(GoogleMap, { static: false }) map?: GoogleMap;

  zoom = 14;
  passengerLength = 0;
  mapOptions: google.maps.MapOptions = {
    zoomControl: true,
    fullscreenControl: true,
    mapTypeControl: false,
    streetViewControl: false,
  };

  onCancel() {
    this.onCancelClicked.emit();
  }

  ngOnInit(): void {
    this.initCurrentPostion();

    this.polylineOptions = {
      path: decode(this.mapDetails?.polyline ?? '', 5).map(
        (item): google.maps.LatLngLiteral => {
          return { lat: item[0], lng: item[1] };
        },
      ),
      strokeColor: '#FEBB1B',
      strokeOpacity: 1.0,
      strokeWeight: 4,
    };
  }

  infoContent = '';
  @ViewChild(MapInfoWindow, { static: false }) infoWindow!: MapInfoWindow;

  openInfoWindow(marker: CustomMarkerMap, title: string, markerInfo: string) {
    //let positonsMarker = marker.getPosition()?.toString();

    this.infoContent = `<div>
      <H1>qdqdq</H1>
    </div>`;
    //this.infoWindow.open(marker);
  }

  initCurrentPostion() {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const bounds = new google.maps.LatLngBounds();

        this.map?.googleMap?.setCenter({ lat, lng });

        this.markers =
          this.mapDetails?.points.map((item): CustomMarkerMap => {
            let url = '';
            url = !item.isPickup
              ? 'assets/img/logo-passenger-marker.svg'
              : 'assets/img/logo-entreprise-marker.svg';
            if (item.isIntermediate) {
              url = 'assets/img/intermediate-point-marker.svg';
            }
            return {
              position: { lat: item.lat, lng: item.lng },
              markerOption: {
                icon: {
                  url,
                  labelOrigin: new google.maps.Point(16, -16),
                  anchor: new google.maps.Point(16, 32),
                },
                zIndex: 100,
              },
            };
          }) ?? [];

        this.markers.forEach((item) => {
          bounds.extend({ lat: item.position.lat, lng: item.position.lng });
        });

        if (this.markers.length > 0) {
          this.map?.googleMap?.fitBounds(bounds);
        }
      },
    );
  }

  ngAfterViewInit(): void {
    this.map?.googleMap?.setZoom(this.zoom);
    this.map?.googleMap?.setOptions(this.mapOptions);
  }
}
