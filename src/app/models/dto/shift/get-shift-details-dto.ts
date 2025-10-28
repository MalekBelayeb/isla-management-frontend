import { Injectable } from '@angular/core';
import { ShiftDetails } from '../../old/shift-details';
import { GetDayShiftPlanDTO } from './get-day-shift-plan-dto';

@Injectable({
  providedIn: 'root',
})
export class GetShiftDetailsDTO {
  constructor(private getDayShiftPlanDto: GetDayShiftPlanDTO) { }
  initObject(): ShiftDetails {
    return this.fromResponse({
      id: undefined,
      name: undefined,
      numberOfEmployee: undefined,
      creationDate: undefined,
      departureFromHome: undefined,
      arrivalAtHome: undefined,
    });
  }

  fromResponse(dataResponse: any): ShiftDetails {
    return {
      id: dataResponse.id ?? '',
      name: dataResponse.label ?? '',
      numberOfEmployee: dataResponse.numberOfEmployee ?? 0,
      creationDate: dataResponse.creationDate ?? '',
      leavingFromWorkShiftEnabled: dataResponse.arrivalAtHome != null,
      arrivalToWorkShiftEnabled: dataResponse.departureFromHome != null,
      leavingFromWorkVehiculeType: dataResponse.arrivalTransportType ?? '',
      arrivalToWorkVehiculeType: dataResponse.departureTransportType ?? '',
      week: {
        mondayDepartureFromHome: this.getDayShiftPlanDto.getDayShiftPlan(
          dataResponse.departureFromHome?.monday,
        ),
        mondayarrivalAtHome: this.getDayShiftPlanDto.getDayShiftPlan(
          dataResponse.arrivalAtHome?.monday,
        ),

        tuesdayDepartureFromHome: this.getDayShiftPlanDto.getDayShiftPlan(
          dataResponse.departureFromHome?.tuesday,
        ),
        tuesdayarrivalAtHome: this.getDayShiftPlanDto.getDayShiftPlan(
          dataResponse.arrivalAtHome?.tuesday,
        ),

        wednesdayDepartureFromHome: this.getDayShiftPlanDto.getDayShiftPlan(
          dataResponse.departureFromHome?.wednesday,
        ),
        wednesdayarrivalAtHome: this.getDayShiftPlanDto.getDayShiftPlan(
          dataResponse.arrivalAtHome?.wednesday,
        ),

        thursdayDepartureFromHome: this.getDayShiftPlanDto.getDayShiftPlan(
          dataResponse.departureFromHome?.thursday,
        ),
        thursdayarrivalAtHome: this.getDayShiftPlanDto.getDayShiftPlan(
          dataResponse.arrivalAtHome?.thursday,
        ),

        fridayDepartureFromHome: this.getDayShiftPlanDto.getDayShiftPlan(
          dataResponse.departureFromHome?.friday,
        ),
        fridayarrivalAtHome: this.getDayShiftPlanDto.getDayShiftPlan(
          dataResponse.arrivalAtHome?.friday,
        ),

        saturdayDepartureFromHome: this.getDayShiftPlanDto.getDayShiftPlan(
          dataResponse.departureFromHome?.saturday,
        ),
        saturdayarrivalAtHome: this.getDayShiftPlanDto.getDayShiftPlan(
          dataResponse.arrivalAtHome?.saturday,
        ),

        sundayDepartureFromHome: this.getDayShiftPlanDto.getDayShiftPlan(
          dataResponse.departureFromHome?.sunday,
        ),
        sundayarrivalAtHome: this.getDayShiftPlanDto.getDayShiftPlan(
          dataResponse.arrivalAtHome?.sunday,
        ),
      },
    };
  }


}
