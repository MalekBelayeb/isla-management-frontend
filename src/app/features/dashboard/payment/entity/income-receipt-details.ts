import { OwnerDetails } from '@dashboard/owner/entity/owner-details';
import { TenantDetails } from '@dashboard/tenant/entity/tenant-details';

export type PaymentReceiptDetails = {
  recipientName: string;
  propertyAddress: string;
  propertyNumber: string;
  paymentMethod: string;
  paymentLabel: string;
  rentStartDate: Date;
  rentEndDate: Date;
  amountTva: number;
  amount: number;
  extraCharge: number;
  totalAmount: number;
  owner: OwnerDetails | undefined;
  tenant: TenantDetails | undefined;
};
