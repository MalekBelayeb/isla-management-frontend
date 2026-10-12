import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateRangePickerModule } from '@shared/form-inputs/date-range-picker/date-range-picker.module';
import { SearchInputModule } from '@shared/search-input/search-input.module';
import { SharedModule } from '@shared/shared.module';
import { UpsertIncomePaymentComponent } from './presentation/upsert-income-payment/upsert-income-payment.component';
import { UpsertExpensePaymentComponent } from './presentation/upsert-expense-payment/upsert-expense-payment.component';
import { ReceiptIncomePaymentComponent } from './presentation/receipt-income-payment/receipt-income-payment.component';
import { ReceiptExpensePaymentComponent } from './presentation/receipt-expense-payment/receipt-expense-payment.component';

// Income/expense forms (with their receipts) used by the payment pages and by
// the finance details pages. Kept apart from PaymentModule so FinanceModule can
// import them without pulling in the payment routes.
@NgModule({
  declarations: [
    UpsertIncomePaymentComponent,
    UpsertExpensePaymentComponent,
    ReceiptIncomePaymentComponent,
    ReceiptExpensePaymentComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SearchInputModule,
    DateRangePickerModule,
    SharedModule,
  ],
  exports: [
    UpsertIncomePaymentComponent,
    UpsertExpensePaymentComponent,
    ReceiptIncomePaymentComponent,
    ReceiptExpensePaymentComponent,
  ],
})
export class PaymentFormsModule {}
