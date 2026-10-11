import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { UpsertIncomePaymentComponent } from './presentation/upsert-income-payment/upsert-income-payment.component';
import { PaymentDetailsComponent } from './presentation/payment-details/payment-details.component';
import { IncomePaymentListComponent } from './presentation/income-payment-list/income-payment-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { DateRangePickerModule } from '@shared/form-inputs/date-range-picker/date-range-picker.module';
import { SearchInputModule } from '@shared/search-input/search-input.module';
import { SharedModule } from '@shared/shared.module';
import { ExpensePaymentListComponent } from './presentation/expense-payment-list/expense-payment-list.component';
import { UpsertExpensePaymentComponent } from './presentation/upsert-expense-payment/upsert-expense-payment.component';
import { ReceiptIncomePaymentComponent } from './presentation/receipt-income-payment/receipt-income-payment.component';
import { AmountInWordsPipe } from '@core/pipes/amount-in-words.pipe';
import { ReceiptExpensePaymentComponent } from './presentation/receipt-expense-payment/receipt-expense-payment.component';

@NgModule({
  declarations: [
    UpsertIncomePaymentComponent,
    UpsertExpensePaymentComponent,
    PaymentDetailsComponent,
    IncomePaymentListComponent,
    ExpensePaymentListComponent,
    ReceiptIncomePaymentComponent,
    ReceiptExpensePaymentComponent,
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
