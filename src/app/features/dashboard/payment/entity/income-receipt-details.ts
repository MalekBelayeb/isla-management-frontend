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
};
