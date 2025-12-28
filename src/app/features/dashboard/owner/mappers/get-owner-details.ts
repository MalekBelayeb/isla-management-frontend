import { Injectable } from '@angular/core';
import { Owner } from '../entity/owner';
import { OwnerDetails } from '../entity/owner-details';

@Injectable({ providedIn: 'root' })
export class GetOwnerDetailsMapper {
  static fromResponse(data: any): OwnerDetails {
    return {
      id: data.id,
      cin: data.cin,
      email: data.email,
      gender: data.gender,
      society: data.society,
      taxId: data.taxId,
      matricule: data.matricule,
      fullname:
        data.type == 'natural'
          ? `${data.gender == 'M' ? 'Mr' : 'Mme'}  ${data.firstname} ${data.lastname}`
          : `${data.society}`,
      firstname: data.firstname,
      lastname: data.lastname,
      nationality: data.nationality,
      phoneNumber: data.phoneNumber,
      rib: data.rib,
      bank: data.bank,
      type: data.type == 'natural' ? 'natural' : 'legal',
      createdAt: new Date(data.createdAt),
      nbPremises: 0,
      nbProperty: 0,
    };
  }
}
