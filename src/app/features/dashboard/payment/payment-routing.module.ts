import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentComponent } from './payment.component';
import { UpsertIncomePaymentComponent } from './presentation/upsert-income-payment/upsert-income-payment.component';
import { PaymentDetailsComponent } from './presentation/payment-details/payment-details.component';
import { IncomePaymentListComponent } from './presentation/income-payment-list/income-payment-list.component';
import { ExpensePaymentListComponent } from './presentation/expense-payment-list/expense-payment-list.component';
import { UpsertExpensePaymentComponent } from './presentation/upsert-expense-payment/upsert-expense-payment.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentComponent,
    children: [
      {
        path: '',
        redirectTo: 'income-payments',
        pathMatch: 'full',
      },
      {
        path: 'income-payments',
        component: IncomePaymentListComponent,
      },
      {
        path: 'expense-payments',
        component: ExpensePaymentListComponent,
      },
      {
        path: 'create-expense-payment',
        component: UpsertExpensePaymentComponent,
      },
      {
        path: 'create-income-payment',
        component: UpsertIncomePaymentComponent,
      },
      {
        path: 'create-income-payment/:idTenant',
        component: UpsertIncomePaymentComponent,
      },
      {
        path: 'payment-details/:id',
        component: PaymentDetailsComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentRoutingModule {}
