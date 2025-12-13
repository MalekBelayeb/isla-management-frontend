import { Injectable } from '@angular/core';
import { TenantDetails } from '../entity/tenant-details';
import { Tenant, TenantStatusType } from '../entity/tenant';
import { AgreeementMapper } from '@dashboard/agreement/mappers/agreement.mapper';

@Injectable({ providedIn: 'root' })
export class TenantMapper {
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

  mapTenantDetails(data: any): TenantDetails {
    return {
      id: data.id,
      matricule: data.matricule,
      address: data.address,
      cin: data.cin,
      firstname: data.firstname,
      gender: data.gender,
      email: data.email,
      job: data.job,
      lastname: data.lastname,
      fullname: `${data.gender == 'M' ? 'Mr' : 'Mme'} ${data.firstname} ${data.lastname}`,
      nationality: data.nationality,
      phoneNumber: data.phoneNumber,
      createdAt: data.createdAt,
      agreement:
        data.agreements?.length > 0
          ? AgreeementMapper.mapAgreementDetails(data.agreements[0])
          : undefined,
    };
  }
  mapTenants(data: any[]): Tenant[] {
    return data.map((item): Tenant => {
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
        lastname: item.lastname,
        nationality: item.nationality,
        phoneNumber: item.phoneNumber,
        createdAt: item.createdAt,
        lastPaymentDate: payment ? payment.createdAt : '',
        agreementExpireDate: agreement
          ? new Date(agreement.expireDate)
          : undefined,
        agreementStartDate: agreement
          ? new Date(agreement.startDate)
          : undefined,
        apartment: agreement
          ? `${agreement.apartment.matricule} - ${agreement.apartment.type} - ${agreement.apartment.address}`
          : '',
        agreement: agreement ? `${agreement.matricule}` : '',

        status: item.status ?? '',
      };
    });
  }
}
