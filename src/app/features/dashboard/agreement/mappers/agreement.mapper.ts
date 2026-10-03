import { Injectable } from '@angular/core';
import { Agreement } from '../entity/agreement';
import { AgreementDetails } from '../entity/agreement-details';
import { DataTypes } from '@models/data';
import {
  agreementPrefix,
  apartmentPrefix,
  propertyPrefix,
} from 'src/app/variables/consts';
import { GetOwnerDetailsMapper } from '@dashboard/owner/mappers/get-owner-details';
import { PropertyMapper } from '@dashboard/property/mappers/property-mapper';
import { TenantMapper } from '@dashboard/tenant/mappers/tenant-mapper';
import { ApartmentMapper } from '@dashboard/apartment/mappers/apartment-mapper';

@Injectable({ providedIn: 'root' })
export class AgreeementMapper {
  constructor(private tenantMapper: TenantMapper) {}
  // Static: TenantMapper uses it, and injecting AgreeementMapper there
  // would create a TenantMapper <-> AgreeementMapper DI cycle (NG0200)
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
      nbDaysOfTolerance: data.nbDaysOfTolerance,
      deposit: data.deposit,
      documentUrl: data.documentUrl,
      firstDayOfPayment: data.firstDayOfPayment,
      notes: data.notes,
      apartment: data.apartment
        ? ApartmentMapper.mapApartmentDetails(data.apartment)
        : undefined,
      tenant: data.tenant
        ? TenantMapper.mapTenantDetails(data.tenant)
        : undefined,
      owner: data.apartment?.property?.owner
        ? GetOwnerDetailsMapper.fromResponse(data.apartment?.property?.owner)
        : undefined,
      property: data.apartment?.property
        ? PropertyMapper.mapPropertyDetails(data.apartment?.property)
        : undefined,
    };
  }
  mapAgreements(data: any[]): Agreement[] {
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
        owner: GetOwnerDetailsMapper.fromResponse(
          item.apartment?.property?.owner,
        ),
        property: PropertyMapper.mapPropertyDetails(item.apartment?.property),
        nbDaysOfTolerance: item.nbDaysOfTolerance,
        apartment: ApartmentMapper.mapApartmentDetails(item.apartment),
        tenant: TenantMapper.mapTenantDetails(item.tenant),
      };
    });
  }
}
