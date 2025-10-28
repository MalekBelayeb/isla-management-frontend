import { Injectable } from '@angular/core';
import { PackageBusiness } from '@models/old/package-employee';
import { PlanificationEmployee } from '@models/old/planification-employee';

@Injectable({
  providedIn: 'root',
})
export class GetPackageByIdDTO {
  fromResponse(dataResponse: any): PackageBusiness {
    console.log(dataResponse);
    return {
      packetId: dataResponse.id,
      name: dataResponse.name,
      maxBudgetPerMonth: dataResponse.budgetAmount,
      limitType: dataResponse.limitType,
      maxRidesPerMonth: dataResponse.maxRides ?? 0,
      beneficiaryNumber: dataResponse.beneficiaryNumber ?? 0,
    };
  }
}
