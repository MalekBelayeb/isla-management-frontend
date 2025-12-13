import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentComponent } from './payment.component';
import { PaymentListComponent } from './presentation/payment-list/payment-list.component';
import { UpsertPaymentComponent } from './presentation/upsert-payment/upsert-payment.component';
import { PaymentDetailsComponent } from './presentation/payment-details/payment-details.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentComponent,
    children: [
      {
        path: '',
        redirectTo: 'all-payments',
        pathMatch: 'full',
      },
      {
        path: 'all-payments',
        component: PaymentListComponent,
      },
      {
        path: 'create-payment',
        component: UpsertPaymentComponent,
      },
      {
        path: 'create-payment/:idTenant',
        component: UpsertPaymentComponent,
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
