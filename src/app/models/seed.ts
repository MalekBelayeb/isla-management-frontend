import { SearchResult } from '@shared/search-input/search-input.component';
import { Aggrement } from './aggrement';
import { Owner } from '@owner/entity/owner';
import { Premise } from './premise';
import { Property } from '@property/entity/property';
import { Tenant } from './tenant';

export class Seed {
  /*static owners: Owner[] = [
    {
      id: '1',
      firstname: 'Foulen',
      lastname: 'Ben Foulen',
      cin: '6699887755',
      country: 'TN',
      phoneNumber: '55317899',
      type: 'natural',
      nbProperty: 1,
      nbPremises: 2,
    },
    {
      id: '2',
      firstname: 'Salem',
      lastname: 'Ben Ayed',
      cin: '6699115588',
      country: 'TN',
      phoneNumber: '55317899',
      type: 'natural',
      nbProperty: 1,
      nbPremises: 1,
    },
  ];*/

  static ownerOptions: SearchResult[] = [
    { id: '1', title: '1 - Foulen ben Foulen' },
    { id: '2', title: '2 - Salem Ben Ayed' },
  ];

  static properties: Property[] = [
    {
      id: 'P1B2',
      address: 'El Aouina, Tunis',
      owner: 'P1 - MR Flen ben foulen',
      matricule: '2',
      type: 'Magasin',
      apartments: [],
    },
    {
      id: 'P1B3',
      address: 'La marsa, Tunis',
      owner: 'P1 - MR Flen ben foulen',
      type: 'Villa',
      matricule: '3',
      apartments: [],
    },
  ];

  static propertiesOptions: SearchResult[] = [
    { id: '1', title: '1 - El Aouina, Tunis' },
    { id: '2', title: '2 - La marsa, Tunis' },
  ];
  static premises: Premise[] = [
    {
      id: 'P1B2L3',
      property: 'P1B2',
      address: 'El Aouina, Tunis, residence les roses',
      name: '',
      type: 'Magasin',
      size: '5 pieces',
    },
    {
      id: 'P1B2L1',
      property: 'P1B2',
      address: 'La marsa, Tunis, residence les palmiers etage 3',
      name: '',
      type: 'Villa',
      size: '7 pieces',
    },
  ];

  static premisesOptions: SearchResult[] = [
    { id: '1', title: '1 - El Aouina, Tunis, residence les roses' },
    { id: '2', title: '2 - La marsa, Tunis, residence les palmiers etage 3' },
  ];

  static filterTenantsOptions: SearchResult[] = [
    { id: '1', title: 'Tous les locataires' },
    { id: '2', title: 'Liste des retardataires' },
  ];

  static premiseTypeOptions: SearchResult[] = [
    { id: '1', title: 'Villa' },
    { id: '2', title: 'Apart' },
    { id: '2', title: 'Magasin' },
  ];

  static tenants: Tenant[] = [
    {
      id: '1',
      aggrementId: '#66A88',
      firstname: 'Ahmed',
      lastname: 'Ben Salem',
      cin: '18537853256',
      country: 'TN',
      phonenumber: '55317899',
      local: 'P1B2L5',
      createdAt: '21/11/2024',
    },
    {
      id: '2',
      aggrementId: '#41A28',
      firstname: 'Mohamed',
      lastname: 'Ben Abed',
      cin: '18537853256',
      country: 'TN',
      phonenumber: '55317899',
      local: 'P1B2L4',
      createdAt: '20/10/2024',
    },
  ];
  static tenantsOptions: SearchResult[] = [
    { id: '1', title: '1 - Ahmed Ben Salem' },
    { id: '2', title: '2 - Mohamed Ben Abed' },
  ];

  static aggrements: Aggrement[] = [
    {
      id: '#66E23',
      idTenant: 'MR Flen Ben foulen',
      idPremise: 'P1B2L6',
      startDate: '25/07/2025 - 25/11/2026',
      endDate: '25/06/2025',
      montant: '850',
    },
    {
      id: '#23A45',
      idTenant: 'MR Flen Ben foulen',
      idPremise: 'P2B3L1',
      startDate: '25/07/2025 - 25/11/2028',
      endDate: '25/05/2025',
      montant: '850',
    },
  ];
}
