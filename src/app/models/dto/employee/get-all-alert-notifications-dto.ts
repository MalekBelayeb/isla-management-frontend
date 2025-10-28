import { Injectable } from '@angular/core';
import { translateDaysOfWeek } from '@core/helpers';
import { AlertNotification } from '@models/old/alert-notification';

@Injectable({
  providedIn: 'root',
})
export class GetAllAlertNotificationsDTO {
  fromResponse(bodyResponse: any): AlertNotification[] {
    console.log(bodyResponse);

    return bodyResponse.map((newItem: any): AlertNotification => {
      return {
        id: newItem.id,
        time: newItem.alertTime,
        days:
          newItem.daysOfWeek
            ?.filter((item: any) => item.selected == true)
            .map((item: any) => translateDaysOfWeek(item.day))
            .join(', ') ?? '',
      };
    });
  }
}
