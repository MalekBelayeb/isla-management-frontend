import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApartmentService } from '@dashboard/apartment/service/apartment.service';
import { ApartmentDetails } from '@dashboard/apartment/entity/apartment-details';
import { ApartmentMapper } from '@dashboard/apartment/mappers/apartment-mapper';
import { ConfirmDialogService } from '@shared/confirm-dialog/confirm-dialog.service';
import { SearchResult } from '@shared/search-input/search-input.component';
import { ToastAlertService } from '@shared/toast-alert/toast-alert.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AgreementService } from '@dashboard/agreement/service/agreement.service';
import { conts, defaultSearchLimit } from 'src/app/variables/consts';
import { Agreement } from '@dashboard/agreement/entity/agreement';
import { AgreeementMapper } from '@dashboard/agreement/mappers/agreement.mapper';
import { Payment } from '@dashboard/payment/entity/payment';
import { PaymentService } from '@dashboard/payment/service/payment.service';
import { PaymentMapper } from '@dashboard/payment/mappers/payment-mapper';
import { FinancialBalance } from '@dashboard/payment/entity/financial-balance';

@Component({
  selector: 'app-apartment-details',
  templateUrl: './apartment-details.component.html',
  styleUrl: './apartment-details.component.css',
})
export class ApartmentDetailsComponent implements OnInit {
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  minDate = new Date();
  bsConfig = {
    isAnimated: true,
    containerClass: 'theme-red',
  };

  constructor(
    private route: ActivatedRoute,
    private apartmentService: ApartmentService,
    private agreementService: AgreementService,
    private paymentService: PaymentService,
    private confirmDialogService: ConfirmDialogService,
    private modalService: BsModalService,
    private toastAlertService: ToastAlertService,
  ) {
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];
  }

  apartmentDetails?: ApartmentDetails;
  financialBalance?: FinancialBalance;

  propertiesInitialList: SearchResult[] = [
    { id: '', title: 'B9 - 12 Rue Nozha, Ariana, Tunis' },
    { id: '', title: 'B6 - 36 Rue Yasmine, Ariana, Tunis' },
  ];
  ngOnInit(): void {
    this.getApartmentDetails();
    this.getAllAgreementByApartment(0, 10);
    this.getAllPaymentByApartment(0, 10);
    this.getFinancialBalance();
  }
  getApartmentId(): string {
    return this.route.snapshot.paramMap.get('id') ?? '';
  }
  getFinancialBalance() {
    const params = {
      apartmentId: this.getApartmentId(),
    };

    const queryString = new URLSearchParams(params).toString();
    this.paymentService.getFinancialBalance(`?${queryString}`).subscribe({
      next: (value) => {
        this.financialBalance = PaymentMapper.mapFinancialBalance(value.body);
      },
    });
  }
  getApartmentDetails() {
    console.log(this.getApartmentId());

    this.apartmentService.getApartment(this.getApartmentId()).subscribe({
      next: (value) => {
        const result = value.body;
        this.apartmentDetails = ApartmentMapper.mapApartmentDetails(result);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  isLoadingFetchingAgreements: boolean = false;
  agreements: Agreement[] = [];
  async getAllAgreementByApartment(
    page: number,
    pageSize: number,
    filters?: Record<string, string>,
    useCache = true,
  ) {
    this.isLoadingFetchingAgreements = true;
    const params = {
      apartmentId: this.getApartmentId(),
      limit: `${defaultSearchLimit}`,
    };

    const queryString = new URLSearchParams(params).toString();

    this.agreementService
      .getAllAgreement(`?${queryString}`, useCache)
      .subscribe({
        next: (value) => {
          this.isLoadingFetchingAgreements = false;

          this.agreements = AgreeementMapper.mapAgreements(value.body);
          console.log(this.agreements);
        },
        error: (err) => {
          this.isLoadingFetchingAgreements = false;

          console.log(err);
        },
      });
  }

  isLoadingFetchingPayments: boolean = false;
  payments: Payment[] = [];
  async getAllPaymentByApartment(
    page: number,
    pageSize: number,
    filters?: Record<string, string>,
    useCache = true,
  ) {
    this.isLoadingFetchingPayments = true;
    const params = {
      apartmentId: this.getApartmentId(),
      limit: `${defaultSearchLimit}`,
    };

    const queryString = new URLSearchParams(params).toString();

    this.paymentService.getAllPayments(`?${queryString}`, useCache).subscribe({
      next: (value) => {
        this.isLoadingFetchingPayments = false;

        this.payments = PaymentMapper.mapPayments(value.body);
        console.log(this.agreements);
      },
      error: (err) => {
        this.isLoadingFetchingPayments = false;

        console.log(err);
      },
    });
  }
}
