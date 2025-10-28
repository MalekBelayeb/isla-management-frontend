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
    private toastAlertService: ToastAlertService,
    private modalService: BsModalService,
    private apartmentService: ApartmentService,
    private confirmDialogService: ConfirmDialogService,
    private queryStringBuilder: QueryStringBuilder,
    private router: Router,
  ) {
    this.filtersFormGroup = this.formBuilder.group({
      searchTerm: new FormControl(''),
      type: new FormControl(''),
      status: new FormControl(''),
    });
  }

  selectedUsers: string[] = [];
  showCheckboxSelection = false;

  affectGroupModal?: BsModalRef;

  apartementStatus: SearchResult[] = DataTypes.apartmentStatusType;
  apartmentStatusSearchValue: SearchResult = DataTypes.apartmentStatusType[0];

  apartmentsType: SearchResult[] = DataTypes.apartmentsType;
  apartmentTypeSearchValue: SearchResult = DataTypes.apartmentsType[0];

  @ViewChild('modalAffectGroup') modalAffectGroup?: TemplateRef<void>;

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

  showClearFilterBtn = false;

  clearFilter() {
    this.filtersFormGroup.reset();
    this.filtersFormGroup.get('');
    this.clearInputValue = !this.clearInputValue;
    this.getAllApartments(this.page, this.pageSize);
    this.showClearFilterBtn = false;
  }

  exportAllEmployeeIsLoading = false;

  exportAllEmployees() {
    this.exportAllEmployeeIsLoading = true;
  }

  clearInputValue = false;

  onSelectedApartmentTypeSearchItem(event: SearchResult) {
    this.apartmentTypeSearchValue = event;
    this.filtersFormGroup.get('type')?.setValue(event.id);
  }

  onSelectedApartmentStatusSearchItem(event: SearchResult) {
    this.apartmentStatusSearchValue = event;
    this.filtersFormGroup.get('status')?.setValue(event.id);
  }

  filterEmployees() {
    this.showClearFilterBtn = true;
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
    this.apartmentService.getAllApartments(`?${urlParameters}`).subscribe({
      next: (value) => {
        console.log(value.body);
        this.isLoadingFetchingApartments = false;
        this.totalLength = value.body.meta.total ?? 0;
        this.apartments = ApartmentMapper.mapApartments(value.body.apartments);
      },
      error: (err) => {
        this.isLoadingFetchingApartments = false;
      },
    });
  }

  onSelectedSiteSearchItem(event: SearchResult) {
    this.filtersFormGroup.get('siteId')?.setValue(event.id);
  }

  onSelectedActivitySearchItem(event: SearchResult) {
    this.filtersFormGroup.get('activityId')?.setValue(event.title);
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
