import { Agreement } from '@dashboard/agreement/entity/agreement';
import { Apartment } from '@dashboard/apartment/entity/Apartment';
import { TenantType } from './tenant-details';
import { AgreementDetails } from '@dashboard/agreement/entity/agreement-details';
import { ApartmentDetails } from '@dashboard/apartment/entity/apartment-details';

export interface LatePayerTenant {
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
  agreement: AgreementDetails | undefined;
  apartment: ApartmentDetails | undefined;
  agreementStartDate?: Date;
  lastPaymentDate: string;
  paymentDelay: number;
  overdueAmount: number;
  tenantType: TenantType;
  societyName: string;
}
