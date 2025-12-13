import { Injectable } from '@angular/core';
import { Agreement } from '../entity/agreement';
import { AgreementDetails } from '../entity/agreement-details';
import { DataTypes } from '@models/data';

@Injectable({ providedIn: 'root' })
export class AgreeementMapper {
  static mapAgreementDetails(data: any): AgreementDetails {
    console.log('---->', data);
    return {
      id: data.id,
      matricule: data.matricule,
      status: data.status,
      paymentFrequency: data.paymentFrequency,
      rentAmount: data.rentAmount,
      startDate: data.startDate,
      expireDate: data.expireDate,
      createdAt: data.createdAt,
      signedAt: data.signedAt,
      apartment: `${data.apartment?.matricule} - ${data.apartment?.type} - ${data.apartment?.address}`,
      apartmentId: data.apartment?.id,
      nbDaysOfTolerance: data.nbDaysOfTolerance,
      deposit: data.deposit,
      documentUrl: data.documentUrl,
      firstDayOfPayment: data.firstDayOfPayment,
      notes: data.notes,
      tenant: `${data.tenant?.gender == 'M' ? 'Mr' : 'Mme'} ${data.tenant?.fullname}`,
      tenantId: data.tenant?.id,
    };
  }
  static mapAgreements(data: any[]): Agreement[] {
    return data.map((item): Agreement => {
      return {
        id: item.id,
        matricule: item.matricule,
        status: new Date(item.expireDate) > new Date() ? 'ACTIVE' : 'EXPIRED',
        paymentFrequency:
          DataTypes.paymentFrequencyTypeList.find(
            (frequency) => frequency.id === item.paymentFrequency,
          )?.title ?? '',
        rentAmount: item.rentAmount,
        startDate: item.startDate,
        expireDate: item.expireDate,
        createdAt: item.createdAt,
        signedAt: item.signedAt,
        nbDaysOfTolerance: item.nbDaysOfTolerance,
        apartment: `${item.apartment.matricule} - ${item.apartment.type} - ${item.apartment.address}`,
        tenant: `${item.tenant.gender == 'M' ? 'Mr' : 'Mme'} ${item.tenant.fullname}`,
      };
    });
  }
}
