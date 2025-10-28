import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'owner',
        pathMatch: 'full',
      },
      {
        path: 'owner',
        loadChildren: () =>
          import('./owner/owner.module').then((m) => m.OwnerModule),
      },
      {
        path: 'property',
        loadChildren: () =>
          import('./property/property.module').then((m) => m.PropertyModule),
      },
      {
        path: 'apartment',
        loadChildren: () =>
          import('./apartment/apartment.module').then((m) => m.ApartmentModule),
      },
      {
        path: 'tenant',
        loadChildren: () =>
          import('./tenant/tenant.module').then((m) => m.TenantModule),
      },
      {
        path: 'agreement',
        loadChildren: () =>
          import('./agreement/agreement.module').then((m) => m.AggrementModule),
      },
      {
        path: 'payment',
        loadChildren: () =>
          import('./payment/payment.module').then((m) => m.PaymentModule),
      },
      {
        path: 'finance',
        loadChildren: () =>
          import('./finance/finance.module').then((m) => m.FinanceModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
