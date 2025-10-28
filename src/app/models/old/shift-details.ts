export interface ShiftDetails {
  id: string;
  name: string;
  creationDate: string;
  numberOfEmployee: number;
  week: WeekShiftPlan;
  arrivalToWorkShiftEnabled: boolean;
  arrivalToWorkVehiculeType: string;

  leavingFromWorkShiftEnabled: boolean;
  leavingFromWorkVehiculeType: string
}

export interface WeekShiftPlan {
  mondayDepartureFromHome: DayShiftPlan;
  mondayarrivalAtHome: DayShiftPlan;

  tuesdayDepartureFromHome: DayShiftPlan;
  tuesdayarrivalAtHome: DayShiftPlan;

  wednesdayDepartureFromHome: DayShiftPlan;
  wednesdayarrivalAtHome: DayShiftPlan;

  thursdayDepartureFromHome: DayShiftPlan;
  thursdayarrivalAtHome: DayShiftPlan;

  fridayDepartureFromHome: DayShiftPlan;
  fridayarrivalAtHome: DayShiftPlan;

  saturdayDepartureFromHome: DayShiftPlan;
  saturdayarrivalAtHome: DayShiftPlan;

  sundayDepartureFromHome: DayShiftPlan;
  sundayarrivalAtHome: DayShiftPlan;
}

export interface DayShiftPlan {
  hour: string;
  minute: string;
}
