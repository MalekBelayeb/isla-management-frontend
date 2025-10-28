import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { QueryStringBuilder } from '@core/query-string-builder/query-string-builder';
import { Agreement } from '@dashboard/agreement/entity/agreement';
import { AgreeementMapper } from '@dashboard/agreement/mappers/agreement.mapper';
import { AgreementService } from '@dashboard/agreement/service/agreement.service';
import { ConfirmDialogService } from '@shared/confirm-dialog/confirm-dialog.service';
import { SearchResult } from '@shared/search-input/search-input.component';
import { ToastAlertService } from '@shared/toast-alert/toast-alert.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-agreements-list',
  templateUrl: './agreements-list.component.html',
  styleUrl: './agreements-list.component.css',
})
export class AgreementsListComponent implements OnInit {
  totalLength = 0;
  page = 1;
  pageSize = 10;

  agreements: Agreement[] = [];
  isLoadingFetchingAgreements = false;
  isLoadingArchiveOwner = false;

  groupSearchResult: SearchResult[] = [];
  activitySearchResult: SearchResult[] = [];
  siteSearchResult: SearchResult[] = [];

  filtersFormGroup: FormGroup;

  constructor(
    private agreementService: AgreementService,
    //private getAllEmployeeDto: GetAllEmployeeDTO,
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
    useCache = true,
  ) {
    this.isLoadingFetchingAgreements = true;

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

  onSelectedSiteSearchItem(event: SearchResult) {
    this.filtersFormGroup.get('siteId')?.setValue(event.id);
  }

  onSelectedActivitySearchItem(event: SearchResult) {
    this.filtersFormGroup.get('activityId')?.setValue(event.title);
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
