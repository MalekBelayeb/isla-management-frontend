export interface PaymentDetails {
  id: string;
  amount: string;
  paymentDate: string;
  method: string;
  label: string;
  rentStartDate?: Date;
  rentEndDate?: Date;
  type: string;
  category: string;
  agreement?: string;
  agreementId?: string;
  matriculeProperty?: string;
  payementFrequency?: string;
  tenant?: string;
  notes: string;
  property: string;
  apartment?: string;
  createdAt: string;
  owner?: string;
}
