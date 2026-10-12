import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FinancialBalance } from '@dashboard/payment/entity/financial-balance';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { PaymentMapper } from '@dashboard/payment/mappers/payment-mapper';
import { PaymentService } from '@dashboard/payment/service/payment.service';
import { SearchResult } from '@shared/search-input/search-input.component';

@Component({
  selector: 'app-bank-payment-list',
  templateUrl: './bank-payment-list.component.html',
  styleUrl: './bank-payment-list.component.css',
})
export class BankPaymentListComponent implements OnInit {
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  minDate = new Date();
  bsConfig = {
    isAnimated: true,
    containerClass: 'theme-red',
  };
  filtersFormGroup: FormGroup;
  isLoadingFetchingPayments: boolean = false;

  paymentMethodTypeSearchValue: SearchResult = { id: 'all', title: 'Tout' };
  paymentMethodsType: SearchResult[] = [
    { id: 'deposit', title: 'Versement Bancaire' },
    { id: 'transfer', title: 'Virement Bancaire' },
    { id: 'check', title: 'Par Chéque' },
  ];
  paymentTypeSearchValue: SearchResult = { id: 'all', title: 'Tout' };
  paymentTypes: SearchResult[] = [
    { id: 'all', title: 'Tout' },
    { id: 'income_bank', title: 'Recettes bancaires' },
    { id: 'expense_bank', title: 'Dépenses bancaires' },
  ];
  constructor(
    private formBuilder: FormBuilder,
    private paymentService: PaymentService,
  ) {
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];
    this.filtersFormGroup = this.formBuilder.group({
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      paymentMethod: new FormControl('check,deposit,transfer'),
      type: new FormControl('income_bank,expense_bank'),
    });
  }

  ngOnInit(): void {
    this.setDefaultRentStartDateAndRentEndDate();

    this.getFinancialBalance();
  }
  financialBalance?: FinancialBalance;

  totalLength = 0;
  page = 1;
  pageSize = 10;

  pageChange(event: PageChangedEvent) {
    this.page = event.page;
    this.getFinancialBalance();
  }

  filterPayments() {
    // new criteria: restart from the first page
    this.page = 1;
    this.getFinancialBalance();
  }

  onSelectedPaymentMethodTypeSearchItem(event: SearchResult) {
    this.filtersFormGroup.get('paymentMethod')?.setValue(event.id);
  }
  onSelectedPaymentTypeSearchItem(event: SearchResult) {
    this.filtersFormGroup.get('type')?.setValue(event.id);
  }

  onStartDateChange($event: Date) {
    this.filtersFormGroup
      .get('startDate')
      ?.setValue($event.toISOString().split('T')[0]);
  }
  setDefaultRentStartDateAndRentEndDate() {
    const now = new Date();

    const startDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    ).toLocaleDateString('en-CA', {
      timeZone: 'Africa/Tunis',
    });

    const endDate = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
    ).toLocaleDateString('en-CA', {
      timeZone: 'Africa/Tunis',
    });
    this.filtersFormGroup.get('startDate')?.setValue(startDate.split('T')[0]);

    this.filtersFormGroup.get('endDate')?.setValue(endDate.split('T')[0]);
  }
  onEndDateChange($event: Date) {
    this.filtersFormGroup
      .get('endDate')
      ?.setValue($event?.toISOString().split('T')[0]);
  }
  getFinancialBalance() {
    this.isLoadingFetchingPayments = true;
    if (this.filtersFormGroup.get('paymentMethod')?.value === 'all') {
      this.filtersFormGroup
        .get('paymentMethod')
        ?.setValue('check,deposit,transfer');
    }
    if (this.filtersFormGroup.get('type')?.value === 'all') {
      this.filtersFormGroup.get('type')?.setValue('income_bank,expense_bank');
    }
    const params = {
      type: this.filtersFormGroup.get('type')?.value,
      page: `${this.page}`,
      limit: `${this.pageSize}`,
      ...(this.filtersFormGroup.get('startDate')?.value && {
        // first millisecond of the day, Tunis time (UTC+1, no DST)
        startDate: `${this.filtersFormGroup.get('startDate')?.value}T00:00:00.000+01:00`,
      }),
      ...(this.filtersFormGroup.get('endDate')?.value && {
        // last millisecond of the day, Tunis time
        endDate: `${this.filtersFormGroup.get('endDate')?.value}T23:59:59.999+01:00`,
      }),
      ...(this.filtersFormGroup.get('paymentMethod')?.value && {
        paymentMethod: this.filtersFormGroup.get('paymentMethod')?.value,
      }),
    };

    const queryString = new URLSearchParams(params).toString();
    this.paymentService.getFinancialOperations(`?${queryString}`).subscribe({
      next: (value) => {
        this.financialBalance = PaymentMapper.mapFinancialBalance(value.body);
        this.totalLength = value.body.totalPayment ?? 0;
        this.isLoadingFetchingPayments = false;
      },
      error: () => {
        // stop the skeleton rows
        this.isLoadingFetchingPayments = false;
      },
    });
  }
}
