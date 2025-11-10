import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';
import { ActivatedRoute } from '@angular/router';
import { ConfirmDialogService } from '@shared/confirm-dialog/confirm-dialog.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastAlertService } from '@shared/toast-alert/toast-alert.service';
import { TenantService } from '@dashboard/tenant/service/tenant.service';
import { TenantDetails } from '@dashboard/tenant/entity/tenant-details';
import { TenantMapper } from '@dashboard/tenant/mappers/tenant-mapper';
import { Agreement } from '@dashboard/agreement/entity/agreement';
import { AgreeementMapper } from '@dashboard/agreement/mappers/agreement.mapper';
import { AgreementService } from '@dashboard/agreement/service/agreement.service';
import { conts, defaultSearchLimit } from 'src/app/variables/consts';
import { Payment } from '@dashboard/payment/entity/payment';
import { PaymentService } from '@dashboard/payment/service/payment.service';
import { PaymentMapper } from '@dashboard/payment/mappers/payment-mapper';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-tenant-details',
  templateUrl: './tenant-details.component.html',
  styleUrl: './tenant-details.component.css',
})
export class TenantDetailsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private tenantService: TenantService,
    private agreementService: AgreementService,
    private paymentService: PaymentService,
    private confirmDialogService: ConfirmDialogService,
    private modalService: BsModalService,
    private toastAlertService: ToastAlertService,
  ) {}

  tenantDetails?: TenantDetails;

  ngOnInit() {
    var calendarEl = document.getElementById('widget-calendar');
    if (!calendarEl) return;
    var calendar = new Calendar(calendarEl, {
      plugins: [interactionPlugin, dayGridPlugin, multiMonthPlugin],
      initialView: 'multiMonthYear',
      selectable: true,
      headerToolbar: false,
      contentHeight: 'auto',
      initialDate: '2025-01-01',
      editable: true,
      events: [
        {
          title: 'Paiement Loyer Janvier',
          start: '2025-01-01',
          end: '2025-01-05',
          className: 'bg-primary',
          editable: true,
          durationEditable: true,
        },

        {
          title: 'Paiement Loyer Février',
          start: '2025-02-10',
          end: '2025-02-15',
          className: 'bg-red',
          editable: true,
          durationEditable: true,
        },

        {
          title: 'Paiement Loyer Ma',
          start: '2025-03-01',
          end: '2025-03-05',
          className: 'bg-primary',
          editable: true,
          durationEditable: true,
        },

        {
          title: 'Paiement Loyer Ma',
          start: '2025-04-01',
          end: '2025-04-05',
          className: 'bg-primary',
          editable: true,
          durationEditable: true,
        },

        {
          title: 'Paiement Loyer Ma',
          start: '2025-05-01',
          end: '2025-05-05',
          className: 'bg-primary',
          editable: true,
          durationEditable: true,
        },
        {
          title: 'Paiement Loyer Ma',
          start: '2025-06-01',
          end: '2025-06-05',
          className: 'bg-primary',
          editable: true,
          durationEditable: true,
        },
      ],
    });

    calendar.render();

    //Display Current Date as Calendar widget header
    var mYear = moment().format('YYYY');
    var mDay = moment().format('dddd, MMM D');
    document.getElementsByClassName('widget-calendar-year')[0].innerHTML =
      mYear;
    document.getElementsByClassName('widget-calendar-day')[0].innerHTML = mDay;
    this.getTenantDetails();
    this.getAllAgreementByTenant(
      this.getAllAgreementByTenantPage,
      this.getAllAgreementByTenantPageSize,
    );
    this.getAllPaymentByTenant(
      this.getAllPaymentByTenantPage,
      this.getAllPaymentByTenantPageSize,
    );
  }

  getTenantId(): string {
    return this.route.snapshot.paramMap.get('id') ?? '';
  }

  getTenantDetails() {
    console.log(this.getTenantId());

    this.tenantService.getTenant(this.getTenantId()).subscribe({
      next: (value) => {
        const result = value.body;
        //this.apartmentDetails = ApartmentMapper.mapApartmentDetails(result);
        this.tenantDetails = TenantMapper.mapTenantDetails(result);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  isLoadingFetchingAgreements: boolean = false;
  agreements: Agreement[] = [];

  getAllAgreementByTenantTotalLength = 0;
  getAllAgreementByTenantPage = 1;
  getAllAgreementByTenantPageSize = 5;

  getAllAgreementByTenantPageChange(event: PageChangedEvent) {
    this.getAllAgreementByTenantPage = event.page;
    this.getAllAgreementByTenant(
      this.getAllAgreementByTenantPage,
      this.getAllAgreementByTenantPageSize,
      {},
      false,
    );
  }
  async getAllAgreementByTenant(
    page: number,
    pageSize: number,
    filters?: Record<string, string>,
    useCache = true,
  ) {
    this.isLoadingFetchingAgreements = true;
    const params = {
      tenantId: this.getTenantId(),
      limit: `${pageSize}`,
      page: `${page}`,
    };

    const queryString = new URLSearchParams(params).toString();

    this.agreementService
      .getAllAgreement(`?${queryString}`, useCache)
      .subscribe({
        next: (value) => {
          this.isLoadingFetchingAgreements = false;
          this.getAllAgreementByTenantTotalLength = value.body.meta.total;

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

  isLoadingFetchingPayments: boolean = false;
  payments: Payment[] = [];
  getAllPaymentByTenantTotalLength = 0;
  getAllPaymentByTenantPage = 1;
  getAllPaymentByTenantPageSize = 5;

  getAllPaymentByTenantPageChange(event: PageChangedEvent) {
    this.getAllPaymentByTenantPage = event.page;
    this.getAllPaymentByTenant(
      this.getAllPaymentByTenantPage,
      this.getAllPaymentByTenantPageSize,
      {},
      false,
    );
  }

  async getAllPaymentByTenant(
    page: number,
    pageSize: number,
    filters?: Record<string, string>,
    useCache = true,
  ) {
    this.isLoadingFetchingPayments = true;
    const params = {
      tenantId: this.getTenantId(),
      limit: `${pageSize}`,
      page: `${page}`,
    };

    const queryString = new URLSearchParams(params).toString();

    this.paymentService.getAllPayments(`?${queryString}`, useCache).subscribe({
      next: (value) => {
        this.isLoadingFetchingPayments = false;
        this.getAllPaymentByTenantTotalLength = value.body.meta.total;

        this.payments = PaymentMapper.mapPayments(value.body.payments);
      },
      error: (err) => {
        this.isLoadingFetchingPayments = false;

        console.log(err);
      },
    });
  }
}
