import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { QueryStringBuilder } from '@core/query-string-builder/query-string-builder';
import { Premise } from '@models/premise';
import { Property } from '@property/entity/property';
import { Seed } from '@models/seed';
import { ConfirmDialogService } from '@shared/confirm-dialog/confirm-dialog.service';
import { SearchResult } from '@shared/search-input/search-input.component';
import { ToastAlertService } from '@shared/toast-alert/toast-alert.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { OwnerService } from '../../service/owner.service';
import { GetAllOwnersMapper } from '@dashboard/owner/mappers/get-all-owners-mapper';
import { Owner } from '@dashboard/owner/entity/owner';

@Component({
  selector: 'app-owners-list',
  templateUrl: './owners-list.component.html',
  styleUrl: './owners-list.component.css',
})
export class OwnersListComponent {
  totalLength = 0;
  page = 1;
  pageSize = 10;

  owners: Owner[] = [];
  selectedProperties: Property[] = [];
  selectedPremises: Premise[] = [];

  isLoadingFetchingOwners = false;
  isLoadingArchiveOwner = false;

  groupSearchResult: SearchResult[] = [];
  activitySearchResult: SearchResult[] = [];
  siteSearchResult: SearchResult[] = [];

  filtersFormGroup: FormGroup;
  propertiesOptions = Seed.propertiesOptions;
  premisesOptions = Seed.premisesOptions;
  propertiesModal?: BsModalRef;
  @ViewChild('modalProperties') modalProperties?: TemplateRef<void>;

  showModal() {
    this.propertiesModal = this.modalService.show(this.modalProperties!, {
      class: 'modal-lg',
    });
  }

  hideModal() {
    this.propertiesModal?.hide();
  }

  constructor(
    private ownerService: OwnerService,
    //private getAllEmployeeDto: GetAllEmployeeDTO,
    private formBuilder: FormBuilder,
    private toastAlertService: ToastAlertService,
    private modalService: BsModalService,
    private confirmDialogService: ConfirmDialogService,
    private queryStringBuilder: QueryStringBuilder,
    private router: Router,
  ) {
    this.filtersFormGroup = this.formBuilder.group({
      searchTerm: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.getAllOwners(this.page, this.pageSize);
  }

  pageChange(event: PageChangedEvent) {
    this.page = event.page;

    this.getAllOwners(
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
    this.getAllOwners(this.page, this.pageSize);
    this.showClearFilterBtn = false;
  }

  filterEmployees() {
    this.showClearFilterBtn = true;
    this.getAllOwners(
      this.page,
      this.pageSize,
      this.filtersFormGroup.value,
      false,
    );
  }

  async getAllOwners(
    page: number,
    pageSize: number,
    filters?: Record<string, string>,
    useCache = true,
  ) {
    this.isLoadingFetchingOwners = true;
    const urlParameters = this.queryStringBuilder.create(
      { page, limit: pageSize },
      this.filtersFormGroup,
    );

    this.ownerService.getAllOwners(`?${urlParameters}`, useCache).subscribe({
      next: (value) => {
        this.isLoadingFetchingOwners = false;
        this.totalLength = value.body.meta.total ?? 0;
        this.owners = GetAllOwnersMapper.fromResponse(value.body.owners);
        console.log(this.owners);
      },
      error: (err) => {
        console.log(err);
        this.isLoadingFetchingOwners = false;
      },
    });
  }

  deleteEmployee(id: string, fullName: string) {
    this.confirmDialogService.showDialog({
      title: `Êtes-vous sûr de vouloir supprimer ce bénéficiaire: ${fullName} ?`,
      message: `Êtes-vous sûr de vouloir supprimer ${fullName} ? Attention veuillez noter que cette action est irréversible`,
      cancelBtnTitle: 'Annuler',
      confirmBtnTitle: 'Confirmer',
      onConfirmClick: () => {
        this.isLoadingArchiveOwner = true;
        this.ownerService.deleteOwner(id).subscribe({
          next: (value) => {
            this.page = 1;
            this.getAllOwners(this.page, this.pageSize, {}, false);

            this.isLoadingArchiveOwner = false;
          },
          error: (err) => {
            console.log(err);
            this.isLoadingArchiveOwner = false;
          },
        });
      },
    });
  }

  redirectToDetails(id: string) {
    this.router.navigate([`./dashboard/owner/owner-details/${id}`]);
  }
}
