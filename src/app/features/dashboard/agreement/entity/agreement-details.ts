export interface AgreementDetails {
  id: string;
  matricule: string;
  rentAmount: number;
  tenant: string;
  apartment: string;
  startDate: Date;
  expireDate: Date;
  status: string;
  paymentFrequency: string;
  tenantId: string;
  nbDaysOfTolerance: number;
  apartmentId: string;
  deposit: string;
  firstDayOfPayment: string;
  documentUrl: string;
  notes: string;
  createdAt: string;
  signedAt: string;
}
