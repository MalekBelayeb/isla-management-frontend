export interface Payment {
  id: string;
  amount: string;
  paymentDate: string;
  method: string;
  label: string;
  rentStartDate: Date;
  rentEndDate: Date;
  type: string;
  category: string;
  agreement: string;
  payementFrequency: string;
  tenant: string;
  apartment: string;
  createdAt: string;
}
