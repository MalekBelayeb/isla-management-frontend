export interface Owner {
  id: string;
  name: string;
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
  
  nbProperty: number;
  nbPremises: number;
}
