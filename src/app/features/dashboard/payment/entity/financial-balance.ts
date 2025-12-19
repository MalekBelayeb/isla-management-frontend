import { Payment } from './payment';

export interface FinancialBalance {
  netBalance: number;
  totalIncome: number;
  totalExpense: number;
  profit?: {
    grossProfit: number;
    taxAmount: number;
    profitWithTax: number;
    profitInPercentage: number;
  };
  payments: Payment[];
}
