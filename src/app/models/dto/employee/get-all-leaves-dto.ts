import { Injectable } from '@angular/core';
import { Leave } from '@models/old/leave';

@Injectable({
    providedIn: 'root',
})
export class GetAllleavesDTO {
    fromResponse(bodyResponse: any[]): Leave[] {
        return bodyResponse.map((item: any): Leave => {
            return {
                id: item.id,
                idUser: item.idUser,
                leaveType: item.leaveType,
                daysRequested: item.daysRequested,
                startDate: item.startDate,
                endDate: item.endDate,
                creationDate: item.creationDate
            };
        });
    }
}
