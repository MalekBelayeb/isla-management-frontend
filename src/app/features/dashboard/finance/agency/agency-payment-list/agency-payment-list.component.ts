import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FinancialBalance } from '@dashboard/payment/entity/financial-balance';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { PaymentMapper } from '@dashboard/payment/mappers/payment-mapper';
import { PaymentService } from '@dashboard/payment/service/payment.service';
import { ConfirmDialogService } from '@shared/confirm-dialog/confirm-dialog.service';
import { SearchResult } from '@shared/search-input/search-input.component';
import { ToastAlertService } from '@shared/toast-alert/toast-alert.service';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-agency-payment-list',
  templateUrl: './agency-payment-list.component.html',
  styleUrl: './agency-payment-list.component.css',
})
export class AgencyPaymentListComponent implements OnInit {
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
    { id: 'all', title: 'Tout' },
    { id: 'cash', title: 'Argent liquide' },
    { id: 'transfer,check', title: 'Banque' },
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
      paymentMethod: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.setDefaultRentStartDateAndRentEndDate();
    this.getFinancialBalance();
  }
  financialBalance?: FinancialBalance;

  onSelectedPaymentMethodTypeSearchItem(event: SearchResult) {
    this.filtersFormGroup.get('paymentMethod')?.setValue(event.id);
  }

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
      this.filtersFormGroup.get('paymentMethod')?.setValue('');
    }
    const params = {
      filterType: 'OR',
      type: 'income_agency,expense_agency',
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
