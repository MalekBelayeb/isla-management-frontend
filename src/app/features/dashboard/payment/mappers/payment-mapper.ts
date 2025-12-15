import { Injectable } from '@angular/core';
import { Payment } from '../entity/payment';
import { PaymentDetails } from '../entity/payment-details';
import { FinancialBalance } from '../entity/financial-balance';
import { DataTypes } from '@models/data';
import { agreementPrefix, apartmentPrefix, propertyPrefix } from 'src/app/variables/consts';

@Injectable({ providedIn: 'root' })
export class PaymentMapper {
  static mapPaymentDetails(data: any): PaymentDetails {
    return {
      id: data.id,
      agreement: `${agreementPrefix}${data.agreement.matricule}`,
      apartment: `${apartmentPrefix}${data.agreement.apartment.matricule} - ${data.agreement.apartment.type} - ${data.agreement.apartment.address}`,
      amount: data.amount,
      method: data.method,
      label: data.label,
      rentStartDate: data.rentStartDate,
      rentEndDate: data.rentEndDate,
      payementFrequency: `${data.agreement.paymentFrequency}`,
      tenant: `${data.agreement.tenant.gender == 'M' ? 'Mr' : 'Mme'} - ${data.agreement.tenant.fullname} `,
      type: data.type,
      category: data.category,
      notes: data.notes,
      agreementId: data.agreement.id,
      paymentDate: data.paymentDate,
      createdAt: data.createdAt,
    };
  }
  static mapPayments(data: any[]): Payment[] {
    return data.map((item): Payment => {
      return {
        id: item.id,
        agreement: `${agreementPrefix}${item.agreement.matricule}`,
        apartment: `${apartmentPrefix}${item.agreement.apartment.matricule} - ${item.agreement.apartment.type} - ${item.agreement.apartment.address}`,
        amount: item.amount,
        label: item.label,
        account: `${propertyPrefix}${item.agreement?.apartment?.property?.matricule ?? ''}`,
        rentStartDate: item.rentStartDate,
        reason: `${this.getReason(item)} `,
        rentEndDate: item.rentEndDate,
        method:
          DataTypes.paymentMethodTypeList.find(
            (method) => method.id === item.method,
          )?.title ?? '',
        payementFrequency:
          DataTypes.paymentFrequencyTypeList.find(
            (frequency) => frequency.id === item.agreement.paymentFrequency,
          )?.title ?? '',
        tenant: `${item.agreement.tenant.gender == 'M' ? 'Mr' : 'Mme'} - ${item.agreement.tenant.fullname} `,
        type: item.type,
        category:
          DataTypes.paymentCategoryList.find(
            (category) => category.id === item.category,
          )?.title ?? '',
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
      `${DataTypes.paymentCategoryList.find(
        (category) => category.id === item.category,
      )?.title ?? ''} pour ${apartmentPrefix}${item.agreement?.apartment?.matricule ?? ''}` ?? ''
    );
  }

  static mapFinancialBalance(data: any): FinancialBalance {
    return {
      netBalance: data.netBalance,
      totalExpense: data.totalExpense,
      totalIncome: data.totalIncome,
      payments: this.mapPayments(data.payments),
    };
  }
}
