import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { UpsertPaymentComponent } from './presentation/upsert-payment/upsert-payment.component';
import { PaymentDetailsComponent } from './presentation/payment-details/payment-details.component';
import { PaymentListComponent } from './presentation/payment-list/payment-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DateRangePickerModule } from '@shared/form-inputs/date-range-picker/date-range-picker.module';
import { SearchInputModule } from '@shared/search-input/search-input.module';

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
    SearchInputModule,
    DateRangePickerModule,
  ],
})
export class PaymentModule {}
