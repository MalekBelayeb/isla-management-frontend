import { Injectable } from '@angular/core';
import { LatePayerTenant } from '../entity/late-payer-tenant';
import { apartmentPrefix } from 'src/app/variables/consts';
import { AgreeementMapper } from '@dashboard/agreement/mappers/agreement.mapper';
import { ApartmentMapper } from '@dashboard/apartment/mappers/apartment-mapper';

@Injectable({ providedIn: 'root' })
export class LatePayerTenantMapper {
  private getAgreement(item: any) {
    return item.agreements.length > 0 ? item.agreements[0] : undefined;
  }

  private getPayment(item: any) {
    return item.agreements.length > 0
      ? item.agreements[0].payments.length > 0
        ? item.agreements[0].payments[0]
        : undefined
      : undefined;
  }

  mapLatePayerTenants(data: any[]): LatePayerTenant[] {
    return data.map((item): LatePayerTenant => {
      const agreement = this.getAgreement(item);
      const payment = this.getPayment(item);
      return {
        id: item.id,
        matricule: item.matricule,
        address: item.address,
        cin: item.cin,
        firstname: item.firstname,
        job: item.job,
        fullname: `${item.gender == 'M' ? 'Mr' : 'Mme'} ${item.firstname} ${item.lastname}`,
        societyName: `Sté ${item.societyName}`,
        lastname: item.lastname,
        nationality: item.nationality,
        phoneNumber: item.phoneNumber,
        createdAt: item.createdAt,
        tenantType: item.type,
        lastPaymentDate: payment ? payment.createdAt : '',
        agreementStartDate: agreement
          ? new Date(agreement.startDate)
          : undefined,
        apartment: agreement
          ? ApartmentMapper.mapApartmentDetails(agreement.apartment)
          : undefined,
        agreement: AgreeementMapper.mapAgreementDetails(agreement),
        paymentDelay: item.paymentDelay,
        overdueAmount: item.overdueAmount,
      };
    });
  }
}
