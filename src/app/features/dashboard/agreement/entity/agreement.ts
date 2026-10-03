import { ApartmentDetails } from '@dashboard/apartment/entity/apartment-details';
import { OwnerDetails } from '@dashboard/owner/entity/owner-details';
import { PropertyDetails } from '@dashboard/property/entity/property-details';
import { TenantDetails } from '@dashboard/tenant/entity/tenant-details';

export interface Agreement {
  id: string;
  matricule: string;
  rentAmount: number;
  startDate: Date;
  status: string;
  signedAt: string;
  createdAt: string;
  paymentFrequency: string;
  apartment: ApartmentDetails;
  tenant: TenantDetails;
  property: PropertyDetails;
  owner: OwnerDetails;
  nbDaysOfTolerance: number;
}
