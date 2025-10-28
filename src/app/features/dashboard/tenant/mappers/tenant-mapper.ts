import { Injectable } from '@angular/core';

import { DataTypes } from '@models/data';
import { TenantDetails } from '../entity/tenant-details';
import { Tenant } from '../entity/tenant';

@Injectable({ providedIn: 'root' })
export class TenantMapper {
  static mapTenantDetails(data: any): TenantDetails {
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
    };
  }
  static mapTenants(data: any[]): Tenant[] {
    return data.map((item): Tenant => {
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
        apartment:
          item.agreements.length > 0
            ? `${item.agreements[0].apartment.matricule} - ${item.agreements[0].apartment.type} - ${item.agreements[0].apartment.address}`
            : '',
        agreement:
          item.agreements.length > 0 ? `${item.agreements[0].matricule}` : '',
      };
    });
  }
}
