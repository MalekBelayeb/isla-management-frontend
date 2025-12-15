import { Injectable } from '@angular/core';
import { Owner } from '../entity/owner';

@Injectable({ providedIn: 'root' })
export class GetAllOwnersMapper {
  static fromResponse(data: any[]): Owner[] {
    return data.map((item): Owner => {
      console.log(item);
      return {
        id: item.id,
        cin: item.cin,
        email: item.email,
        gender: item.gender,
        matricule: item.matricule,
        name:
          item.type === 'natural'
            ? `${item.gender == 'M' ? 'Mr' : 'Mme'}  ${item.firstname} ${item.lastname}`
            : (item.society ?? ''),
        nationality: item.nationality,
        phoneNumber: item.phoneNumber,
        type: item.type == 'natural' ? 'natural' : 'legal',
        createdAt: new Date(item.createdAt),
        nbPremises: item.properties.reduce(
          (sum: number, property: any) =>
            sum + (property.apartments?.length || 0),
          0,
        ) ?? 0,
        nbProperty: item.properties?.length ?? 0,
      };
    });
  }
}
