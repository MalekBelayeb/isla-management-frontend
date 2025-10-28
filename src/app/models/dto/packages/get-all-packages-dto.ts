import { Injectable } from '@angular/core';
import { PackageBusiness } from '@models/old/package-employee';
import { PlanificationEmployee } from '@models/old/planification-employee';

@Injectable({
  providedIn: 'root',
})
export class GetAllPackagesDTO {
  fromResponse(dataResponse: any): PackageBusiness[] {
    return dataResponse.map((item: any): PackageBusiness => {
      return {
        packetId: item.id,
        name: item.name,
        maxBudgetPerMonth: item.budgetAmount,
        limitType: item.limitType,
        maxRidesPerMonth: item.maxRides,
        beneficiaryNumber: item.beneficiaryNumber,
      };
    });
  }
}
