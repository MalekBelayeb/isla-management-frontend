import { OwnerDetails } from '@dashboard/owner/entity/owner-details';

export interface PropertyDetails {
  id: string;
  type: string;
  profitInPercentage: number;
  owner: OwnerDetails | undefined;
  idNumber: string;
  address: string;
  createdAt: string;
  apartments: string[];
}
