import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { UpsertPaymentComponent } from './presentation/upsert-payment/upsert-payment.component';
import { PaymentDetailsComponent } from './presentation/payment-details/payment-details.component';
import { PaymentListComponent } from './presentation/payment-list/payment-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SearchAutocompleteInputModule } from '@shared/searchable-autocomplete-inputs/search-autocomple-input-module';
import { DateRangePickerModule } from '@shared/form-inputs/date-range-picker/date-range-picker.module';

@NgModule({
  declarations: [
    UpsertPaymentComponent,
    PaymentDetailsComponent,
    PaymentListComponent,
  ],
  imports: [
    CommonModule,
    PaymentRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    SearchAutocompleteInputModule,
    DateRangePickerModule,
  ],
})
export class PaymentModule {}
