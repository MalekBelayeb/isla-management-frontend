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
      matriculeProperty: data.property?.matricule,
      payementFrequency:
        DataTypes.paymentFrequencyTypeList.find(
          (frequency) => frequency.id === data.agreement?.paymentFrequency,
        )?.title ?? '-',
      tenant: data.agreement
        ? `${data.agreement?.tenant?.gender == 'M' ? 'Mr' : 'Mme'} - ${data.agreement?.tenant?.fullname} `
        : '-',
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
        ? `${data.agreement?.apartment?.property?.owner?.gender == 'M' ? 'Mr' : 'Mme'} - ${data.agreement?.apartment?.property?.owner?.fullname}`
        : data.property
          ? `${data.property?.owner?.gender == 'M' ? 'Mr' : 'Mme'} - ${data.property?.owner?.fullname}`
          : '-',
      property: data.agreement
        ? `${propertyPrefix}${data.agreement?.apartment?.property?.matricule} - ${data.agreement?.apartment?.property?.address}`
        : data.property
          ? `${propertyPrefix}${data.property?.matricule} - ${data.property?.address}`
          : '-',
    };
  }
  static mapPayments(data: any[]): Payment[] {
    return data.map((item): Payment => {
      return {
        id: item.id,
        agreement: item.agreement
          ? `${agreementPrefix}${item.agreement?.matricule}`
          : '-',
        apartment: item.agreement
          ? `${apartmentPrefix}${item.agreement?.apartment?.matricule} - ${item.agreement?.apartment?.type} - ${item.agreement?.apartment?.address}`
          : '-',
        amount: fixDecimals(item.amount, 3),
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
          ? `${item.agreement?.apartment?.property?.owner?.gender == 'M' ? 'Mr' : 'Mme'} - ${item.agreement?.apartment?.property?.owner?.fullname}`
          : item.property
            ? `${item.property?.owner?.gender == 'M' ? 'Mr' : 'Mme'} - ${item.property?.owner?.fullname}`
            : '-',
        property: item.agreement
          ? `${propertyPrefix}${item.agreement?.apartment?.property?.matricule} - ${item.agreement?.apartment?.property?.address}`
          : item.property
            ? `${propertyPrefix}${item.property?.matricule} - ${item.property?.address}`
            : '-',
        method:
          DataTypes.paymentMethodTypeList.find(
            (method) => method.id === item.method,
          )?.title ?? '-',
        payementFrequency:
          DataTypes.paymentFrequencyTypeList.find(
            (frequency) => frequency.id === item.agreement?.paymentFrequency,
          )?.title ?? '-',
        tenant: item.agreement
          ? `${item.agreement?.tenant?.gender == 'M' ? 'Mr' : 'Mme'} - ${item.agreement?.tenant?.fullname}`
          : '-',
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

    return (
      `${
        DataTypes.incomePaymentCategoryList.find(
          (category) => category.id === item.category,
        )?.title ?? ''
      } pour ${apartmentPrefix}${item.agreement?.apartment?.matricule ?? ''} - ${item.agreement?.apartment?.address ?? ''}` ??
      ''
    );
  }

  static mapFinancialBalance(data: any): FinancialBalance {
    console.log(data);
    return {
      netBalance: fixDecimals(data.netBalance, 3),
      totalExpense: fixDecimals(data.totalExpense, 3),
      totalIncome: fixDecimals(data.totalIncome, 3),
      ...(data.profit && {
        profit: {
          grossProfit: fixDecimals(data.profit.grossProfit, 3),
          profitInPercentage: fixDecimals(data.profit.profitInPercentage, 3),
          profitWithTax: fixDecimals(data.profit.profitWithTax, 3),
          taxAmount: fixDecimals(data.profit.taxAmount, 3),
        },
      }),
      payments: this.mapPayments(data.payments),
    };
  }
}
