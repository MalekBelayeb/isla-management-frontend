import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { GoogleMap, MapGeocoder } from '@angular/google-maps';
import { SearchResult } from '../search-input/search-input.component';
import { PlaceAutocompleteService } from '../service/place-autocomplete.service';


export interface CustomMarkerMap {
  position: google.maps.LatLngLiteral,
  type?: 'taxi' | 'passenger',
  markerOption?: any
}

export interface SearchableMapsResult {
  location: string
  coordinate: google.maps.LatLngLiteral
}

@Component({
  selector: 'app-searchable-maps',
  templateUrl: './searchable-maps.component.html',
  styleUrls: ['./searchable-maps.component.css']
})
export class SearchableMapsComponent implements AfterViewInit, OnChanges {

  @Output() selectedLocationOutput = new EventEmitter<SearchableMapsResult>()
  @Output() lastUpdatedLocationOutput = new EventEmitter<SearchableMapsResult>()
  @Output() onCancelClicked = new EventEmitter<void>()

  @Input() initialMapPosition?: google.maps.LatLngLiteral

  @Input() initialValue = ""
  @Input() editable = true

  @Input() showConfirmButton = true

  selectedCoordinate?: google.maps.LatLngLiteral
  selectedAdress?: string
  @Input() title = "Chercher votre adresse"
  placesAutocompleResult: SearchResult[] = []

  @ViewChild(GoogleMap, { static: false }) map?: GoogleMap

  zoom = 14;

  markers: CustomMarkerMap[] = []
  constructor(private geocoder: MapGeocoder, private placeAutocompleteService: PlaceAutocompleteService, private cdref: ChangeDetectorRef) { }

  mapOptions: google.maps.MapOptions = {

    zoomControl: true,
    fullscreenControl: true,
    mapTypeControl: false,
    streetViewControl: false,

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes["editable"]) {
      this.editable = changes["editable"].currentValue
      console.log(changes["editable"].currentValue)
    }

    if (changes["initialMapPosition"] && !changes["initialMapPosition"].firstChange) {

      this.initialMapPosition = changes["initialMapPosition"].currentValue

      if (this.initialMapPosition && this.initialMapPosition.lat && this.initialMapPosition.lng) {
        this.map?.googleMap?.setCenter({ lat: this.initialMapPosition.lat, lng: this.initialMapPosition.lng })
        this.updateMarkerTo(this.initialMapPosition)
      }

    }

  }

  clickMap = (event: google.maps.MapMouseEvent) => {

    if (!event.latLng || !this.editable) return
    this.updateMarkerTo(event.latLng.toJSON())

  }

  onSearchValueChanged(event: string) {
    if(!event || event === "") return
    this.placeAutocompleteService.getPlacesAutocomplete(event).subscribe({
      next: (value) => {
        this.placesAutocompleResult = value.body.data.map((item: any): SearchResult => {
          return { title: item.description, id: item.placeId }
        })

      },
    })
  }

  onCancel() {
    this.onCancelClicked.emit()
  }

  onConfirm() {

    if (!this.selectedCoordinate || !this.selectedAdress) return

    this.selectedLocationOutput.emit({ coordinate: this.selectedCoordinate, location: this.selectedAdress })
    this.lastUpdatedLocationOutput.emit({ coordinate: this.selectedCoordinate, location: this.selectedAdress })

  }

  onSelectedSearchItem(event: SearchResult) {
    if (!this.editable) return
    if(!event.id) return
    this.placeAutocompleteService.getPlacesDetails(event.id).subscribe({
      next: (value) => {

        const { lat, lng } = value.body.data
        this.updateMarkerTo({ lat, lng })
        this.map?.googleMap?.setCenter({ lat, lng })

      },
    })

  }

  updateMarkerTo(location: google.maps.LatLngLiteral) {

    this.markers = []
    this.markers.push({ position: location })
    this.selectedCoordinate = location
    this.reverseGeocodeLocation(location)

  }

  reverseGeocodeLocation(location: google.maps.LatLngLiteral) {
    this.geocoder.geocode({ location }).subscribe({
      next: (value) => {

        if (value.results.length > 0) {
          this.selectedAdress = value.results[0].formatted_address
        }
        this.lastUpdatedLocationOutput.emit({ coordinate: location, location: this.selectedAdress ?? "" })

      },
    })
  }

  ngAfterViewInit(): void {

    this.map?.googleMap?.setZoom(this.zoom)
    this.map?.googleMap?.setOptions(this.mapOptions)
    this.map?.mapClick.subscribe({ next: this.clickMap })

    if (this.initialMapPosition && this.initialMapPosition.lat && this.initialMapPosition.lng) {

      this.map?.googleMap?.setCenter({ lat: this.initialMapPosition.lat, lng: this.initialMapPosition.lng })
      this.updateMarkerTo(this.initialMapPosition)

    } else {
      this.initMyCurrentPostion()
    }
    this.cdref.detectChanges();

  }

  
  initMyCurrentPostion() {

    navigator.permissions.query({ name: 'geolocation' }).then((value: PermissionStatus) => {

      if (value.state === 'granted') {
        navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude

          this.map?.googleMap?.setCenter({ lat, lng })

          this.markers.push(
            {
              position: { lat, lng },
            },
          )
          this.selectedCoordinate = { lat, lng }
          this.reverseGeocodeLocation({ lat, lng })
        })
      } else if (value.state === 'denied') {
        this.centerMapToDefaultPosition()
      }

    }).catch((err) => {
      this.centerMapToDefaultPosition()
    })
  }

  centerMapToDefaultPosition() {

    this.map?.googleMap?.setCenter({ lat: 36.7427263, lng: 10.0993976 })
    this.map?.googleMap?.setZoom(9)

  }
}
