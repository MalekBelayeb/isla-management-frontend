import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { QueryStringBuilder } from '@core/query-string-builder/query-string-builder';
import { Agreement } from '@dashboard/agreement/entity/agreement';
import { AgreeementMapper } from '@dashboard/agreement/mappers/agreement.mapper';
import { AgreementService } from '@dashboard/agreement/service/agreement.service';
import { ApartmentMapper } from '@dashboard/apartment/mappers/apartment-mapper';
import { ApartmentService } from '@dashboard/apartment/service/apartment.service';
import { TenantMapper } from '@dashboard/tenant/mappers/tenant-mapper';
import { TenantService } from '@dashboard/tenant/service/tenant.service';
import { DataTypes } from '@models/data';
import { ConfirmDialogService } from '@shared/confirm-dialog/confirm-dialog.service';
import { SearchResult } from '@shared/search-input/search-input.component';
import { ToastAlertService } from '@shared/toast-alert/toast-alert.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import {
  agreementPrefix,
  apartmentPrefix,
  defaultSearchLimit,
  propertyPrefix,
} from 'src/app/variables/consts';

@Component({
  selector: 'app-agreements-list',
  templateUrl: './agreements-list.component.html',
  styleUrl: './agreements-list.component.css',
})
export class AgreementsListComponent implements OnInit {
  totalLength = 0;
  page = 1;
  pageSize = 10;
  focus2: boolean = false;
  focus3: boolean = false;
  agreements: Agreement[] = [];
  isLoadingFetchingAgreements = false;
  isLoadingArchiveOwner = false;
  
  agreementPrefix: string = agreementPrefix;
  propertyPrefix:string = propertyPrefix

  groupSearchResult: SearchResult[] = [];
  activitySearchResult: SearchResult[] = [];
  siteSearchResult: SearchResult[] = [];
  tenantOptions: SearchResult[] = [];
  apartmentOptions: SearchResult[] = [];

  agreementStatusOptions: SearchResult[] = DataTypes.agreementStatusTypeList;

  agreementStatusTypeSearchValue: SearchResult =
    DataTypes.agreementStatusTypeList[0];

  filtersFormGroup: FormGroup;

  searchTenantValue: string = '';
  searchApartmentValue: string = '';

  constructor(
    private agreementService: AgreementService,
    private apartmentService: ApartmentService,
    private tenantService: TenantService,
    private tenantMapper: TenantMapper,
    private formBuilder: FormBuilder,
    private toastAlertService: ToastAlertService,
    private modalService: BsModalService,
    private confirmDialogService: ConfirmDialogService,
    private queryStringBuilder: QueryStringBuilder,
    private router: Router,
  ) {
    this.filtersFormGroup = this.formBuilder.group({
      searchTerm: new FormControl(''),
      tenantId: new FormControl(''),
      apartmentId: new FormControl(''),
      agreementStatus: new FormControl(DataTypes.agreementStatusTypeList[0].id),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      propertyMatricule: new FormControl(''),
      agreementProperty: new FormControl(''),
    });
  }

  selectedUsers: string[] = [];
  showCheckboxSelection = false;

  affectGroupModal?: BsModalRef;

  @ViewChild('modalAffectGroup') modalAffectGroup?: TemplateRef<void>;

  ngOnInit(): void {
    this.getAllAgreement(this.page, this.pageSize);
  }

  pageChange(event: PageChangedEvent) {
    this.page = event.page;

    this.getAllAgreement(
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
    this.getAllAgreement(this.page, this.pageSize);
    this.showClearFilterBtn = false;
  }

  onSearchTenantValueChanged(searchValue?: string) {
    const params = {
      ...(searchValue && { searchTerm: searchValue }),
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

  onSearchApartmentValueChanged(searchValue?: string) {
    const params = {
      ...(searchValue && { searchTerm: searchValue }),
      limit: `${defaultSearchLimit}`,
    };

    const queryString = new URLSearchParams(params).toString();

    this.apartmentService.getAllApartments(`?${queryString}`).subscribe({
      next: (value) => {
        const apartments = ApartmentMapper.mapApartments(value.body.apartments);
        this.apartmentOptions = apartments.map((item) => ({
          id: item.id,
          title: `${apartmentPrefix}${item.matricule} - ${item.address}`,
        }));
      },
    });
  }

  onSelectedApartmentSearchItem(searchResult: SearchResult) {
    this.filtersFormGroup.get('apartmentId')?.setValue(searchResult.id);
  }

  clearInputValue = false;

  filterAgreements() {
    this.showClearFilterBtn = true;
    this.getAllAgreement(
      this.page,
      this.pageSize,
      this.filtersFormGroup.value,
      false,
    );
  }

  onSelectedAgreementStatusTypeSearchItem(event: SearchResult) {
    this.filtersFormGroup.get('agreementStatus')?.setValue(event.id);
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

  async getAllAgreement(
    page: number,
    pageSize: number,
    filters?: Record<string, string>,
    useCache = true,
  ) {
    this.isLoadingFetchingAgreements = true;
    if (this.filtersFormGroup.get('agreementStatus')?.value === 'all') {
      this.filtersFormGroup.get('agreementStatus')?.setValue('');
    }
    const urlParameters = this.queryStringBuilder.create(
      { page, limit: pageSize },
      this.filtersFormGroup,
    );

    this.agreementService
      .getAllAgreement(`?${urlParameters}`, useCache)
      .subscribe({
        next: (value) => {
          this.isLoadingFetchingAgreements = false;
          this.totalLength = value.body.meta.total ?? 0;
          this.agreements = AgreeementMapper.mapAgreements(
            value.body.agreements,
          );
          console.log(this.agreements);
        },
        error: (err) => {
          this.isLoadingFetchingAgreements = false;

          console.log(err);
        },
      });
  }

  deleteAgreement(id: string, fullName: string) {
    this.confirmDialogService.showDialog({
      title: `Êtes-vous sûr de vouloir supprimer ce contrat: ${fullName} ?`,
      message: `Êtes-vous sûr de vouloir supprimer ${fullName} ? Attention veuillez noter que cette action est irréversible`,
      cancelBtnTitle: 'Annuler',
      confirmBtnTitle: 'Confirmer',
      onConfirmClick: () => {
        this.isLoadingFetchingAgreements = true;
        this.agreementService.deleteAgreement(id).subscribe({
          next: (value) => {
            this.page = 1;
            this.getAllAgreement(this.page, this.pageSize, {}, false);

            this.isLoadingFetchingAgreements = false;
          },
          error: (err) => {
            console.log(err);
            this.isLoadingFetchingAgreements = false;
          },
        });
      },
    });
  }

  redirectToDetails(id: string) {
    this.router.navigate([`./dashboard/agreement/agreement-details/${id}`]);
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
