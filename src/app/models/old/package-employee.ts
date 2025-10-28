export interface PackageBusiness {
  packetId: string;
  name: string;
  limitType: 'BUDGET_BASED' | 'RIDE_BASED' | 'UNLIMITED';
  maxRidesPerMonth?: number;
  maxBudgetPerMonth?: number;
  beneficiaryNumber?: number;
}

export interface EmployeePackageBusiness {
  employeeId: string;
  fullname: string;
  packetId?: string;
  packetName?: string;
  remainingAmount?: number;
  maxAmount?: number;
  limitType?: string;
}

export const packageTypeAdapter = {
  BUDGET_BASED: 'quotaOnPrice',
  RIDE_BASED: 'quotaOnCourse',
  UNLIMITED: 'unlimited',
};
