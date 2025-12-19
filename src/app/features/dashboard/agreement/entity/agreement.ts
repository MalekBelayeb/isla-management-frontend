export interface Agreement {
  id: string;
  matricule: string;
  rentAmount: number;
  startDate: Date;
  status: string;
  signedAt: string;
  createdAt: string;
  paymentFrequency: string;
  apartment: string;
  tenant: string;
  property: string;
  owner: string;
  nbDaysOfTolerance: number;
}
