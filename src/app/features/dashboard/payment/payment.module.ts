import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentDetailsComponent } from './presentation/payment-details/payment-details.component';
import { IncomePaymentListComponent } from './presentation/income-payment-list/income-payment-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { DateRangePickerModule } from '@shared/form-inputs/date-range-picker/date-range-picker.module';
import { SearchInputModule } from '@shared/search-input/search-input.module';
import { SharedModule } from '@shared/shared.module';
import { ExpensePaymentListComponent } from './presentation/expense-payment-list/expense-payment-list.component';
import { AmountInWordsPipe } from '@core/pipes/amount-in-words.pipe';
import { PaymentFormsModule } from './payment-forms.module';

@NgModule({
  declarations: [
    PaymentDetailsComponent,
    IncomePaymentListComponent,
    ExpensePaymentListComponent,
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
    PaymentFormsModule,
  ],
})
export class PaymentModule {}
