export interface OwnerDetails {
  id: string;
  fullname: string;
  firstname: string;
  lastname: string;
  matricule: string;
  email: string;
  cin: string;
  gender: string;
  phoneNumber: string;
  nationality: string;
  type: 'natural' | 'legal';
  createdAt: Date;
  society?: string;
  taxId?: string; // matricule
  rib: string;
  nbProperty: number;
  nbPremises: number;
}
