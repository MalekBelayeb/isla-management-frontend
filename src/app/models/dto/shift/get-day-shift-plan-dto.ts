import { Injectable } from "@angular/core";
import { DayShiftPlan } from "@models/old/shift-details";

@Injectable({
    providedIn: 'root',
})
export class GetDayShiftPlanDTO {
    getDayShiftPlan(dayPlan: any): DayShiftPlan {

        const dayShiftPlan = {
            hour: `${dayPlan?.hour ?? '--'}`.padStart(2, '0'),
            minute: `${dayPlan?.minute ?? '--'}`.padStart(2, '0'),
        };

        return dayShiftPlan;
    }
}