import { Payment } from './payment';

export interface FinancialBalance {
  netBalance: number;
  totalIncome: number;
  totalExpense: number;
  payments: Payment[];
}
