import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinanceComponent } from './finance.component';
import { BalanceSummaryComponent } from './balance-summary/balance-summary.component';
import { UpsertAgencyExpenseComponent } from './agency/upsert-agency-expense/upsert-agency-expense.component';
import { AgencyPaymentListComponent } from './agency/agency-payment-list/agency-payment-list.component';
import { BankPaymentListComponent } from './bank/bank-payment-list/bank-payment-list.component';
import { UpsertAgencyIncomeComponent } from './agency/upsert-agency-income/upsert-agency-income.component';
import { UpsertBankIncomeComponent } from './bank/upsert-bank-income/upsert-bank-income.component';
import { UpsertBankExpenseComponent } from './bank/upsert-bank-expense/upsert-bank-expense.component';
import { BankPaymentDetailsComponent } from './bank/bank-payment-details/bank-payment-details.component';
import { AgencyPaymentDetailsComponent } from './agency/agency-payment-details/agency-payment-details.component';

const routes: Routes = [
  {
    path: '',
    component: FinanceComponent,
    children: [
      {
        path: '',
        redirectTo: 'income',
        pathMatch: 'full',
      },
      {
        path: 'agency',
        component: AgencyPaymentListComponent,
      },
      {
        path: 'bank',
        component: BankPaymentListComponent,
      },
      {
        path: 'create-agency-expense',
        component: UpsertAgencyExpenseComponent,
      },
      {
        path: 'create-agency-income',
        component: UpsertAgencyIncomeComponent,
      },
      {
        path: 'create-bank-income',
        component: UpsertBankIncomeComponent,
      },
      {
        path: 'create-bank-expense',
        component: UpsertBankExpenseComponent,
      },
      {
        path: 'bank-payment-details/:id',
        component: BankPaymentDetailsComponent,
      },
      {
        path: 'agency-payment-details/:id',
        component: AgencyPaymentDetailsComponent,
      },
      {
        path: 'balance-summary',
        component: BalanceSummaryComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanceRoutingModule {}
