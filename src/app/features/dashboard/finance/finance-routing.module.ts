import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinanceComponent } from './finance.component';
import { IncomeComponent } from './income/income.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { BalanceSummaryComponent } from './balance-summary/balance-summary.component';
import { UpsertAgencyExpenseComponent } from './upsert-agency-expense/upsert-agency-expense.component';

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
        path: 'income',
        component: IncomeComponent,
      },
      {
        path: 'expenses',
        component: ExpensesComponent,
      },
      {
        path: 'create-agency-expense',
        component: UpsertAgencyExpenseComponent,
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
