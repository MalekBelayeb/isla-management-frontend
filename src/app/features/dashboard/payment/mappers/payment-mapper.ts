import { Injectable } from '@angular/core';
import { Payment } from '../entity/payment';
import { PaymentDetails } from '../entity/payment-details';
import { FinancialBalance } from '../entity/financial-balance';

@Injectable({ providedIn: 'root' })
export class PaymentMapper {
  static mapPaymentDetails(data: any): PaymentDetails {
    return {
      id: data.id,
      agreement: `${data.agreement.matricule}`,
      apartment: `${data.agreement.apartment.matricule} - ${data.agreement.apartment.type} - ${data.agreement.apartment.address}`,
      amount: data.amount,
      method: data.method,
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
        agreement: `${item.agreement.matricule}`,
        apartment: `${item.agreement.apartment.matricule} - ${item.agreement.apartment.type} - ${item.agreement.apartment.address}`,
        amount: item.amount,
        method: item.method,
        payementFrequency: `${item.agreement.paymentFrequency}`,
        tenant: `${item.agreement.tenant.gender == 'M' ? 'Mr' : 'Mme'} - ${item.agreement.tenant.fullname} `,
        type: item.type,
        category: item.category,
        paymentDate: item.paymentDate,
        createdAt: item.createdAt,
      };
    });
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
