import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TenantRoutingModule } from './tenant-routing.module';
import { TenantComponent } from './tenant.component';
import { TenantsListComponent } from './presentation/tenants-list/tenants-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TenantDetailsComponent } from './presentation/tenant-details/tenant-details.component';
import { UpsertTenantComponent } from './presentation/upsert-tenant/upsert-tenant.component';
import { SearchInputModule } from '@shared/search-input/search-input.module';

@NgModule({
  declarations: [
    TenantComponent,
    TenantsListComponent,
    UpsertTenantComponent,
    TenantDetailsComponent,
  ],
  imports: [
    CommonModule,
    TenantRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule.forRoot(),
    SearchInputModule
  ],
})
export class TenantModule {}
