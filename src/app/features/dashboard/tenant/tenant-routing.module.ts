import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantComponent } from './tenant.component';
import { TenantsListComponent } from './presentation/tenants-list/tenants-list.component';
import { TenantDetailsComponent } from './presentation/tenant-details/tenant-details.component';
import { UpsertTenantComponent } from './presentation/upsert-tenant/upsert-tenant.component';

const routes: Routes = [
  {
    path: '',
    component: TenantComponent,
    children: [
      {
        path: '',
        redirectTo: 'all-tenants',
        pathMatch: 'full',
      },
      {
        path: 'all-tenants',
        component: TenantsListComponent,
      },
      {
        path: 'create-tenant',
        component: UpsertTenantComponent,
      },
      {
        path: 'tenant-details/:id',
        component: TenantDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TenantRoutingModule {}
