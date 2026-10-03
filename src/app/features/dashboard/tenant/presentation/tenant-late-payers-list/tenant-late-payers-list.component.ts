import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { QueryStringBuilder } from '@core/query-string-builder/query-string-builder';
import { AgreeementMapper } from '@dashboard/agreement/mappers/agreement.mapper';
import { AgreementService } from '@dashboard/agreement/service/agreement.service';
import { ApartmentMapper } from '@dashboard/apartment/mappers/apartment-mapper';
import { ApartmentService } from '@dashboard/apartment/service/apartment.service';
import { LatePayerTenant } from '@dashboard/tenant/entity/late-payer-tenant';
import { Tenant } from '@dashboard/tenant/entity/tenant';
import { LatePayerTenantMapper } from '@dashboard/tenant/mappers/late-payer-tenant.mapper';
import { TenantMapper } from '@dashboard/tenant/mappers/tenant-mapper';
import { TenantService } from '@dashboard/tenant/service/tenant.service';
import { Seed } from '@models/seed';
import { ConfirmDialogService } from '@shared/confirm-dialog/confirm-dialog.service';
import { SearchResult } from '@shared/search-input/search-input.component';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { agreementPrefix, propertyPrefix } from 'src/app/variables/consts';

@Component({
  selector: 'app-tenant-late-payers-list',
  templateUrl: './tenant-late-payers-list.component.html',
  styleUrl: './tenant-late-payers-list.component.css',
})
export class TenantLatePayersListComponent implements OnInit {
  totalLength = 0;
  page = 1;
  pageSize = 10;

  allLatePayersTenants: LatePayerTenant[] = [];
  isLoadingAllLatePayersTenants = false;
  isLoadingArchiveOwner = false;
  agreementPrefix: string = agreementPrefix;
  propertyPrefix: string = propertyPrefix;
  focus2: boolean = false;
  focus3: boolean = false;
  apartmentOptions: SearchResult[] = [];
  agreementOptions: SearchResult[] = [];

  filtersFormGroup: FormGroup;
  searchApartmentValue: string = '';
  searchAgreementValue: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private queryStringBuilder: QueryStringBuilder,
    private router: Router,
    private tenantService: TenantService,
    private latePayerTenantMapper: LatePayerTenantMapper,
  ) {
    this.filtersFormGroup = this.formBuilder.group({
      searchTerm: new FormControl(''),
    });
  }

  selectedUsers: string[] = [];

  affectGroupModal?: BsModalRef;

  @ViewChild('modalAffectGroup') modalAffectGroup?: TemplateRef<void>;

  ngOnInit(): void {
    this.getAllLatePayersTenants(this.page, this.pageSize);
  }

  pageChange(event: PageChangedEvent) {
    this.page = event.page;

    this.getAllLatePayersTenants(
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
    this.getAllLatePayersTenants(this.page, this.pageSize);
    this.showClearFilterBtn = false;
  }

  exportAllEmployeeIsLoading = false;
  clearInputValue = false;

  filterTenants() {
    this.showClearFilterBtn = true;
    this.getAllLatePayersTenants(
      this.page,
      this.pageSize,
      this.filtersFormGroup.value,
      false,
    );
  }

  premisesOptions = Seed.premisesOptions;
  tenantsFilterOptions = Seed.filterTenantsOptions;

  async getAllLatePayersTenants(
    page: number,
    pageSize: number,
    filters?: Record<string, string>,
    useCache = true,
  ) {
    this.isLoadingAllLatePayersTenants = true;
    const urlParameters = this.queryStringBuilder.create(
      { page, limit: pageSize },
      this.filtersFormGroup,
    );

    this.tenantService.getAllLatePayersTenants(`?${urlParameters}`).subscribe({
      next: (value) => {
        this.isLoadingAllLatePayersTenants = false;
        this.totalLength = value.body.meta.total ?? 0;
        this.allLatePayersTenants =
          this.latePayerTenantMapper.mapLatePayerTenants(value.body.tenants);
      },
      error: (err) => {
        console.log(err);
        this.isLoadingAllLatePayersTenants = false;
      },
    });
  }

  redirectToDetails(id: string) {
    this.router.navigate([`./dashboard/tenant/tenant-details/${id}`]);
  }
}
