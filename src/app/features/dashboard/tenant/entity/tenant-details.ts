import { Agreement } from '@dashboard/agreement/entity/agreement';
import { AgreementDetails } from '@dashboard/agreement/entity/agreement-details';

export type TenantType = 'natural' | 'legal';

export interface TenantDetails {
  id: string;
  matricule: string;
  firstname: string;
  lastname: string;
  fullname: string;
  gender: string;
  email: string;

  cin: string;
  phoneNumber: string;
  nationality: string;
  address: string;
  createdAt: Date;
  job: string;
  tenantType?: TenantType;

  agreement?: AgreementDetails;

  companyName: string;
  managerCin: string;
  managerFirstname: string;
  managerLastname: string;
  managerPhoneNumber: string;
}
