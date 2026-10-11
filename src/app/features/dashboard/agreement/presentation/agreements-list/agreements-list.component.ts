import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { QueryStringBuilder } from '@core/query-string-builder/query-string-builder';
import { Agreement } from '@dashboard/agreement/entity/agreement';
import { AgreeementMapper } from '@dashboard/agreement/mappers/agreement.mapper';
import { AgreementService } from '@dashboard/agreement/service/agreement.service';
import { Apartment } from '@dashboard/apartment/entity/apartment';
import { Property } from '@dashboard/property/entity/property';
import { Tenant } from '@dashboard/tenant/entity/tenant';
import { DataTypes } from '@models/data';
import { ConfirmDialogService } from '@shared/confirm-dialog/confirm-dialog.service';
import { SearchResult } from '@shared/search-input/search-input.component';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { agreementPrefix, propertyPrefix } from 'src/app/variables/consts';

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
  propertyPrefix: string = propertyPrefix;

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
  searchPropertyValue: string = '';

  constructor(
    private agreementService: AgreementService,
    private formBuilder: FormBuilder,
    private agreementMapper: AgreeementMapper,
    private confirmDialogService: ConfirmDialogService,
    private queryStringBuilder: QueryStringBuilder,
    private router: Router,
  ) {
    this.filtersFormGroup = this.formBuilder.group({
      searchTerm: new FormControl(''),
      tenantId: new FormControl(''),
      apartmentId: new FormControl(''),
      propertyId: new FormControl(''),
    });
  }

  selectedUsers: string[] = [];
  showCheckboxSelection = false;

  affectGroupModal?: BsModalRef;
  showClearFilterBtn = false;
  clearInputValue = false;

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

  clearFilter() {
    this.filtersFormGroup.reset();
    this.filtersFormGroup.get('');
    this.clearInputValue = !this.clearInputValue;
    this.getAllAgreement(this.page, this.pageSize);
    this.showClearFilterBtn = false;
  }

  onSelectedPropertySearchItem(property: Property | undefined) {
    this.filtersFormGroup.get('propertyId')?.setValue(property?.id);
  }

  onSelectedTenantSearchItem(tenant: Tenant | undefined) {
    this.filtersFormGroup.get('tenantId')?.setValue(tenant?.id);
  }

  onSelectedApartmentSearchItem(apartment: Apartment | undefined) {
    this.filtersFormGroup.get('apartmentId')?.setValue(apartment?.id);
  }

  filterAgreements() {
    this.showClearFilterBtn = true;
    this.getAllAgreement(
      this.page,
      this.pageSize,
      this.filtersFormGroup.value,
      false,
    );
  }

  async getAllAgreement(
    page: number,
    pageSize: number,
    filters?: Record<string, string>,
    useCache = false,
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
          this.agreements = this.agreementMapper.mapAgreements(
            value.body.agreements,
          );
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
