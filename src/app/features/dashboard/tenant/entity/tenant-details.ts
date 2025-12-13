import { Agreement } from '@dashboard/agreement/entity/agreement';

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
  agreement?: Agreement;
}
