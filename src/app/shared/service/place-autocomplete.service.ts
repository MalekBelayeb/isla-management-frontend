import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlaceAutocompleteService {

  constructor(private httpClient: HttpClient) { }

  getPlacesAutocomplete(query: string) {
    return this.httpClient.get<any>(`${environment.url}/places/?input=${query}`, { observe: 'response' })
  }

  getPlacesDetails(id: string) {
    return this.httpClient.get<any>(`${environment.url}/places/details-place/?placeId=${id}`, { observe: 'response' })
  }

}
