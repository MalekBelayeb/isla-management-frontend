import { environment } from 'src/environments/environment';

export const defaultSearchLimit = 5;

export const apartmentPrefix = 'Apt-'
export const propertyPrefix = 'Prop-'
export const agreementPrefix = 'Agr-'

export const conts = {
  getOwnerUrl: `${environment.url}/owner`,
  createPropertyUrl: `${environment.url}/property`,
  updatePropertyUrl: `${environment.url}/property`,
  deletePropertyUrl: `${environment.url}/property`,
  getPropertyUrl: `${environment.url}/property`,

  createApartmentUrl: `${environment.url}/apartment`,
  updateApartmentUrl: `${environment.url}/apartment`,
  getApartmentUrl: `${environment.url}/apartment`,
  deleteApartmentUrl: `${environment.url}/apartment`,

  createTenantUrl: `${environment.url}/tenant`,
  updateTenantUrl: `${environment.url}/tenant`,
  getTenantUrl: `${environment.url}/tenant`,
  deleteTenantUrl: `${environment.url}/tenant`,

  createAgreementUrl: `${environment.url}/agreement`,
  updateAgreementUrl: `${environment.url}/agreement`,
  getAgreementUrl: `${environment.url}/agreement`,
  deleteAgreementUrl: `${environment.url}/agreement`,

  createPaymentUrl: `${environment.url}/payment`,
  updatePaymentUrl: `${environment.url}/payment`,
  deletePaymentUrl: `${environment.url}/payment`,
  getPaymentUrl: `${environment.url}/payment`,
  getFinancialBalanceUrl: `${environment.url}/payment/balance`,
};
