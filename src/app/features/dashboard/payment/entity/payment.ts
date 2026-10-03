import { AgreementDetails } from '@dashboard/agreement/entity/agreement-details';
import { ApartmentDetails } from '@dashboard/apartment/entity/apartment-details';
import { OwnerDetails } from '@dashboard/owner/entity/owner-details';
import { PropertyDetails } from '@dashboard/property/entity/property-details';
import { TenantDetails } from '@dashboard/tenant/entity/tenant-details';

export interface Payment {
  id: string;
  amount: number;
  extraCharge: number;
  totalAmount: number;
  paymentDate: string;
  method: string;
  label: string;
  account: string;
  reason: string;
  rentStartDate: Date;
  rentEndDate: Date;
  type: string;
  category: string;
  payementFrequency: string;
  createdAt: string;
  agreement: AgreementDetails | undefined;
  apartment: ApartmentDetails | undefined;
  property: PropertyDetails | undefined;
  tenant: TenantDetails | undefined;
  owner: OwnerDetails | undefined;
}
