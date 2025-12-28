import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FinancialBalance } from '@dashboard/payment/entity/financial-balance';
import { PaymentMapper } from '@dashboard/payment/mappers/payment-mapper';
import { PaymentService } from '@dashboard/payment/service/payment.service';
import { ConfirmDialogService } from '@shared/confirm-dialog/confirm-dialog.service';
import { SearchResult } from '@shared/search-input/search-input.component';
import { ToastAlertService } from '@shared/toast-alert/toast-alert.service';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-balance-summary',
  templateUrl: './balance-summary.component.html',
  styleUrl: './balance-summary.component.css',
})
export class BalanceSummaryComponent implements OnInit {
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  minDate = new Date();
  bsConfig = {
    isAnimated: true,
    containerClass: 'theme-red',
  };
  netBalance: number = 0;
  totalIncome: number = 0;
  totalExpense: number = 0;
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
    private confirmDialogService: ConfirmDialogService,
    private modalService: BsModalService,
    private toastAlertService: ToastAlertService,
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

  filterPayments() {
    this.getFinancialBalance();
  }
  onStartDateChange($event: Date) {
    this.filtersFormGroup
      .get('startDate')
      ?.setValue($event.toISOString().split('T')[0]);
  }

  onSelectedPaymentMethodTypeSearchItem(event: SearchResult) {
    this.filtersFormGroup.get('paymentMethod')?.setValue(event.id);
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
      type: 'expense,income,expense_agency',
      ...(this.filtersFormGroup.get('startDate')?.value && {
        startDate: this.filtersFormGroup.get('startDate')?.value,
      }),
      ...(this.filtersFormGroup.get('endDate')?.value && {
        endDate: this.filtersFormGroup.get('endDate')?.value,
      }),
      ...(this.filtersFormGroup.get('paymentMethod')?.value && {
        paymentMethod: this.filtersFormGroup.get('paymentMethod')?.value,
      }),
    };
    const queryString = new URLSearchParams(params).toString();
    this.paymentService.getFinancialBalance(`?${queryString}`).subscribe({
      next: (value) => {
        this.isLoadingFetchingPayments = false;

        this.financialBalance = PaymentMapper.mapFinancialBalance(value.body);
        this.netBalance = this.financialBalance.netBalance;
        this.totalExpense = this.financialBalance.totalExpense;
        this.totalIncome = this.financialBalance.totalIncome;

      },
    });
  }
}
