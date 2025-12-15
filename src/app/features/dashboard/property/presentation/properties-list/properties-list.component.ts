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
import { defaultSearchLimit, propertyPrefix } from 'src/app/variables/consts';
import { ApartmentService } from '@dashboard/apartment/service/apartment.service';
import { ApartmentMapper } from '@dashboard/apartment/mappers/apartment-mapper';
import { DataTypes } from '@models/data';
import { OwnerService } from '@dashboard/owner/service/owner.service';
import { GetAllOwnersMapper } from '@dashboard/owner/mappers/get-all-owners-mapper';

@Component({
  selector: 'app-properties-list',
  templateUrl: './properties-list.component.html',
  styleUrl: './properties-list.component.css',
})
export class PropertiesListComponent implements OnInit {
  totalLength = 0;
  page = 1;
  pageSize = 10;
  focus1: boolean = false;

  properties: Property[] = [];
  isLoadingFetchingProperties = false;
  isLoadingArchiveProperty = false;

  ownerOptions: SearchResult[] = [];
  propertiesType: SearchResult[] = [
    { id: 'All', title: 'Tous (Immeuble, magasin, duplex ...)' },
    ...DataTypes.propertiesType,
  ];

  searchOwnerValue: string = '';

  filtersFormGroup: FormGroup;
  propertyTypeSearchValue: SearchResult = this.propertiesType[0];
  propertyPrefix: string = propertyPrefix;
  constructor(
    //private employeeService: EmployeeService,
    //private getAllEmployeeDto: GetAllEmployeeDTO,
    private propertyService: PropertyService,
    private ownerService: OwnerService,
    private formBuilder: FormBuilder,
    private toastAlertService: ToastAlertService,
    private modalService: BsModalService,
    private confirmDialogService: ConfirmDialogService,
    private queryStringBuilder: QueryStringBuilder,
    private router: Router,
  ) {
    this.filtersFormGroup = this.formBuilder.group({
      searchTerm: new FormControl(''),
      matricule: new FormControl(''),
      ownerId: new FormControl(''),
      type: new FormControl(''),
    });
  }

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

  onSelectedPropertyTypeSearchItem(event: SearchResult) {
    this.propertyTypeSearchValue = event;
    this.filtersFormGroup.get('type')?.setValue(event.id);
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

  onSelectedStatusTenantSearchItem(searchResult: SearchResult) {
    this.filtersFormGroup.get('statusTenant')?.setValue(searchResult.id);
  }

  filterProperties() {
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
    if (this.filtersFormGroup.get('type')?.value === 'All') {
      this.filtersFormGroup.get('type')?.setValue('');
    }
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

  redirectToDetails(id: string) {
    this.router.navigate([`./dashboard/property/property-details/${id}`]);
  }
}
