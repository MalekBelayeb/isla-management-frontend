import { OwnerDetails } from '@dashboard/owner/entity/owner-details';
import { PropertyDetails } from '@dashboard/property/entity/property-details';

export interface ApartmentDetails {
  id: string;
  type: string;
  address: string;
  matricule: string;
  idNumber: string;
  description: string;
  rooms: number;
  createdAt: string;
  property: PropertyDetails | undefined;
  owner: OwnerDetails | undefined;
}
