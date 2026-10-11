import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { QueryStringBuilder } from '@core/query-string-builder/query-string-builder';
import { Agreement } from '@dashboard/agreement/entity/agreement';
import { Apartment } from '@dashboard/apartment/entity/apartment';
import { Owner } from '@dashboard/owner/entity/owner';
import { Payment } from '@dashboard/payment/entity/payment';
import { PaymentMapper } from '@dashboard/payment/mappers/payment-mapper';
import { PaymentService } from '@dashboard/payment/service/payment.service';
import { Property } from '@dashboard/property/entity/property';
import { Tenant } from '@dashboard/tenant/entity/tenant';
import { DataTypes } from '@models/data';
import { ConfirmDialogService } from '@shared/confirm-dialog/confirm-dialog.service';
import { SearchResult } from '@shared/search-input/search-input.component';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { agreementPrefix, propertyPrefix } from 'src/app/variables/consts';

@Component({
  selector: 'app-income-payment-list',
  templateUrl: './income-payment-list.component.html',
  styleUrl: './income-payment-list.component.css',
})
export class IncomePaymentListComponent implements OnInit {
  totalLength = 0;
  page = 1;
  pageSize = 10;

  payments: Payment[] = [];
  isLoadingFetchingPayments = false;
  isLoadingArchiveOwner = false;
  focus2: boolean = false;
  focus3: boolean = false;
  agreementPrefix: string = agreementPrefix;
  propertyPrefix: string = propertyPrefix;

  paymentMethodTypeSearchValue: SearchResult = { id: 'all', title: 'Tout' };
  paymentTypes: SearchResult[] = [
    { id: 'all', title: 'Tout' },
    ...DataTypes.paymentTypeList,
  ];
  paymentTypeSearchValue: SearchResult = { id: 'all', title: 'Tout' };
  paymentMethodsType: SearchResult[] = [
    { id: 'all', title: 'Tout' },
    ...DataTypes.paymentMethodTypeList,
  ];

  filtersFormGroup: FormGroup;

  constructor(
    private paymentService: PaymentService,
    private formBuilder: FormBuilder,
    private confirmDialogService: ConfirmDialogService,
    private queryStringBuilder: QueryStringBuilder,
    private router: Router,
  ) {
    this.filtersFormGroup = this.formBuilder.group({
      searchTerm: new FormControl(''),
      ownerId: new FormControl(''),
      agreementId: new FormControl(''),
      apartmentId: new FormControl(''),
      tenantId: new FormControl(''),
      propertyId: new FormControl(''),
      paymentAgreement: new FormControl(''),
      paymentProperty: new FormControl(''),
      paymentMethod: new FormControl(this.paymentMethodsType[0].id),
      paymentType: new FormControl('income'),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
    });
  }

  selectedUsers: string[] = [];
  showCheckboxSelection = false;
  ownerOptions: SearchResult[] = [];
  agreementOptions: SearchResult[] = [];
  tenantOptions: SearchResult[] = [];

  searchOwnerValue: string = '';
  searchAgreementValue: string = '';
  searchTenantValue: string = '';
  searchApartmentValue: string = '';
  searchPropertyValue: string = '';

  affectGroupModal?: BsModalRef;

  @ViewChild('modalAffectGroup') modalAffectGroup?: TemplateRef<void>;

  ngOnInit(): void {
    this.getAllPayment(this.page, this.pageSize);
  }

  pageChange(event: PageChangedEvent) {
    this.page = event.page;
    this.getAllPayment(
      this.page,
      this.pageSize,
      this.filtersFormGroup.value,
      false,
    );
  }

  showClearFilterBtn = false;

  clearFilter() {
    this.filtersFormGroup.reset();
    this.filtersFormGroup.get('');
    this.clearInputValue = !this.clearInputValue;
    this.getAllPayment(this.page, this.pageSize);
    this.showClearFilterBtn = false;
  }

  clearInputValue = false;

  onSelectedOwnerSearchItem(owner: Owner | undefined) {
    this.filtersFormGroup.get('ownerId')?.setValue(owner?.id);
  }

  onSelectedAgreementSearchItem(agreement: Agreement | undefined) {
    this.filtersFormGroup.get('agreementId')?.setValue(agreement?.id);
  }

  onSelectedPropertySearchItem(property: Property | undefined) {
    this.filtersFormGroup.get('propertyId')?.setValue(property?.id);
  }

  onSelectedApartmentSearchItem(apartment: Apartment | undefined) {
    this.filtersFormGroup.get('apartmentId')?.setValue(apartment?.id);
  }

  onSelectedTenantSearchItem(tenant: Tenant | undefined) {
    this.filtersFormGroup.get('tenantId')?.setValue(tenant?.id);
  }

  onSelectedPaymentMethodTypeSearchItem(event: SearchResult) {
    this.filtersFormGroup.get('paymentMethod')?.setValue(event.id);
  }

  filterPayments() {
    this.showClearFilterBtn = true;
    this.getAllPayment(
      this.page,
      this.pageSize,
      this.filtersFormGroup.value,
      false,
    );
  }

  async getAllPayment(
    page: number,
    limit: number,
    filters?: Record<string, string>,
    useCache = false,
  ) {
    this.isLoadingFetchingPayments = true;

    if (this.filtersFormGroup.get('paymentMethod')?.value === 'all') {
      this.filtersFormGroup.get('paymentMethod')?.setValue('');
    }

    const urlParameters = this.queryStringBuilder.create(
      { page, limit },
      this.filtersFormGroup,
    );

    this.paymentService
      .getAllPayments(`?${urlParameters}`, useCache)
      .subscribe({
        next: (value) => {
          this.isLoadingFetchingPayments = false;
          this.totalLength = value.body.meta.total;
          this.payments = PaymentMapper.mapPayments(value.body.payments);
          console.log(this.payments);
        },
        error: (err) => {
          this.isLoadingFetchingPayments = false;

          console.log(err);
        },
      });
  }

  deletePayment(id: string, fullName: string) {
    this.confirmDialogService.showDialog({
      title: `Êtes-vous sûr de vouloir supprimer ce paiement: ${fullName} ?`,
      message: `Êtes-vous sûr de vouloir supprimer ${fullName} ? Attention veuillez noter que cette action est irréversible`,
      cancelBtnTitle: 'Annuler',
      confirmBtnTitle: 'Confirmer',
      onConfirmClick: () => {
        this.isLoadingFetchingPayments = true;
        this.paymentService.deletePayment(id).subscribe({
          next: (value) => {
            this.page = 1;
            this.getAllPayment(this.page, this.pageSize, {}, false);

            this.isLoadingFetchingPayments = false;
          },
          error: (err) => {
            console.log(err);
            this.isLoadingFetchingPayments = false;
          },
        });
      },
    });
  }

  redirectToDetails(id: string) {
    this.router.navigate([`./dashboard/payment/payment-details/${id}`]);
  }
}
