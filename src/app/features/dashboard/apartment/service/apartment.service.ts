import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { conts } from 'src/app/variables/consts';

@Injectable({
  providedIn: 'root',
})
export class ApartmentService {
  private getApartmentsCache$: Observable<any> = new Observable<any>();
  private lastTimeGetApartments = 0;
  private readonly cacheTimeInSeconds = 15;

  constructor(private httpClient: HttpClient) {}

  createApartment(body: any) {
    return this.httpClient.post<any>(conts.createApartmentUrl, body, {
      headers: { 'ngrok-skip-browser-warning': '69420' },
      observe: 'response',
    });
  }
  updateApartment(id: string, body: any) {
    return this.httpClient.patch<any>(
      `${conts.updateApartmentUrl}/${id}`,
      body,
      {
        observe: 'response',
      },
    );
  }
  deleteApartment(id: string) {
    return this.httpClient.delete<any>(`${conts.deleteApartmentUrl}/${id}`, {
      observe: 'response',
    });
  }
  getAllApartments(urlParameters: string, useCache = false) {
    if (useCache) {
      if (
        new Date().getTime() - this.lastTimeGetApartments >
        this.cacheTimeInSeconds * 1000
      ) {
        this.getApartmentsCache$ = this.httpClient
          .get<any>(`${conts.getApartmentUrl}${urlParameters}`, {
            observe: 'response',
          })
          .pipe(shareReplay(1));
        this.lastTimeGetApartments = new Date().getTime();
      }
      return this.getApartmentsCache$;
    }
    return this.httpClient.get<any>(
      `${conts.getApartmentUrl}${urlParameters}`,
      {
        observe: 'response',
      },
    );
  }
  getApartment(id: string) {
    return this.httpClient.get<any>(`${conts.getApartmentUrl}/${id}`, {
      observe: 'response',
    });
  }
}
