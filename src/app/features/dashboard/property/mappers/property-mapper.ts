import { Injectable } from '@angular/core';
import { Property } from '@property/entity/property';
import { PropertyDetails } from '../entity/property-details';
import { propertyPrefix } from 'src/app/variables/consts';

@Injectable({ providedIn: 'root' })
export class PropertyMapper {
  static mapPropertyDetails(data: any): PropertyDetails {
    return {
      id: data.id,
      address: data.address,
      type: data.type,
      owner:
        data.owner.type === 'natural'
          ? `${data.owner.gender == 'M' ? 'Mr' : 'Mme'}  ${data.owner.firstname} ${data.owner.lastname}`
          : `${data.owner.society}`,
      ownerId: data.owner.id,
      idNumber: `${propertyPrefix}${data.matricule}`,
      createdAt: data.createdAt,
      profitInPercentage: data.profitInPercentage,
      apartments: [],
    };
  }
  static mapProperty(data: any): Property {
    return {
      id: data.id,
      matricule: data.matricule,
      address: data.address,
      idNumber: `${propertyPrefix}${data.matricule}`,
      type: data.type,
      owner:
        data.owner.type === 'natural'
          ? `${data.owner.gender == 'M' ? 'Mr' : 'Mme'}  ${data.owner.firstname} ${data.owner.lastname}`
          : `${data.owner.society}`,
      nbApartments: data.apartments?.length ?? 0,
      createdAt: data.createdAt,
      apartments: [],
    };
  }
  static mapProperties(data: any[]): Property[] {
    return data.map((item): Property => {
      return this.mapProperty(item);
    });
  }
}
