import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { QueryStringBuilder } from '@core/query-string-builder/query-string-builder';
import { Payment } from '@dashboard/payment/entity/payment';
import { PaymentMapper } from '@dashboard/payment/mappers/payment-mapper';
import { PaymentService } from '@dashboard/payment/service/payment.service';
import { ConfirmDialogService } from '@shared/confirm-dialog/confirm-dialog.service';
import { SearchResult } from '@shared/search-input/search-input.component';
import { ToastAlertService } from '@shared/toast-alert/toast-alert.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrl: './payment-list.component.css',
})
export class PaymentListComponent implements OnInit {
  totalLength = 0;
  page = 1;
  pageSize = 10;

  payments: Payment[] = [];
  isLoadingFetchingPayments = false;
  isLoadingArchiveOwner = false;

  groupSearchResult: SearchResult[] = [];
  activitySearchResult: SearchResult[] = [];
  siteSearchResult: SearchResult[] = [];

  filtersFormGroup: FormGroup;

  constructor(
    private paymentService: PaymentService,
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
    this.getAllPayment(this.page, this.pageSize);
  }

  pageChange(event: PageChangedEvent) {
    this.page = event.page;
    this.getAllPayment(
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
    this.getAllPayment(this.page, this.pageSize);
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

  filterPayments() {
    this.showClearFilterBtn = true;
    this.getAllPayment(
      this.page,
      this.pageSize,
      this.filtersFormGroup.value,
      false,
    );
  }

  async getAllPayment(
    page: number,
    limit: number,
    filters?: Record<string, string>,
    useCache = true,
  ) {
    this.isLoadingFetchingPayments = true;

    const urlParameters = this.queryStringBuilder.create(
      { page, limit },
      this.filtersFormGroup,
    );

    this.paymentService
      .getAllPayments(`?${urlParameters}`, useCache)
      .subscribe({
        next: (value) => {
          this.isLoadingFetchingPayments = false;
          this.totalLength = value.body.meta.total;
          this.payments = PaymentMapper.mapPayments(value.body.payments);
          console.log(this.payments);
        },
        error: (err) => {
          this.isLoadingFetchingPayments = false;

          console.log(err);
        },
      });
  }

  deletePayment(id: string, fullName: string) {
    this.confirmDialogService.showDialog({
      title: `Êtes-vous sûr de vouloir supprimer ce paiement: ${fullName} ?`,
      message: `Êtes-vous sûr de vouloir supprimer ${fullName} ? Attention veuillez noter que cette action est irréversible`,
      cancelBtnTitle: 'Annuler',
      confirmBtnTitle: 'Confirmer',
      onConfirmClick: () => {
        this.isLoadingFetchingPayments = true;
        this.paymentService.deletePayment(id).subscribe({
          next: (value) => {
            this.page = 1;
            this.getAllPayment(this.page, this.pageSize, {}, false);

            this.isLoadingFetchingPayments = false;
          },
          error: (err) => {
            console.log(err);
            this.isLoadingFetchingPayments = false;
          },
        });
      },
    });
  }

  redirectToDetails(id: string) {
    this.router.navigate([`./dashboard/payment/payment-details/${id}`]);
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
