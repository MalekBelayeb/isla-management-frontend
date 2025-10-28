import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { conts } from 'src/app/variables/consts';

@Injectable({
  providedIn: 'root',
})
export class TenantService {
  private getTenantsCache$: Observable<any> = new Observable<any>();
  private lastTimeGetTenants = 0;
  private readonly cacheTimeInSeconds = 15;

  constructor(private httpClient: HttpClient) {}

  createTenant(body: any) {
    return this.httpClient.post<any>(conts.createTenantUrl, body, {
      headers: { 'ngrok-skip-browser-warning': '69420' },
      observe: 'response',
    });
  }
  updateTenant(id: string, body: any) {
    return this.httpClient.patch<any>(`${conts.updateTenantUrl}/${id}`, body, {
      observe: 'response',
    });
  }
  deleteTenant(id: string) {
    return this.httpClient.delete<any>(`${conts.deleteTenantUrl}/${id}`, {
      observe: 'response',
    });
  }
  getAllTenant(urlParameters: string, useCache = false) {
    if (useCache) {
      if (
        new Date().getTime() - this.lastTimeGetTenants >
        this.cacheTimeInSeconds * 1000
      ) {
        this.getTenantsCache$ = this.httpClient
          .get<any>(`${conts.getTenantUrl}${urlParameters}`, {
            observe: 'response',
          })
          .pipe(shareReplay(1));
        this.lastTimeGetTenants = new Date().getTime();
      }
      return this.getTenantsCache$;
    }
    return this.httpClient.get<any>(`${conts.getTenantUrl}${urlParameters}`, {
      observe: 'response',
    });
  }
  getTenant(id: string) {
    return this.httpClient.get<any>(`${conts.getTenantUrl}/${id}`, {
      observe: 'response',
    });
  }
}
