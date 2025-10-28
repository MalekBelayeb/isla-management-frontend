import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RefreshNotificationsService {

  constructor() {}

  private valueObs: BehaviorSubject<string> = new BehaviorSubject<string>("");

  public setValue(value: string): void {
    this.valueObs.next(value);
    this.getValue();
  }

  public getValue(): Observable<string> {
    return this.valueObs;
  }
}
