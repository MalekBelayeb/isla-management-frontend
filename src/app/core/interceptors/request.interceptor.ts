import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ToastAlertService } from '@shared/toast-alert/toast-alert.service';
import { environment } from 'src/environments/environment';

interface GenericErrorBodyResponse {
  response: boolean;
  message: string;
}

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(private toastAlertService: ToastAlertService) {}
  codeStatus: number[] = [404, 401, 400, 409, 500];
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    request = request.clone({
      withCredentials: true,
    });

    console.log(request);

    return next.handle(request).pipe(
      tap({
        next: (value) => {
          if (value instanceof HttpResponse) {
            if (this.codeStatus.includes(value.status)) {
              this.toastAlertService.showErrorNotification(
                "Une erreur s'est produite",
                (value.body as GenericErrorBodyResponse).message ?? '',
              );
            }
          }
        },
        error: (error) => {
          if (request.url.replace(environment.url, '') === '/auth/profile')
            return;
          if (error instanceof HttpErrorResponse) {
            if (error) {
              if (this.codeStatus.includes(error.status)) {
                this.toastAlertService.showErrorNotification(
                  "Une erreur s'est produite",
                  error.error?.message ||
                    'Erreur du serveur, veuillez réessayer plus tard',
                );
              }
            }
          }
        },
      }),
    );
  }
}
