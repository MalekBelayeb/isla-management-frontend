import { Injectable } from '@angular/core';
import { Agreement } from '../entity/agreement';
import { AgreementDetails } from '../entity/agreement-details';
import { DataTypes } from '@models/data';
import {
  agreementPrefix,
  apartmentPrefix,
  propertyPrefix,
} from 'src/app/variables/consts';

@Injectable({ providedIn: 'root' })
export class AgreeementMapper {
  static mapAgreementDetails(data: any): AgreementDetails {
    return {
      id: data.id,
      matricule: `${agreementPrefix}${data.matricule}`,
      status: data.status,
      paymentFrequency:
        DataTypes.paymentFrequencyTypeList.find(
          (frequency) => frequency.id === data.paymentFrequency,
        )?.title ?? '',
      rentAmount: data.rentAmount,
      startDate: data.startDate,
      createdAt: data.createdAt,
      signedAt: data.signedAt,
      apartment: `${apartmentPrefix}${data.apartment?.matricule} - ${data.apartment?.type} - ${data.apartment?.address}`,
      apartmentId: data.apartment?.id,
      nbDaysOfTolerance: data.nbDaysOfTolerance,
      deposit: data.deposit,
      documentUrl: data.documentUrl,
      firstDayOfPayment: data.firstDayOfPayment,
      notes: data.notes,
      tenant: `${data.tenant?.gender == 'M' ? 'Mr' : 'Mme'} ${data.tenant?.fullname}`,
      owner: `${data.apartment?.property?.owner?.gender == 'M' ? 'Mr' : 'Mme'} ${data.apartment?.property?.owner?.fullname ?? ''}`,
      property: `${propertyPrefix}${data.apartment?.property?.matricule} - ${data.apartment?.property?.address}`,
      tenantId: data.tenant?.id,
    };
  }
  static mapAgreements(data: any[]): Agreement[] {
    return data.map((item): Agreement => {
      return {
        id: item.id,
        matricule: `${agreementPrefix}${item.matricule}`,
        status: item.status,
        paymentFrequency:
          DataTypes.paymentFrequencyTypeList.find(
            (frequency) => frequency.id === item.paymentFrequency,
          )?.title ?? '',
        rentAmount: item.rentAmount,
        startDate: item.startDate,
        createdAt: item.createdAt,
        signedAt: item.signedAt,
        owner: `${item.apartment?.property?.owner?.gender == 'M' ? 'Mr' : 'Mme'} ${item.apartment?.property?.owner?.fullname ?? ''}`,
        property: `${propertyPrefix}${item.apartment?.property?.matricule} - ${item.apartment?.property?.address}`,
        nbDaysOfTolerance: item.nbDaysOfTolerance,
        apartment: `${apartmentPrefix}${item.apartment.matricule} - ${item.apartment.type} - ${item.apartment.address}`,
        tenant: `${item.tenant.gender == 'M' ? 'Mr' : 'Mme'} ${item.tenant.fullname}`,
      };
    });
  }
}
