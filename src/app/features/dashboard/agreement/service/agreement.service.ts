import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { conts } from 'src/app/variables/consts';

@Injectable({
  providedIn: 'root',
})
export class AgreementService {
  private getAgreementsCache$: Observable<any> = new Observable<any>();
  private lastTimeGetAgreements = 0;
  private readonly cacheTimeInSeconds = 15;

  constructor(private httpClient: HttpClient) {}

  createAgreement(body: any) {
    return this.httpClient.post<any>(conts.createAgreementUrl, body, {
      observe: 'response',
    });
  }
  updateAgreement(id: string, body: any) {
    return this.httpClient.patch<any>(
      `${conts.updateAgreementUrl}/${id}`,
      body,
      {
        observe: 'response',
      },
    );
  }
  deleteAgreement(id: string) {
    return this.httpClient.delete<any>(`${conts.deleteAgreementUrl}/${id}`, {
      observe: 'response',
    });
  }
  getAllAgreement(urlParameters: string, useCache = false) {
    if (useCache) {
      if (
        new Date().getTime() - this.lastTimeGetAgreements >
        this.cacheTimeInSeconds * 1000
      ) {
        this.getAgreementsCache$ = this.httpClient
          .get<any>(`${conts.getAgreementUrl}${urlParameters}`, {
            observe: 'response',
          })
          .pipe(shareReplay(1));
        this.lastTimeGetAgreements = new Date().getTime();
      }
      return this.getAgreementsCache$;
    }
    return this.httpClient.get<any>(
      `${conts.getAgreementUrl}${urlParameters}`,
      {
        observe: 'response',
      },
    );
  }
  getAgreement(id: string) {
    return this.httpClient.get<any>(`${conts.getAgreementUrl}/${id}`, {
      observe: 'response',
    });
  }
}
