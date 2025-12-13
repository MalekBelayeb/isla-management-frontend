import { Injectable } from '@angular/core';
import { ApartmentDetails } from '../entity/apartment-details';
import { DataTypes } from '@models/data';
import { Apartment } from '../entity/Apartment';

@Injectable({ providedIn: 'root' })
export class ApartmentMapper {
  static mapApartmentDetails(data: any): ApartmentDetails {
    return {
      id: data.id,
      matricule: data.matricule,
      address: data.address,
      idNumber: `Apt-${data.matricule}`,
      description: data.description,
      type: data.type,
      rooms: data.rooms,
      propertyId: data.property.id,
      createdAt: data.createdAt,
      property: `Prop-${data.property.matricule} - ${data.property.address}`,
      owner: `${data.property.owner.gender == 'M' ? 'Mr' : 'Mme'}  ${data.property.owner.fullname}`,
    };
  }
  static mapApartments(data: any[]): Apartment[] {
    return data.map((item): Apartment => {
      return {
        id: item.id,
        matricule: item.matricule,
        address: item.address,
        description: item.description,
        idNumber: `Apt-${item.matricule}`,
        type:
          DataTypes.apartmentsType.find(
            (apartmentItem) => apartmentItem.id === item.type,
          )?.title ?? '',
        rooms: item.rooms,
        createdAt: item.createdAt,
        property: `Prop-${item.property.matricule} - ${item.property.address}`,
        owner: `${item.property.owner.gender == 'M' ? 'Mr' : 'Mme'}  ${item.property.owner.fullname}`,
        rentStatus: item.rentStatus ?? '',
      };
    });
  }
}
