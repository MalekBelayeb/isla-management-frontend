import { Injectable } from '@angular/core';
import { Shift } from '../../old/shift';

@Injectable({
  providedIn: 'root',
})
export class AllShiftsDTO {
  fromResponse(dataResponse: any): Shift[] {
    return dataResponse.map((item: any): Shift => {

      return { id: item.id, name: item.label, creationDate: item.creationDate, numberOfEmployees: item.beneficiaryNumber }

    })
  }
}
