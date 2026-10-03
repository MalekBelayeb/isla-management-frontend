import { Injectable } from '@angular/core';
import { Payment } from '../entity/payment';
import { PaymentDetails } from '../entity/payment-details';
import { FinancialBalance } from '../entity/financial-balance';
import { DataTypes } from '@models/data';
import {
  agreementPrefix,
  apartmentPrefix,
  propertyPrefix,
} from 'src/app/variables/consts';
import { fixDecimals } from '@core/helpers';
import { PaymentReceiptDetails } from '../entity/income-receipt-details';
import { AgreeementMapper } from '@dashboard/agreement/mappers/agreement.mapper';
import { ApartmentMapper } from '@dashboard/apartment/mappers/apartment-mapper';
import { GetOwnerDetailsMapper } from '@dashboard/owner/mappers/get-owner-details';
import { PropertyMapper } from '@dashboard/property/mappers/property-mapper';
import { TenantMapper } from '@dashboard/tenant/mappers/tenant-mapper';

@Injectable({ providedIn: 'root' })
export class PaymentMapper {
  static mapPaymentDetails(data: any): PaymentDetails {
    return {
      id: data.id,
      agreement: data.agreement
        ? `${agreementPrefix}${data.agreement?.matricule}`
        : '-',
      apartment: data.agreement
        ? `${apartmentPrefix}${data.agreement?.apartment?.matricule} - ${data.agreement?.apartment?.type} - ${data.agreement?.apartment?.address}`
        : '-',
      amount: data.amount,
      extraCharge: data.extraCharge,
      tva: data.tva,
      bank: data.bank,
      transferNumber: data.transferNumber,
      checkNumber: data.checkNumber,
      method:
        DataTypes.paymentMethodTypeList.find(
          (method) => method.id === data.method,
        )?.title ?? '-',
      label: data.label,
      rentStartDate: data.rentStartDate,
      rentEndDate: data.rentEndDate,
      payementFrequency:
        DataTypes.paymentFrequencyTypeList.find(
          (frequency) => frequency.id === data.agreement?.paymentFrequency,
        )?.title ?? '-',
      tenant: data.agreement
        ? TenantMapper.mapTenantDetails(data.agreement?.tenant)
        : undefined,
      type: data.type,
      category:
        data.type === 'income'
          ? (DataTypes.incomePaymentCategoryList.find(
              (category) => category.id === data.category,
            )?.title ?? '-')
          : (DataTypes.expensePaymentCategoryList.find(
              (category) => category.id === data.category,
            )?.title ?? '-'),
      notes: data.notes,
      agreementId: data.agreement?.id,
      paymentDate: data.paymentDate,
      createdAt: data.createdAt,
      owner: data.agreement
        ? GetOwnerDetailsMapper.fromResponse(
            data.agreement?.apartment?.property?.owner,
          )
        : data.property
          ? GetOwnerDetailsMapper.fromResponse(data.property?.owner)
          : undefined,
      property: data.agreement
        ? PropertyMapper.mapPropertyDetails(data.agreement?.apartment?.property)
        : data.property
          ? PropertyMapper.mapPropertyDetails(data.property)
          : undefined,
    };
  }

  static mapPaymentReceipeDetails(data: any): PaymentReceiptDetails {
    console.log(data);
    const owner = data.property?.owner
      ? GetOwnerDetailsMapper.fromResponse(data.property?.owner)
      : undefined;
    const tenant = data.agreement?.tenant
      ? TenantMapper.mapTenantDetails(data.agreement?.tenant)
      : undefined;
    const person = data.agreement ? tenant?.fullname : owner?.fullname;

    return {
      recipientName: `${person}`,
      owner: data.property?.owner
        ? GetOwnerDetailsMapper.fromResponse(data.property?.owner)
        : undefined,
      tenant: data.agreement?.tenant
        ? TenantMapper.mapTenantDetails(data.agreement?.tenant)
        : undefined,
      propertyAddress:
        data.type == 'expense'
          ? data.property?.address
          : data.agreement?.apartment?.property?.address,
      propertyNumber:
        data.type == 'expense'
          ? data.property.matricule
          : data.agreement?.apartment?.property.matricule,
      paymentLabel: data.label,
      paymentMethod: data.method,
      rentStartDate: data.rentStartDate,
      rentEndDate: data.rentEndDate,
      amountTva: ((data.amount ?? 0) * (data.tva ?? 0)) / 100,
      amount: data.amount ?? 0,
      extraCharge: data.extraCharge ?? 0,
      totalAmount:
        Number(data.amount ?? 0) +
        Number(data.extraCharge ?? 0) +
        Number(((data.amount ?? 0) * (data.tva ?? 0)) / 100),
    };
  }

