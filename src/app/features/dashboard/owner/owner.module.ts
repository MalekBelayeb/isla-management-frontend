import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OwnerRoutingModule } from './owner-routing.module';
import { OwnerComponent } from './owner.component';
import { OwnersListComponent } from './presentation/owners-list/owners-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchInputModule } from '@shared/search-input/search-input.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { UpsertOwnerComponent } from './presentation/upsert-owner/upsert-owner.component';
import { OwnerDetailsComponent } from './presentation/owner-details/owner-details.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [
    OwnerComponent,
    OwnersListComponent,
    UpsertOwnerComponent,
    OwnerDetailsComponent,
  ],
  imports: [
    CommonModule,
    OwnerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    SearchInputModule,
  ],
  exports: [UpsertOwnerComponent],
})
export class OwnerModule {}
