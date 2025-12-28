import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { conts } from 'src/app/variables/consts';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private getPaymentsCache$: Observable<any> = new Observable<any>();
  private lastTimeGetPayments = 0;
  private readonly cacheTimeInSeconds = 15;

  private getFinancialBalanceCache$: Observable<any> = new Observable<any>();
  private lastTimeGetFinancialBalance = 0;

  constructor(private httpClient: HttpClient) {}

  createPayment(body: any) {
    return this.httpClient.post<any>(conts.createPaymentUrl, body, {
      observe: 'response',
    });
  }
  updatePayment(id: string, body: any) {
    return this.httpClient.patch<any>(`${conts.updatePaymentUrl}/${id}`, body, {
      observe: 'response',
    });
  }

  generateReceipt(paymentId: string) {
    return this.httpClient.get<any>(
      `${conts.generateReceiptUrl}/${paymentId}`,
      {
        responseType: 'blob' as 'json',
      },
    );
  }

  getPayment(id: string) {
    return this.httpClient.get<any>(`${conts.getPaymentUrl}/${id}`, {
      observe: 'response',
    });
  }

  deletePayment(id: string) {
    return this.httpClient.delete<any>(`${conts.deletePaymentUrl}/${id}`, {
      observe: 'response',
    });
  }

  getAllPayments(urlParameters: string, useCache = false) {
    if (useCache) {
      if (
        new Date().getTime() - this.lastTimeGetPayments >
        this.cacheTimeInSeconds * 1000
      ) {
        this.getPaymentsCache$ = this.httpClient
          .get<any>(`${conts.getPaymentUrl}${urlParameters}`, {
            observe: 'response',
          })
          .pipe(shareReplay(1));
        this.lastTimeGetPayments = new Date().getTime();
      }
      return this.getPaymentsCache$;
    }
    return this.httpClient.get<any>(`${conts.getPaymentUrl}${urlParameters}`, {
      observe: 'response',
    });
  }

  getFinancialBalance(urlParameters: string, useCache = false) {
    if (useCache) {
      if (
        new Date().getTime() - this.lastTimeGetFinancialBalance >
        this.cacheTimeInSeconds * 1000
      ) {
        this.getFinancialBalanceCache$ = this.httpClient
          .get<any>(`${conts.getFinancialBalanceUrl}${urlParameters}`, {
            observe: 'response',
          })
          .pipe(shareReplay(1));
        this.lastTimeGetFinancialBalance = new Date().getTime();
      }
      return this.getFinancialBalanceCache$;
    }
    return this.httpClient.get<any>(
      `${conts.getFinancialBalanceUrl}${urlParameters}`,
      {
        observe: 'response',
      },
    );
  }
}