  static mapPayments(data: any[]): Payment[] {
    return data.map((item): Payment => {
      return {
        id: item.id,
        agreement: item.agreement
          ? AgreeementMapper.mapAgreementDetails(item.agreement)
          : undefined,
        apartment: item.agreement
          ? ApartmentMapper.mapApartmentDetails(item.agreement?.apartment)
          : undefined,
        amount: fixDecimals(item.amount, 3),
        extraCharge: fixDecimals(item.extraCharge, 3),
        totalAmount:
          fixDecimals(item.amount, 3) + fixDecimals(item.extraCharge ?? 0, 3),
        label: item.label,
        account: item.agreement
          ? `${propertyPrefix}${item.agreement?.apartment?.property?.matricule ?? ''}`
          : item.property
            ? `${propertyPrefix}${item.property?.matricule}`
            : item.type === 'expense_agency'
              ? 'Agence'
              : '-',
        rentStartDate: item.rentStartDate,
        reason: `${this.getReason(item)} `,
        rentEndDate: item.rentEndDate,
        owner: item.agreement
          ? GetOwnerDetailsMapper.fromResponse(
              item.agreement?.apartment?.property?.owner,
            )
          : item.property
            ? GetOwnerDetailsMapper.fromResponse(item.property?.owner)
            : undefined,
        property: item.agreement
          ? PropertyMapper.mapPropertyDetails(
              item.agreement?.apartment?.property,
            )
          : item.property
            ? PropertyMapper.mapPropertyDetails(item.property)
            : undefined,
        method:
          DataTypes.paymentMethodTypeList.find(
            (method) => method.id === item.method,
          )?.title ?? '-',
        payementFrequency:
          DataTypes.paymentFrequencyTypeList.find(
            (frequency) => frequency.id === item.agreement?.paymentFrequency,
          )?.title ?? '-',
        tenant: item.agreement
          ? TenantMapper.mapTenantDetails(item.agreement?.tenant)
          : undefined,
        type: item.type,
        category:
          item.type === 'income'
            ? (DataTypes.incomePaymentCategoryList.find(
                (category) => category.id === item.category,
              )?.title ?? '')
            : (DataTypes.expensePaymentCategoryList.find(
                (category) => category.id === item.category,
              )?.title ?? ''),
        paymentDate: item.paymentDate,
        createdAt: item.createdAt,
      };
    });
  }
  static getReason(item: any) {
    if (item.label) {
      return item.label;
    }

    return `${
      DataTypes.incomePaymentCategoryList.find(
        (category) => category.id === item.category,
      )?.title ?? ''
    } pour ${apartmentPrefix}${item.agreement?.apartment?.matricule ?? ''} - ${item.agreement?.apartment?.address ?? ''}`;
  }

  static mapFinancialBalance(data: any): FinancialBalance {
    return {
      netBalance: fixDecimals(data.netBalance, 3),
      totalExpense: fixDecimals(data.totalExpense, 3),
      totalIncome: fixDecimals(data.totalIncome, 3),
      ...(data.profit && {
        profit: {
          totalIncome: fixDecimals(data.profit.totalIncome, 3),
          grossProfit: fixDecimals(data.profit.grossProfit, 3),
          profitInPercentage: fixDecimals(data.profit.profitInPercentage, 3),
          profitWithTax: fixDecimals(data.profit.profitWithTax, 3),
          taxAmount: fixDecimals(data.profit.taxAmount, 3),
        },
      }),
      payments: this.mapPayments(data.payments),
      previousPeriodNetBalance: fixDecimals(data.previousPeriodNetBalance, 3),
    };
  }
}
