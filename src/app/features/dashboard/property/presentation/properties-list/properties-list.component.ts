import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { QueryStringBuilder } from '@core/query-string-builder/query-string-builder';
import { Property } from '@property/entity/property';
import { Seed } from '@models/seed';
import { ConfirmDialogService } from '@shared/confirm-dialog/confirm-dialog.service';
import { SearchResult } from '@shared/search-input/search-input.component';
import { ToastAlertService } from '@shared/toast-alert/toast-alert.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { PropertyService } from '../../service/property.service';
import { PropertyMapper } from '@dashboard/property/mappers/property-mapper';

@Component({
  selector: 'app-properties-list',
  templateUrl: './properties-list.component.html',
  styleUrl: './properties-list.component.css',
})
export class PropertiesListComponent implements OnInit {
  totalLength = 0;
  page = 1;
  pageSize = 10;

  properties: Property[] = [];
  isLoadingFetchingProperties = false;
  isLoadingArchiveProperty = false;

  groupSearchResult: SearchResult[] = [];
  activitySearchResult: SearchResult[] = [];
  siteSearchResult: SearchResult[] = [];

  filtersFormGroup: FormGroup;

  constructor(
    //private employeeService: EmployeeService,
    //private getAllEmployeeDto: GetAllEmployeeDTO,
    private propertyService: PropertyService,
    private formBuilder: FormBuilder,
    private toastAlertService: ToastAlertService,
    private modalService: BsModalService,
    private confirmDialogService: ConfirmDialogService,
    private queryStringBuilder: QueryStringBuilder,
    private router: Router,
  ) {
    this.filtersFormGroup = this.formBuilder.group({
      name: new FormControl(''),
      employeeId: new FormControl(''),
      tripType: new FormControl(''),
      attachment: new FormControl(''),
      postId: new FormControl(''),
      siteId: new FormControl(''),
      activityId: new FormControl(''),
      packetId: new FormControl(''),
    });
  }

  selectedUsers: string[] = [];
  showCheckboxSelection = false;

  affectGroupModal?: BsModalRef;

  @ViewChild('modalAffectGroup') modalAffectGroup?: TemplateRef<void>;

  ngOnInit(): void {
    this.getAllProperties(this.page, this.pageSize);
  }

  pageChange(event: PageChangedEvent) {
    this.page = event.page;

    this.getAllProperties(
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
    this.getAllProperties(this.page, this.pageSize);
    this.showClearFilterBtn = false;
  }

  exportAllEmployeeIsLoading = false;

  exportAllEmployees() {
    this.exportAllEmployeeIsLoading = true;
  }

  clearInputValue = false;

  onSelectedShiftSearchItem(event: SearchResult) {
    this.filtersFormGroup.get('postId')?.setValue(event.id);
  }

  onSelectedPackageSearchItem(event: SearchResult) {
    this.filtersFormGroup.get('packetId')?.setValue(event.id);
  }

  filterEmployees() {
    this.showClearFilterBtn = true;
    this.getAllProperties(
      this.page,
      this.pageSize,
      this.filtersFormGroup.value,
      false,
    );
  }
  deleteProperty(id: string, fullName: string) {
    this.confirmDialogService.showDialog({
      title: `Êtes-vous sûr de vouloir supprimer cette propriétée: ${fullName} ?`,
      message: `Êtes-vous sûr de vouloir supprimer ${fullName} ? Attention veuillez noter que cette action est irréversible`,
      cancelBtnTitle: 'Annuler',
      confirmBtnTitle: 'Confirmer',
      onConfirmClick: () => {
        this.isLoadingArchiveProperty = true;
        this.propertyService.deleteProperty(id).subscribe({
          next: (value) => {
            this.page = 1;
            this.getAllProperties(this.page, this.pageSize, {}, false);

            this.isLoadingArchiveProperty = false;
          },
          error: (err) => {
            console.log(err);
            this.isLoadingArchiveProperty = false;
          },
        });
      },
    });
  }
  async getAllProperties(
    page: number,
    pageSize: number,
    filters?: Record<string, string>,
    useCache = true,
  ) {
    this.isLoadingFetchingProperties = true;

    const urlParameters = this.queryStringBuilder.create(
      { page, limit: pageSize },
      this.filtersFormGroup,
    );

    this.propertyService.getAllProperties(`?${urlParameters}`).subscribe({
      next: (value) => {
        this.isLoadingFetchingProperties = false;
        this.totalLength = value.body.meta.total ?? 0;
        const properties = PropertyMapper.mapProperties(value.body.properties);
        this.properties = properties;
      },
      error: (err) => {
        console.log(err);
        this.isLoadingFetchingProperties = false;
      },
    });
  }

  onSelectedSiteSearchItem(event: SearchResult) {
    this.filtersFormGroup.get('siteId')?.setValue(event.id);
  }

  onSelectedActivitySearchItem(event: SearchResult) {
    this.filtersFormGroup.get('activityId')?.setValue(event.title);
  }

  redirectToDetails(id: string) {
    this.router.navigate([`./dashboard/property/property-details/${id}`]);
  }

  verifyEmployee(id: string, fullName: string) {
    this.confirmDialogService.showDialog({
      title: `Êtes-vous sûr de vouloir vérifier ce bénéficiaire: ${fullName} ?`,
      message: ``,
      cancelBtnTitle: 'Annuler',
      confirmBtnTitle: 'Confirmer',
      onConfirmClick: () => {},
    });
  }
}
