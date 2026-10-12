import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinanceRoutingModule } from './finance-routing.module';
import { PaymentFormsModule } from '@dashboard/payment/payment-forms.module';
import { SharedModule } from '@shared/shared.module';
import { FinanceComponent } from './finance.component';
import { BalanceSummaryComponent } from './balance-summary/balance-summary.component';
import { SearchInputModule } from '@shared/search-input/search-input.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DateRangePickerModule } from '@shared/form-inputs/date-range-picker/date-range-picker.module';
import { AgencyPaymentListComponent } from './agency/agency-payment-list/agency-payment-list.component';
import { BankPaymentListComponent } from './bank/bank-payment-list/bank-payment-list.component';
import { UpsertAgencyExpenseComponent } from './agency/upsert-agency-expense/upsert-agency-expense.component';
import { UpsertAgencyIncomeComponent } from './agency/upsert-agency-income/upsert-agency-income.component';
import { UpsertBankIncomeComponent } from './bank/upsert-bank-income/upsert-bank-income.component';
import { UpsertBankExpenseComponent } from './bank/upsert-bank-expense/upsert-bank-expense.component';
import { AgencyPaymentDetailsComponent } from './agency/agency-payment-details/agency-payment-details.component';
import { BankPaymentDetailsComponent } from './bank/bank-payment-details/bank-payment-details.component';

@NgModule({
  declarations: [
    FinanceComponent,
    BalanceSummaryComponent,
    AgencyPaymentListComponent,
    BankPaymentListComponent,
    UpsertAgencyExpenseComponent,
    UpsertAgencyIncomeComponent,
    UpsertBankIncomeComponent,
    UpsertBankExpenseComponent,
    BankPaymentDetailsComponent,
    AgencyPaymentDetailsComponent,
  ],
  imports: [
    CommonModule,
    FinanceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SearchInputModule,
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    DateRangePickerModule,
    PaymentFormsModule,
    SharedModule,
  ],
})
export class FinanceModule {}
