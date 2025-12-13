import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { QueryStringBuilder } from '@core/query-string-builder/query-string-builder';
import { AgreeementMapper } from '@dashboard/agreement/mappers/agreement.mapper';
import { AgreementService } from '@dashboard/agreement/service/agreement.service';
import { ApartmentMapper } from '@dashboard/apartment/mappers/apartment-mapper';
import { ApartmentService } from '@dashboard/apartment/service/apartment.service';
import { Payment } from '@dashboard/payment/entity/payment';
import { PaymentMapper } from '@dashboard/payment/mappers/payment-mapper';
import { PaymentService } from '@dashboard/payment/service/payment.service';
import { TenantMapper } from '@dashboard/tenant/mappers/tenant-mapper';
import { TenantService } from '@dashboard/tenant/service/tenant.service';
import { DataTypes } from '@models/data';
import { ConfirmDialogService } from '@shared/confirm-dialog/confirm-dialog.service';
import { SearchResult } from '@shared/search-input/search-input.component';
import { ToastAlertService } from '@shared/toast-alert/toast-alert.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { defaultSearchLimit } from 'src/app/variables/consts';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrl: './payment-list.component.css',
})
export class PaymentListComponent implements OnInit {
  totalLength = 0;
  page = 1;
  pageSize = 10;

  payments: Payment[] = [];
  isLoadingFetchingPayments = false;
  isLoadingArchiveOwner = false;

  groupSearchResult: SearchResult[] = [];
  activitySearchResult: SearchResult[] = [];
  siteSearchResult: SearchResult[] = [];

  paymentMethodTypeSearchValue: SearchResult = { id: 'all', title: 'Tout' };
  paymentMethodsType: SearchResult[] = [
    { id: 'all', title: 'Tout' },
    ...DataTypes.paymentMethodTypeList,
  ];

  filtersFormGroup: FormGroup;

  constructor(
    private paymentService: PaymentService,
    //private getAllEmployeeDto: GetAllEmployeeDTO,
    private formBuilder: FormBuilder,
    private toastAlertService: ToastAlertService,
    private modalService: BsModalService,
    private confirmDialogService: ConfirmDialogService,
    private queryStringBuilder: QueryStringBuilder,
    private apartmentService: ApartmentService,
    private agreementService: AgreementService,
    private tenantService: TenantService,
    private tenantMapper: TenantMapper,
    private router: Router,
  ) {
    this.filtersFormGroup = this.formBuilder.group({
      searchTerm: new FormControl(''),
      apartmentId: new FormControl(''),
      agreementId: new FormControl(''),
      tenantId: new FormControl(''),
      paymentMethod: new FormControl(this.paymentMethodsType[0].id),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
    });
  }

  selectedUsers: string[] = [];
  showCheckboxSelection = false;
  apartmentOptions: SearchResult[] = [];
  agreementOptions: SearchResult[] = [];
  tenantOptions: SearchResult[] = [];

  searchApartmentValue: string = '';
  searchAgreementValue: string = '';
  searchTenantValue: string = '';

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

  onSearchApartmentValueChanged(searchValue?: string) {
    const params = {
      ...(searchValue && { searchValue }),
      limit: `${defaultSearchLimit}`,
    };

    const queryString = new URLSearchParams(params).toString();

    this.apartmentService.getAllApartments(`?${queryString}`).subscribe({
      next: (value) => {
        const apartments = ApartmentMapper.mapApartments(value.body.apartments);
        this.apartmentOptions = apartments.map((item) => ({
          id: item.id,
          title: `${item.matricule} - ${item.address}`,
        }));
      },
    });
  }

  onSelectedApartmentSearchItem(searchResult: SearchResult) {
    this.filtersFormGroup.get('apartmentId')?.setValue(searchResult.id);
  }

  onSearchAgreementValueChanged(searchValue?: string) {
    const params = {
      ...(searchValue && { searchTerm: searchValue }),
      limit: `${defaultSearchLimit}`,
    };

    const queryString = new URLSearchParams(params).toString();

    this.agreementService.getAllAgreement(`?${queryString}`).subscribe({
      next: (value) => {
        const agreements = AgreeementMapper.mapAgreements(
          value.body.agreements,
        );
        this.agreementOptions = agreements.map((item) => ({
          id: item.id,
          title: `${item.matricule}`,
        }));
      },
    });
  }
  onSelectedAgreementSearchItem(searchResult: SearchResult) {
    this.filtersFormGroup.get('agreementId')?.setValue(searchResult.id);
  }

  onSelectedPaymentMethodTypeSearchItem(event: SearchResult) {
    this.filtersFormGroup.get('paymentMethod')?.setValue(event.id);
  }


  onSearchTenantValueChanged(searchValue?: string) {
    const params = {
      ...(searchValue && { searchValue }),
      limit: `${defaultSearchLimit}`,
    };

    const queryString = new URLSearchParams(params).toString();

    this.tenantService.getAllTenant(`?${queryString}`).subscribe({
      next: (value) => {
        const tenants = this.tenantMapper.mapTenants(value.body.tenants);
        this.tenantOptions = tenants.map((item) => ({
          id: item.id,
          title: `${item.matricule} - ${item.fullname}`,
        }));
      },
    });
  }
  onSelectedTenantSearchItem(searchResult: SearchResult) {
    this.filtersFormGroup.get('tenantId')?.setValue(searchResult.id);
  }

  onStartDateChange($event: Date) {
    this.filtersFormGroup
      .get('startDate')
      ?.setValue($event.toISOString().split('T')[0]);
  }

  onEndDateChange($event: Date) {
    this.filtersFormGroup
      .get('endDate')
      ?.setValue($event?.toISOString().split('T')[0]);
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
    useCache = true,
  ) {
    this.isLoadingFetchingPayments = true;
    console.log(this.filtersFormGroup.get('paymentMethod')?.value)
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

  verifyEmployee(id: string, fullName: string) {
    this.confirmDialogService.showDialog({
      title: `Êtes-vous sûr de vouloir vérifier ce bénéficiaire: ${fullName} ?`,
      message: ``,
      cancelBtnTitle: 'Annuler',
      confirmBtnTitle: 'Confirmer',
      onConfirmClick: () => {
        this.isLoadingArchiveOwner = true;
        /*this.employeeService.verifyEmployee(id).subscribe({
          next: (value) => {
            this.page = 1;
            this.getAllEmployee(
              this.page - 1,
              this.pageSize,
              this.filtersFormGroup.value,
              false,
            );

            this.isLoadingArchiveUser = false;
          },
          error: (err) => {
            console.log(err);
            this.isLoadingArchiveUser = false;
          },
        });*/
      },
    });
  }
}
