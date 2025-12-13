import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { QueryStringBuilder } from '@core/query-string-builder/query-string-builder';
import { AgreeementMapper } from '@dashboard/agreement/mappers/agreement.mapper';
import { AgreementService } from '@dashboard/agreement/service/agreement.service';
import { ApartmentMapper } from '@dashboard/apartment/mappers/apartment-mapper';
import { ApartmentService } from '@dashboard/apartment/service/apartment.service';
import { Tenant } from '@dashboard/tenant/entity/tenant';
import { TenantMapper } from '@dashboard/tenant/mappers/tenant-mapper';
import { TenantService } from '@dashboard/tenant/service/tenant.service';
import { DataTypes } from '@models/data';
import { Seed } from '@models/seed';
import { ConfirmDialogService } from '@shared/confirm-dialog/confirm-dialog.service';
import { SearchResult } from '@shared/search-input/search-input.component';
import { ToastAlertService } from '@shared/toast-alert/toast-alert.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { defaultSearchLimit } from 'src/app/variables/consts';

@Component({
  selector: 'app-tenants-list',
  templateUrl: './tenants-list.component.html',
  styleUrl: './tenants-list.component.css',
})
export class TenantsListComponent implements OnInit {
  totalLength = 0;
  page = 1;
  pageSize = 10;

  tenants: Tenant[] = [];
  isLoadingFetchingTenants = false;
  isLoadingArchiveOwner = false;

  apartmentOptions: SearchResult[] = [];
  agreementOptions: SearchResult[] = [];
  statusTenantOptions: SearchResult[] = DataTypes.statusTenantList;

  statusTenantSearchValue: SearchResult = DataTypes.statusTenantList[0];

  filtersFormGroup: FormGroup;
  searchApartmentValue: string = '';
  searchAgreementValue: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private toastAlertService: ToastAlertService,
    private modalService: BsModalService,
    private confirmDialogService: ConfirmDialogService,
    private apartmentService: ApartmentService,
    private agreementService: AgreementService,
    private queryStringBuilder: QueryStringBuilder,
    private router: Router,
    private tenantService: TenantService,
    private tenantMapper: TenantMapper,
  ) {
    this.filtersFormGroup = this.formBuilder.group({
      searchTerm: new FormControl(''),
      apartmentId: new FormControl(''),
      agreementId: new FormControl(''),
      statusTenant: new FormControl(''),
    });
  }

  selectedUsers: string[] = [];

  affectGroupModal?: BsModalRef;

  @ViewChild('modalAffectGroup') modalAffectGroup?: TemplateRef<void>;

  ngOnInit(): void {
    this.getAllTenants(this.page, this.pageSize);
  }

  pageChange(event: PageChangedEvent) {
    this.page = event.page;

    this.getAllTenants(
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
    this.getAllTenants(this.page, this.pageSize);
    this.showClearFilterBtn = false;
  }

  exportAllEmployeeIsLoading = false;

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

  onSelectedStatusTenantSearchItem(searchResult: SearchResult) {
    this.filtersFormGroup.get('statusTenant')?.setValue(searchResult.id);
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

  clearInputValue = false;

  filterTenants() {
    this.showClearFilterBtn = true;
    this.getAllTenants(
      this.page,
      this.pageSize,
      this.filtersFormGroup.value,
      false,
    );
  }

  premisesOptions = Seed.premisesOptions;
  tenantsFilterOptions = Seed.filterTenantsOptions;

  async getAllTenants(
    page: number,
    pageSize: number,
    filters?: Record<string, string>,
    useCache = true,
  ) {
    this.isLoadingFetchingTenants = true;
    const urlParameters = this.queryStringBuilder.create(
      { page, limit: pageSize },
      this.filtersFormGroup,
    );

    this.tenantService.getAllTenant(`?${urlParameters}`, useCache).subscribe({
      next: (value) => {
        this.isLoadingFetchingTenants = false;
        this.totalLength = value.body.meta.total ?? 0;
        this.tenants = this.tenantMapper.mapTenants(value.body.tenants);
      },
      error: (err) => {
        console.log(err);
        this.isLoadingFetchingTenants = false;
      },
    });
  }

  onSelectedSiteSearchItem(event: SearchResult) {
    this.filtersFormGroup.get('siteId')?.setValue(event.id);
  }

  onSelectedActivitySearchItem(event: SearchResult) {
    this.filtersFormGroup.get('activityId')?.setValue(event.title);
  }

  deleteTenant(id: string, fullName: string) {
    this.confirmDialogService.showDialog({
      title: `Êtes-vous sûr de vouloir supprimer ce locataire: ${fullName} ?`,
      message: `Êtes-vous sûr de vouloir supprimer ${fullName} ? Attention veuillez noter que cette action est irréversible`,
      cancelBtnTitle: 'Annuler',
      confirmBtnTitle: 'Confirmer',
      onConfirmClick: () => {
        this.tenantService.deleteTenant(id).subscribe({
          next: (value) => {
            this.page = 1;
            this.getAllTenants(this.page, this.pageSize, {}, false);

            this.isLoadingFetchingTenants = false;
          },
          error: (err) => {
            console.log(err);
            this.isLoadingFetchingTenants = false;
          },
        });
      },
    });
  }

  redirectToDetails(id: string) {
    this.router.navigate([`./dashboard/tenant/tenant-details/${id}`]);
  }
}
