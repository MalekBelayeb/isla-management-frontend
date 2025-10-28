import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { conts } from 'src/app/variables/consts';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  private getPropertiesCache$: Observable<any> = new Observable<any>();
  private lastTimeGetProperties = 0;
  private readonly cacheTimeInSeconds = 15;

  constructor(private httpClient: HttpClient) {}

  createProperty(body: any) {
    return this.httpClient.post<any>(conts.createPropertyUrl, body, {
      observe: 'response',
    });
  }
  updateProperty(id: string, body: any) {
    return this.httpClient.patch<any>(
      `${conts.updatePropertyUrl}/${id}`,
      body,
      {
        observe: 'response',
      },
    );
  }

  getProperty(id: string) {
    return this.httpClient.get<any>(`${conts.getPropertyUrl}/${id}`, {
      observe: 'response',
    });
  }

  deleteProperty(id: string) {
    return this.httpClient.delete<any>(`${conts.deletePropertyUrl}/${id}`, {
      observe: 'response',
    });
  }

  getAllProperties(urlParameters: string, useCache = false) {
    if (useCache) {
      if (
        new Date().getTime() - this.lastTimeGetProperties >
        this.cacheTimeInSeconds * 1000
      ) {
        this.getPropertiesCache$ = this.httpClient
          .get<any>(`${conts.getPropertyUrl}${urlParameters}`, {
            observe: 'response',
          })
          .pipe(shareReplay(1));
        this.lastTimeGetProperties = new Date().getTime();
      }
      return this.getPropertiesCache$;
    }
    return this.httpClient.get<any>(
      `${conts.getPropertyUrl}${urlParameters}`,
      {
        observe: 'response',
      },
    );
  }
}
