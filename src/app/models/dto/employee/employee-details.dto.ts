import { Injectable } from '@angular/core';
import { EmployeeDetails } from '@models/old/user-details';
import { GetDayShiftPlanDTO } from '../shift/get-day-shift-plan-dto';

@Injectable({
  providedIn: 'root',
})
export class GetEmployeeDetailsDTO {
  constructor(private getDayShiftPlanDto: GetDayShiftPlanDTO) {}

  fromResponse(result: any): EmployeeDetails {
    console.log(result);
    const userDetails: EmployeeDetails = {
      fullname: `${result.firstname} ${result.lastname}`,
      firstname: `${result.firstname}`,
      lastname: `${result.lastname}`,
      email: result.emailUser,
      phoneNumber: result.phoneNumber,
      groupId: result.postId ?? '',
      siteId: result.siteId ?? '',
      activityId: result.activityId ?? '',
      cin: result.cin,
      type: result.tripType,
      group: result.postLabel ?? '',
      lat: result?.lat ?? '',
      long: result?.lng ?? '',
      createdAt: new Date(result.createdAt),
      address: result.address ?? '',
      departureFromHome: {
        monday:
          `${this.getDayShiftPlanDto.getDayShiftPlan(result.departureFromHome?.monday).hour}` +
          ':' +
          `${this.getDayShiftPlanDto.getDayShiftPlan(result.departureFromHome?.monday).minute}`,
        tuesday:
          `${this.getDayShiftPlanDto.getDayShiftPlan(result.departureFromHome?.tuesday).hour}` +
          ':' +
          `${this.getDayShiftPlanDto.getDayShiftPlan(result.departureFromHome?.tuesday).minute}`,
        wednesday:
          `${this.getDayShiftPlanDto.getDayShiftPlan(result.departureFromHome?.wednesday).hour}` +
          ':' +
          `${this.getDayShiftPlanDto.getDayShiftPlan(result.departureFromHome?.wednesday).minute}`,
        thursday:
          `${this.getDayShiftPlanDto.getDayShiftPlan(result.departureFromHome?.thursday).hour}` +
          ':' +
          `${this.getDayShiftPlanDto.getDayShiftPlan(result.departureFromHome?.thursday).minute}`,
        friday:
          `${this.getDayShiftPlanDto.getDayShiftPlan(result.departureFromHome?.friday).hour}` +
          ':' +
          `${this.getDayShiftPlanDto.getDayShiftPlan(result.departureFromHome?.friday).minute}`,
        saturday:
          `${this.getDayShiftPlanDto.getDayShiftPlan(result.departureFromHome?.saturday).hour}` +
          ':' +
          `${this.getDayShiftPlanDto.getDayShiftPlan(result.departureFromHome?.saturday).minute}`,
        sunday:
          `${this.getDayShiftPlanDto.getDayShiftPlan(result.departureFromHome?.sunday).hour}` +
          ':' +
          `${this.getDayShiftPlanDto.getDayShiftPlan(result.departureFromHome?.sunday).minute}`,
      },
      arrivalAtHome: {
        monday:
          `${this.getDayShiftPlanDto.getDayShiftPlan(result.arrivalAtHome?.monday).hour}` +
          ':' +
          `${this.getDayShiftPlanDto.getDayShiftPlan(result.arrivalAtHome?.monday).minute}`,
        tuesday:
          `${this.getDayShiftPlanDto.getDayShiftPlan(result.arrivalAtHome?.tuesday).hour}` +
          ':' +
          `${this.getDayShiftPlanDto.getDayShiftPlan(result.arrivalAtHome?.tuesday).minute}`,
        wednesday:
          `${this.getDayShiftPlanDto.getDayShiftPlan(result.arrivalAtHome?.wednesday).hour}` +
          ':' +
          `${this.getDayShiftPlanDto.getDayShiftPlan(result.arrivalAtHome?.wednesday).minute}`,
        thursday:
          `${this.getDayShiftPlanDto.getDayShiftPlan(result.arrivalAtHome?.thursday).hour}` +
          ':' +
          `${this.getDayShiftPlanDto.getDayShiftPlan(result.arrivalAtHome?.thursday).minute}`,
        friday:
          `${this.getDayShiftPlanDto.getDayShiftPlan(result.arrivalAtHome?.friday).hour}` +
          ':' +
          `${this.getDayShiftPlanDto.getDayShiftPlan(result.arrivalAtHome?.friday).minute}`,
        saturday:
          `${this.getDayShiftPlanDto.getDayShiftPlan(result.arrivalAtHome?.saturday).hour}` +
          ':' +
          `${this.getDayShiftPlanDto.getDayShiftPlan(result.arrivalAtHome?.saturday).minute}`,
        sunday:
          `${this.getDayShiftPlanDto.getDayShiftPlan(result.arrivalAtHome?.sunday).hour}` +
          ':' +
          `${this.getDayShiftPlanDto.getDayShiftPlan(result.arrivalAtHome?.sunday).minute}`,
      },
      employeeId: result.employeeId,
      site: result.siteLabel,
      activity: result.activity,
      stopLocation: result.stopLocation?.labelTarget ?? '',
      currentTrip: result.currentTrip,
      attachment: result.attachment,
      addressNumber: result.addressNumber,
      userAddresses: result.userAddresses,
      userPacket: {
        ...result.userPacket,
        remainingValue: Number(result.userPacket?.remainingValue ?? 0),
      },
    };
    return userDetails;
  }
}
