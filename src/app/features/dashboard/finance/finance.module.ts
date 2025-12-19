import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinanceRoutingModule } from './finance-routing.module';
import { FinanceComponent } from './finance.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { IncomeComponent } from './income/income.component';
import { BalanceSummaryComponent } from './balance-summary/balance-summary.component';
import { SearchInputModule } from '@shared/search-input/search-input.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { UpsertAgencyExpenseComponent } from './upsert-agency-expense/upsert-agency-expense.component';
import { DateRangePickerModule } from '@shared/form-inputs/date-range-picker/date-range-picker.module';

@NgModule({
  declarations: [
    FinanceComponent,
    ExpensesComponent,
    IncomeComponent,
    BalanceSummaryComponent,
    UpsertAgencyExpenseComponent,
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
  ],
})
export class FinanceModule {}
