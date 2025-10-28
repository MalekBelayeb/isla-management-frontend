import { Injectable } from "@angular/core"
import { PlanificationEmployee } from "@models/old/planification-employee"

@Injectable({
    providedIn: 'root',
})
export class GetPlanificationEmployeeDTO {
    fromResponse(dataResponse: any): PlanificationEmployee[] {
        return dataResponse.map((item: any): PlanificationEmployee => {
            return {
                fullname: `${item.fullname}`,
                phoneNumber: item.phoneNumber,
                tripType: item.tripType == 'SHARED' ? 'SHARED' : 'EXCLUSIVE',
                dropoff: `${item.dropoffLabel}`,
                pickup: `${item.pickupLabel}`,
                time:
                    `${item.timeLabel}`,
                stopLocation: item.stopLocation?.location?.labelTarget ?? '',
            };
        })
    }
}
