import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { conts } from 'src/app/variables/consts';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OwnerService {
  private getOwnersCache$: Observable<any> = new Observable<any>();
  private lastTimeGetOwners = 0;
  private readonly cacheTimeInSeconds = 15;

  constructor(private httpClient: HttpClient) {}

  createOwner(body: any) {
    return this.httpClient.post<any>(conts.getOwnerUrl, body, {
      headers: { 'ngrok-skip-browser-warning': '69420' },
      observe: 'response',
    });
  }
  updateOwner(id: string, body: any) {
    return this.httpClient.patch<any>(`${conts.getOwnerUrl}/${id}`, body, {
      observe: 'response',
    });
  }
  deleteOwner(id: string) {
    return this.httpClient.delete<any>(`${conts.getOwnerUrl}/${id}`, {
      observe: 'response',
    });
  }
  getAllOwners(urlParameters: string, useCache = false) {
    if (useCache) {
      if (
        new Date().getTime() - this.lastTimeGetOwners >
        this.cacheTimeInSeconds * 1000
      ) {
        this.getOwnersCache$ = this.httpClient
          .get<any>(`${conts.getOwnerUrl}${urlParameters}`, {
            observe: 'response',
          })
          .pipe(shareReplay(1));
        this.lastTimeGetOwners = new Date().getTime();
      }
      return this.getOwnersCache$;
    }
    return this.httpClient.get<any>(`${conts.getOwnerUrl}${urlParameters}`, {
      observe: 'response',
    });
  }
  getOwner(id: string) {
    return this.httpClient.get<any>(`${conts.getOwnerUrl}/${id}`, {
      observe: 'response',
    });
  }
}
