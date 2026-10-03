import { ApartmentDetails } from '@dashboard/apartment/entity/apartment-details';
import { OwnerDetails } from '@dashboard/owner/entity/owner-details';
import { PropertyDetails } from '@dashboard/property/entity/property-details';
import { TenantDetails } from '@dashboard/tenant/entity/tenant-details';

export interface AgreementDetails {
  id: string;
  matricule: string;
  rentAmount: number;
  startDate: Date;
  status: string;
  paymentFrequency: string;
  nbDaysOfTolerance: number;
  deposit: string;
  firstDayOfPayment: string;
  documentUrl: string;
  apartment: ApartmentDetails | undefined;
  tenant: TenantDetails | undefined;
  property: PropertyDetails | undefined;
  owner: OwnerDetails | undefined;
  notes: string;
  createdAt: string;
  signedAt: string;
}
