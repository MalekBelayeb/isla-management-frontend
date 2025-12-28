export interface PaymentDetails {
  id: string;
  amount: string;
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
  matriculeProperty?: string;
  payementFrequency?: string;
  tenant?: string;
  notes: string;
  property: string;
  apartment?: string;
  createdAt: string;
  owner?: string;
}
