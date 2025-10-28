import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user?: User;
  constructor(private httpClient: HttpClient) {}

  getUser(): User | undefined {
    return this.user;
  }

  setUser(user: User) {
    this.user = user;
  }

  fetchUser() {
    return this.httpClient.get<any>(`${environment.url}/user`, {
      observe: 'response',
    });
  }

  fetchSocietyDetails(societyId: string) {
    return this.httpClient.get<any>(
      `${environment.url}/societies/${societyId}`,
      {
        observe: 'response',
      },
    );
  }

  fetchSocietyCode(societyId: string) {
    return this.httpClient.get<any>(
      `${environment.url}/societies/generate-society-keys/${societyId}`,
      {
        headers: { 'ngrok-skip-browser-warning': '69420' },
        observe: 'response',
      },
    );
  }

  updateAlertNotification(body: any) {
    return this.httpClient.put<any>(
      `${environment.url}/users-society/validate-attachment-society/${body}`,
      body,
      {
        headers: { 'ngrok-skip-browser-warning': '69420' },
        observe: 'response',
      },
    );
  }

  getAlertNotification(societyId: string) {
    return this.httpClient.get<any>(
      `${environment.url}/societies/generate-society-keys/${societyId}`,
      {
        headers: { 'ngrok-skip-browser-warning': '69420' },
        observe: 'response',
      },
    );
  }

  logoutUser() {
    return this.httpClient.post<any>(`${environment.url}/auth/logout`, {
      observe: 'response',
    });
  }
}
