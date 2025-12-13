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

@NgModule({
  declarations: [
    FinanceComponent,
    ExpensesComponent,
    IncomeComponent,
    BalanceSummaryComponent,
  ],
  imports: [
    CommonModule,
    FinanceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SearchInputModule,
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
})
export class FinanceModule {}
