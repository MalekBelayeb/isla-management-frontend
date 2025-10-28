import { Injectable } from '@angular/core';
import { Employee } from '@models/old/employe';

@Injectable({
  providedIn: 'root',
})
export class GetAllEmployeeDTO {
  fromResponse(bodyResponse: any): Employee[] {
    console.log(bodyResponse);

    return bodyResponse.map((newItem: any): Employee => {
      return {
        id: newItem.id,
        fullname: `${newItem.fullname}`,
        vehicleType: newItem.vehicleType,
        phoneNumber: newItem.phoneNumber,
        departureTime: `${newItem.departureTime ?? ''}`,
        arrivalTime: `${newItem.arrivalTime ?? ''}`,
        activeAddress: `${newItem.address ?? ''}`,
        shiftId: newItem.postId,
        type: newItem.tripType == 'SHARED' ? 'shared' : 'exclusive',
        group: newItem.postLabel,
        activity: newItem.activity,
        email: newItem.emailUser,
        employeeId: newItem.employeeId,
        site: newItem.siteLabel,
        arrivalTransportType: newItem.arrivalTransportType,
        departureTransportType: newItem.departureTransportType,
        stopLocation: newItem.stopLocation?.labelTarget ?? '',
        status: newItem.status ?? 'unverified',
        userPacket: {
          ...newItem.userPacket,
          remainingValue: Number(
            newItem.userPacket?.remainingValue ?? 0,
          ),
        },
      };
    });
  }
}
