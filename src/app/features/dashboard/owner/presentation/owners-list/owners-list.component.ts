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
    this.clearInputValue = !this.clearInputValue;
    this.getAllOwners(this.page, this.pageSize);
    this.showClearFilterBtn = false;
  }

  exportAllEmployeeIsLoading = false;

  exportAllEmployees() {
    this.exportAllEmployeeIsLoading = true;
    /*this.employeeService.exportUsers().subscribe({
      next: (value) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(value);
        link.download = 'liste_des_bénéficiaires.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.exportAllEmployeeIsLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.exportAllEmployeeIsLoading = false;
      },
    });*/
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

  onSelectedSiteSearchItem(event: SearchResult) {
    this.filtersFormGroup.get('siteId')?.setValue(event.id);
  }

  onSelectedActivitySearchItem(event: SearchResult) {
    this.filtersFormGroup.get('activityId')?.setValue(event.title);
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

  verifyEmployee(id: string, fullName: string) {
    this.confirmDialogService.showDialog({
      title: `Êtes-vous sûr de vouloir vérifier ce bénéficiaire: ${fullName} ?`,
      message: ``,
      cancelBtnTitle: 'Annuler',
      confirmBtnTitle: 'Confirmer',
      onConfirmClick: () => {
        this.isLoadingArchiveOwner = true;
      },
    });
  }
}
