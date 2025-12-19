export interface Payment {
  id: string;
  amount: number;
  paymentDate: string;
  method: string;
  label: string;
  account: string;
  reason: string;
  rentStartDate: Date;
  rentEndDate: Date;
  type: string;
  category: string;
  agreement: string;
  property: string;
  owner: string;
  payementFrequency: string;
  tenant: string;
  apartment: string;
  createdAt: string;
}
