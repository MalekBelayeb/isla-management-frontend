import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { QueryStringBuilder } from '@core/query-string-builder/query-string-builder';
import { ApartmentService } from '@dashboard/apartment/service/apartment.service';
import { ApartmentMapper } from '@dashboard/apartment/mappers/apartment-mapper';
import { DataTypes } from '@models/data';
import { Seed } from '@models/seed';
import { ConfirmDialogService } from '@shared/confirm-dialog/confirm-dialog.service';
import { SearchResult } from '@shared/search-input/search-input.component';
import { ToastAlertService } from '@shared/toast-alert/toast-alert.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Apartment } from '@dashboard/apartment/entity/Apartment';
import {
  apartmentPrefix,
  defaultSearchLimit,
  propertyPrefix,
} from 'src/app/variables/consts';
import { OwnerService } from '@dashboard/owner/service/owner.service';
import { GetAllOwnersMapper } from '@dashboard/owner/mappers/get-all-owners-mapper';

@Component({
  selector: 'app-apartment-list',
  templateUrl: './apartment-list.component.html',
  styleUrl: './apartment-list.component.css',
})
export class ApartmentListComponent {
  totalLength = 0;
  page = 1;
  pageSize = 10;

  apartments: Apartment[] = [];
  isLoadingFetchingApartments = false;
  isLoadingArchiveOwner = false;

  filtersFormGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private apartmentService: ApartmentService,
    private ownerService: OwnerService,
    private confirmDialogService: ConfirmDialogService,
    private queryStringBuilder: QueryStringBuilder,
    private router: Router,
  ) {
    this.filtersFormGroup = this.formBuilder.group({
      searchTerm: new FormControl(''),
      type: new FormControl(''),
      matricule: new FormControl(''),
      ownerId: new FormControl(''),
      rentStatus: new FormControl(''),
      propertyMatricule: new FormControl(''),
      status: new FormControl(''),
    });
  }
  focus1: boolean = false;
  focus2: boolean = false;
  selectedUsers: string[] = [];
  showCheckboxSelection = false;
  ownerOptions: SearchResult[] = [];
  searchOwnerValue: string = '';
  apartmentPrefix: string = apartmentPrefix;
  apartementStatus: SearchResult[] = DataTypes.apartmentStatusType;
  apartmentStatusSearchValue: SearchResult = DataTypes.apartmentStatusType[0];
  propertyPrefix: string = propertyPrefix;
  apartmentsType: SearchResult[] = [
    { id: 'All', title: 'Tous (Studio, appart., depot ...)' },
    ...DataTypes.apartmentsType,
  ];
  apartmentTypeSearchValue: SearchResult = this.apartmentsType[0];

  ngOnInit(): void {
    this.getAllApartments(this.page, this.pageSize);
  }

  pageChange(event: PageChangedEvent) {
    this.page = event.page;

    this.getAllApartments(
      this.page,
      this.pageSize,
      this.filtersFormGroup.value,
      false,
    );
  }

  onSelectedApartmentTypeSearchItem(event: SearchResult) {
    this.apartmentTypeSearchValue = event;

    this.filtersFormGroup
      .get('type')
      ?.setValue(event.id === 'All' ? '' : event.id);
  }

  onSelectedApartmentRentStatusSearchItem(event: SearchResult) {
    this.apartmentStatusSearchValue = event;
    this.filtersFormGroup
      .get('rentStatus')
      ?.setValue(event.id === 'All' ? '' : event.id);
  }

  filterEmployees() {
    this.getAllApartments(
      this.page,
      this.pageSize,
      this.filtersFormGroup.value,
      false,
    );
  }
  premiseTypeOptions = Seed.premiseTypeOptions;

  async getAllApartments(
    page: number,
    pageSize: number,
    filters?: Record<string, string>,
    useCache = true,
  ) {
    this.isLoadingFetchingApartments = true;
    const urlParameters = this.queryStringBuilder.create(
      { page, limit: pageSize },
      this.filtersFormGroup,
    );
    this.apartmentService
      .getAllApartments(`?${urlParameters}`, useCache)
      .subscribe({
        next: (value) => {
          console.log(value.body);
          this.isLoadingFetchingApartments = false;
          this.totalLength = value.body.meta.total ?? 0;
          this.apartments = ApartmentMapper.mapApartments(
            value.body.apartments,
          );
        },
        error: (err) => {
          this.isLoadingFetchingApartments = false;
        },
      });
  }

  onSelectedOwnerSearchItem(searchResult: SearchResult) {
    this.filtersFormGroup.get('ownerId')?.setValue(searchResult.id);
  }

  onSearchOwnerValueChanged(searchValue?: string) {
    const params = {
      ...(searchValue && { searchTerm: searchValue }),
      limit: `${defaultSearchLimit}`,
    };

    const queryString = new URLSearchParams(params).toString();

    this.ownerService.getAllOwners(`?${queryString}`).subscribe({
      next: (value) => {
        const owners = GetAllOwnersMapper.fromResponse(value.body.owners);
        this.ownerOptions = owners.map((item) => ({
          id: item.id,
          title: `${item.name}`,
        }));
      },
    });
  }

  deleteApartement(id: string, fullName: string) {
    this.confirmDialogService.showDialog({
      title: `Êtes-vous sûr de vouloir supprimer ce local: ${fullName} ?`,
      message: `Êtes-vous sûr de vouloir supprimer ${fullName} ? Attention veuillez noter que cette action est irréversible`,
      cancelBtnTitle: 'Annuler',
      confirmBtnTitle: 'Confirmer',
      onConfirmClick: () => {
        this.isLoadingFetchingApartments = true;
        this.apartmentService.deleteApartment(id).subscribe({
          next: (value) => {
            this.page = 1;
            this.getAllApartments(this.page, this.pageSize, {}, false);

            this.isLoadingFetchingApartments = false;
          },
          error: (err) => {
            console.log(err);
            this.isLoadingFetchingApartments = false;
          },
        });
      },
    });
  }

  redirectToDetails(id: string) {
    this.router.navigate([`./dashboard/apartment/apartment-details/${id}`]);
  }
}
