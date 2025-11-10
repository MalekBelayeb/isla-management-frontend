import { Injectable } from '@angular/core';
import { Property } from '@property/entity/property';
import { PropertyDetails } from '../entity/property-details';

@Injectable({ providedIn: 'root' })
export class PropertyMapper {
  static mapPropertyDetails(data: any): PropertyDetails {
    return {
      id: data.id,
      address: data.address,
      type: data.type,
      owner: `${data.owner.gender == 'M' ? 'Mr' : 'Mme'}  ${data.owner.firstname} ${data.owner.lastname}`,
      ownerId: data.owner.id,
      apartments: [],
    };
  }
  static mapProperty(data: any): Property {
    return {
      id: data.id,
      matricule: data.matricule,
      address: data.address,
      type: data.type,
      owner: `${data.owner.gender == 'M' ? 'Mr' : 'Mme'}  ${data.owner.firstname} ${data.owner.lastname}`,
      nbApartments: data._count.apartments ?? 0,
      apartments: [],
    };
  }
  static mapProperties(data: any[]): Property[] {
    return data.map((item): Property => {
      return this.mapProperty(item);
    });
  }
}
