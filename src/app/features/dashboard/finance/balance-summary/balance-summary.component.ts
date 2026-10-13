import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Agreement } from '@dashboard/agreement/entity/agreement';
import { Apartment } from '@dashboard/apartment/entity/apartment';
import { Owner } from '@dashboard/owner/entity/owner';
import { Property } from '@dashboard/property/entity/property';
import { FinancialBalance } from '@dashboard/payment/entity/financial-balance';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { PaymentMapper } from '@dashboard/payment/mappers/payment-mapper';
import { PaymentService } from '@dashboard/payment/service/payment.service';
import { SearchResult } from '@shared/search-input/search-input.component';

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
    { id: 'check', title: 'Par Chéque' },
    { id: 'transfer', title: 'Virement Bancaire' },
    { id: 'deposit', title: 'Versement Bancaire' },
  ];

  paymentTypeSearchValue: SearchResult = { id: 'all', title: 'Tout' };
  paymentTypes: SearchResult[] = [
    { id: 'all', title: 'Tout' },
    { id: 'income', title: 'Recettes' },
    { id: 'expense', title: 'Dépenses' },
    { id: 'income_bank', title: 'Recettes bancaires' },
    { id: 'expense_bank', title: 'Dépenses bancaires' },
    { id: 'expense_agency', title: "Dépenses d'agence" },
    { id: 'income_agency', title: "Recettes d'agence" },
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
      paymentMethod: new FormControl('all'),
      type: new FormControl('all'),
      ownerId: new FormControl(''),
      propertyId: new FormControl(''),
      agreementId: new FormControl(''),
      apartmentId: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.setDefaultRentStartDateAndRentEndDate();
    this.getFinancialBalance();
  }

  getPaymentTypeTitle(type: string) {
    return (
      {
        income: 'Recettes',
        expense: 'Dépenses',
        income_bank: 'Recettes bancaires',
        expense_bank: 'Dépenses bancaires',
        expense_agency: "Dépenses d'agence",
        income_agency: "Recettes d'agence",
      }[type] ?? ''
    );
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
  onStartDateChange($event: Date) {
    this.filtersFormGroup
      .get('startDate')
      ?.setValue($event.toISOString().split('T')[0]);
  }

  onSelectedPaymentMethodTypeSearchItem(event: SearchResult) {
    this.filtersFormGroup.get('paymentMethod')?.setValue(event.id);
  }

  onSelectedPaymentTypeSearchItem(event: SearchResult) {
    this.filtersFormGroup
      .get('type')
      ?.setValue(event.id === 'all' ? 'all' : event.id);
  }

  searchOwnerValue: string = '';
  searchPropertyValue: string = '';
  searchAgreementValue: string = '';
  searchApartmentValue: string = '';

  onSelectedOwnerSearchItem(owner: Owner | undefined) {
    this.filtersFormGroup.get('ownerId')?.setValue(owner?.id ?? '');
  }

  onSelectedPropertySearchItem(property: Property | undefined) {
    this.filtersFormGroup.get('propertyId')?.setValue(property?.id ?? '');
  }

  onSelectedAgreementSearchItem(agreement: Agreement | undefined) {
    this.filtersFormGroup.get('agreementId')?.setValue(agreement?.id ?? '');
  }

  onSelectedApartmentSearchItem(apartment: Apartment | undefined) {
    this.filtersFormGroup.get('apartmentId')?.setValue(apartment?.id ?? '');
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
    if (this.filtersFormGroup.get('type')?.value === 'all') {
      this.filtersFormGroup
        .get('type')
        ?.setValue(
          'expense,income,expense_agency,income_agency,expense_bank,income_bank',
        );
    }

    const params = {
      filterType: 'AND',
      paymentMethod: this.filtersFormGroup.get('paymentMethod')?.value,
      type: this.filtersFormGroup.get('type')?.value,
      page: `${this.page}`,
      limit: `${this.pageSize}`,
      ...(this.filtersFormGroup.get('startDate')?.value && {
        startDate: this.filtersFormGroup.get('startDate')?.value,
      }),
      ...(this.filtersFormGroup.get('endDate')?.value && {
        endDate: this.filtersFormGroup.get('endDate')?.value,
      }),

      ...(this.filtersFormGroup.get('ownerId')?.value && {
        ownerId: this.filtersFormGroup.get('ownerId')?.value,
      }),
      ...(this.filtersFormGroup.get('propertyId')?.value && {
        propertyId: this.filtersFormGroup.get('propertyId')?.value,
      }),
      ...(this.filtersFormGroup.get('agreementId')?.value && {
        agreementId: this.filtersFormGroup.get('agreementId')?.value,
      }),
      ...(this.filtersFormGroup.get('apartmentId')?.value && {
        apartmentId: this.filtersFormGroup.get('apartmentId')?.value,
      }),
    };
    const queryString = new URLSearchParams(params).toString();
    this.paymentService.getFinancialOperations(`?${queryString}`).subscribe({
      next: (value) => {
        this.isLoadingFetchingPayments = false;

        this.financialBalance = PaymentMapper.mapFinancialBalance(value.body);
        this.netBalance = this.financialBalance.netBalance;
        this.totalExpense = this.financialBalance.totalExpense;
        this.totalIncome = this.financialBalance.totalIncome;
        this.totalLength = value.body.totalPayment ?? 0;
      },
      error: () => {
        // stop the skeleton; the empty state is shown instead
        this.isLoadingFetchingPayments = false;
      },
    });
  }
}
