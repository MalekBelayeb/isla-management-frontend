import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApartmentRoutingModule } from './apartment-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { UpsertApartmentComponent } from './presentation/upsert-apartment/upsert-apartment.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ApartmentListComponent } from './presentation/apartment-list/apartment-list.component';
import { SearchAutocompleteInputModule } from '@shared/searchable-autocomplete-inputs/search-autocomple-input-module';
import { ApartmentDetailsComponent } from './presentation/apartment-details/apartment-details.component';
import { ApartmentComponent } from './apartment.component';

@NgModule({
  declarations: [
    ApartmentComponent,
    UpsertApartmentComponent,
    ApartmentListComponent,
    ApartmentDetailsComponent,
  ],
  imports: [
    CommonModule,
    ApartmentRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    SearchAutocompleteInputModule,
  ],
})
export class ApartmentModule {}
