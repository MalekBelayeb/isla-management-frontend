import { SearchResult } from '@shared/search-input/search-input.component';

export class DataTypes {
  static propertiesType = [
    {
      id: 'immeuble',
      title: 'Immeuble',
    },
    {
      id: 'appartement',
      title: 'Appartement',
    },
    {
      id: 'magasin',
      title: 'Magasin',
    },
    {
      id: 'depot',
      title: 'Depot',
    },
    {
      id: 'studio',
      title: 'Studio',
    },
    {
      id: 'villa',
      title: 'Villa',
    },
    {
      id: 'duplex',
      title: 'Duplex',
    },
    {
      id: 'terrain',
      title: 'Terrain',
    },
    {
      id: 'fond_de_commerce',
      title: 'Fond de commerce',
    },
    {
      id: 'usine',
      title: 'Usine',
    },
  ];

  static apartmentsType = [
    {
      id: 'appartement',
      title: 'Appartement',
    },
    {
      id: 'studio',
      title: 'Studio',
    },
    {
      id: 'cave',
      title: 'Cave',
    },
    {
      id: 'etage_de_villa',
      title: 'Etage de villa',
    },
    {
      id: 'magasin',
      title: 'Magasin',
    },
    {
      id: 'depot',
      title: 'depot',
    },
  ];

  static apartmentStatusType = [
    {
      id: 'all',
      title: 'Tous (Loué et non loué)',
    },
    {
      id: 'rented',
      title: 'Loué',
    },
    {
      id: 'notRented',
      title: 'Non loué',
    },
  ];

  static ownerTypeList: SearchResult[] = [
    { id: 'natural', title: 'P. Morale' },
    { id: 'legal', title: 'P. Physique' },
  ];

  static genderTypeList: SearchResult[] = [
    { id: 'M', title: 'Homme' },
    { id: 'F', title: 'Femme' },
  ];

  static nationalityTypeList: SearchResult[] = [
    { id: 'tn', title: 'TN - Tunisie' },
    { id: 'dz', title: 'DZ - Algérie' },
    { id: 'ly', title: 'LY - Lybie' },
    { id: 'others', title: 'Autres' },
  ];

  static paymentFrequencyTypeList: SearchResult[] = [
    { id: 'MONTHLY', title: 'Mensuel' },
    /*{ id: 'DAILY', title: 'Quotidien' },
    { id: 'QUARTERLY', title: 'Trimestriel' },
    { id: 'YEARLY', title: 'Annuel' },*/
  ];

  static paymentMethodTypeList: SearchResult[] = [
    { id: 'cash', title: 'Argent Liquide' },
    { id: 'transfer', title: 'Virement Bancaire' },
    { id: 'check', title: 'Par Chéque' },
  ];

  static incomePaymentCategoryList: SearchResult[] = [
    { id: 'rent', title: 'Loyer' },
    { id: 'others', title: 'Autres' },
  ];


  static expensePaymentCategoryList: SearchResult[] = [
    { id: 'cleaning_fees', title: 'Frais de nettoyage' },
    { id: 'utility_payments', title: 'Charges (eau, électricité, gaz, etc.)' },
    { id: 'deposit', title: 'Caution (Dépôt de garantie)' },
    { id: 'agency_fees', title: "Frais d'agence" },
    { id: 'maintenance_fees', title: "Frais d'entretien" },
    { id: 'furniture_rental_fees', title: 'Location de mobilier' },
    { id: 'home_insurance_payment', title: 'Assurance habitation' },
    { id: 'others', title: 'Autres' },

  ];

  static paymentTypeList: SearchResult[] = [
    { id: 'income', title: 'Recette' },
    { id: 'expense', title: 'Dépense' },
  ];

  static statusTenantList: SearchResult[] = [
    { id: 'all', title: 'Tous' },
    { id: 'latePayers', title: 'Liste des retardataires' },
  ];

  static agreementStatusTypeList: SearchResult[] = [
    { id: 'all', title: 'Tous' },
    { id: 'active', title: 'Valide' },
    { id: 'expired', title: 'Expiré' },
    { id: 'suspended', title: 'Suspendu' },
  ];
}
