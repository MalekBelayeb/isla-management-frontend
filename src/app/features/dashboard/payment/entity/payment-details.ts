import { OwnerDetails } from '@dashboard/owner/entity/owner-details';
import { PropertyDetails } from '@dashboard/property/entity/property-details';
import { TenantDetails } from '@dashboard/tenant/entity/tenant-details';

export interface PaymentDetails {
  id: string;
  amount: string;
  extraCharge?: string;
  tva?: string;
  paymentDate: string;
  method: string;
  label: string;
  rentStartDate?: Date;
  rentEndDate?: Date;
  type: string;
  category: string;
  bank: string;
  checkNumber: string;
  transferNumber: string;
  agreement?: string;
  agreementId?: string;
  payementFrequency?: string;
  tenant?: TenantDetails | undefined;
  notes: string;
  property: PropertyDetails | undefined;
  apartment?: string;
  createdAt: string;
  owner?: OwnerDetails | undefined;
}
