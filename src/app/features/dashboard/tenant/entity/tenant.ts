export interface Tenant {
  id: string;
  matricule: string;
  firstname: string;
  lastname: string;
  fullname: string;
  cin: string;
  phoneNumber: string;
  nationality: string;
  address: string;
  createdAt: Date;
  job: string;
  apartment: string;
  agreement: string;
  agreementStartDate?: Date;
  lastPaymentDate: string;
  status: TenantStatusType;
}

export type TenantStatusType =
  | 'NO_AGREEMENT'
  | 'NO_RENT'
  | 'AGREEMENT_SUSPENDED'
  | 'IN_GOOD_STANDING'
  | 'PAYMENT_DEFAULT';
