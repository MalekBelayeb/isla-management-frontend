import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { GoogleMap, MapGeocoder } from '@angular/google-maps';
import { SearchResult } from '../search-input/search-input.component';
import { EmployeeService } from 'src/app/features/dashboard/old/employee/service/employee.service';

export interface CustomMarkerMap {
  position: google.maps.LatLngLiteral;
  type?: 'taxi' | 'passenger';
  markerOption?: any;
}

export interface SearchableMapsResult {
  location: string;
  coordinate: google.maps.LatLngLiteral;
}

@Component({
  selector: 'app-searchable-address-point',
  templateUrl: './searchable-address-point.component.html',
  styleUrls: ['./searchable-address-point.component.css'],
})
export class SearchableAddressPointComponent
  implements AfterViewInit, OnChanges
{
  @Output() selectedLocationOutput = new EventEmitter<SearchableMapsResult>();
  @Output() lastUpdatedLocationOutput =
    new EventEmitter<SearchableMapsResult>();
  @Output() cancelClicked = new EventEmitter<void>();

  @Input() initialMapPosition?: google.maps.LatLngLiteral;

  @Input() initialValue = '';
  @Input() editable = true;

  @Input() showConfirmButton = true;

  selectedCoordinate?: google.maps.LatLngLiteral;
  selectedAdress?: string;
  selectedLocation?: string;
  @Input() title = "Chercher votre point d'arrêt";
  placesAutocompleResult: SearchResult[] = [];

  @ViewChild(GoogleMap, { static: false }) map?: GoogleMap;

  zoom = 14;

  markers: CustomMarkerMap[] = [];
  constructor(
    private geocoder: MapGeocoder,
    private employeeService: EmployeeService,
  ) {}

  mapOptions: google.maps.MapOptions = {
    zoomControl: true,
    fullscreenControl: true,
    mapTypeControl: false,
    streetViewControl: false,
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editable']) {
      this.editable = changes['editable'].currentValue;
    }

    if (
      changes['initialMapPosition'] &&
      !changes['initialMapPosition'].firstChange
    ) {
      this.initialMapPosition = changes['initialMapPosition'].currentValue;
      if (!this.initialMapPosition) return;
      this.map?.googleMap?.setCenter({
        lat: this.initialMapPosition.lat,
        lng: this.initialMapPosition.lng,
      });
      this.updateMarkerTo(this.initialMapPosition);
    }
  }

  onSearchValueChanged(event: string) {
    if (!event || event == '') return;
    this.employeeService.searchStops(event).subscribe({
      next: (value) => {
        this.placesAutocompleResult = value.body.data.map((item: any): any => {
          return { title: item.name, id: item.id, data: item };
        });
      },
    });
  }

  onCancel() {
    this.cancelClicked.emit();
  }

  onConfirm() {
    if (!this.selectedCoordinate || !this.selectedAdress) return;

    this.selectedLocationOutput.emit({
      coordinate: this.selectedCoordinate,
      location: this.selectedLocation ?? '',
    });
    this.lastUpdatedLocationOutput.emit({
      coordinate: this.selectedCoordinate,
      location: this.selectedAdress,
    });
  }

  onSelectedSearchItem(event: any) {
    if (!this.editable) return;
    if (!event.data) return;
    const location = event.data.location;
    this.selectedLocation = location;
    this.updateMarkerTo({ lat: location.lat, lng: location.lng });
    this.map?.googleMap?.setCenter(location);
  }

  updateMarkerTo(location: google.maps.LatLngLiteral) {
    this.markers = [];
    this.markers.push({ position: location });
    this.selectedCoordinate = location;
    this.reverseGeocodeLocation(location);
  }

  onInputClicked(event: any) {
    this.employeeService.searchStops('').subscribe({
      next: (value) => {
        this.placesAutocompleResult = value.body.data.map((item: any): any => {
          return { title: item.name, id: item.id, data: item };
        });
      },
    });
  }
  reverseGeocodeLocation(location: google.maps.LatLngLiteral) {
    this.geocoder.geocode({ location }).subscribe({
      next: (value) => {
        if (value.results.length > 0) {
          this.selectedAdress = value.results[0].formatted_address;
        }
        this.lastUpdatedLocationOutput.emit({
          coordinate: location,
          location: this.selectedAdress ?? '',
        });
      },
    });
  }

  ngAfterViewInit(): void {
    this.map?.googleMap?.setZoom(this.zoom);
    this.map?.googleMap?.setOptions(this.mapOptions);
    //this.map?.mapClick.subscribe({ next: this.clickMap })

    if (this.initialMapPosition) {
      this.map?.googleMap?.setCenter({
        lat: this.initialMapPosition.lat,
        lng: this.initialMapPosition.lng,
      });
      this.updateMarkerTo(this.initialMapPosition);
    } else {
      this.initMyCurrentPostion();
    }
  }

  initMyCurrentPostion() {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        this.map?.googleMap?.setCenter({ lat, lng });

        this.markers.push({
          position: { lat, lng },
        });
        this.selectedCoordinate = { lat, lng };
        this.reverseGeocodeLocation({ lat, lng });
      },
    );
  }
}
