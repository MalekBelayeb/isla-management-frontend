import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { UpsertPaymentComponent } from './presentation/upsert-payment/upsert-payment.component';
import { PaymentDetailsComponent } from './presentation/payment-details/payment-details.component';
import { PaymentListComponent } from './presentation/payment-list/payment-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { DateRangePickerModule } from '@shared/form-inputs/date-range-picker/date-range-picker.module';
import { SearchInputModule } from '@shared/search-input/search-input.module';
import { SharedModule } from '@shared/shared.module';

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
    SearchInputModule,
    DateRangePickerModule,
    SharedModule,
  ],
})
export class PaymentModule {}
