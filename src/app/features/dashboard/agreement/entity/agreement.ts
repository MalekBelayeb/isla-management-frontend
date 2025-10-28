export interface Agreement {
  id: string;
  matricule: string;
  rentAmount: number;
  startDate: Date;
  expireDate: Date;
  status: string;
  signedAt: string;
  createdAt: string;
  paymentFrequency: string;
  apartment: string;
  tenant: string;
}
