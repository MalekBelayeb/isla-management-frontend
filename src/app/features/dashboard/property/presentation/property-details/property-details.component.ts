import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmDialogService } from '@shared/confirm-dialog/confirm-dialog.service';
import { SearchResult } from '@shared/search-input/search-input.component';
import { ToastAlertService } from '@shared/toast-alert/toast-alert.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PropertyService } from '../../service/property.service';
import { ActivatedRoute } from '@angular/router';
import { PropertyDetails } from '../../entity/property-details';
import { PropertyMapper } from '@dashboard/property/mappers/property-mapper';
import { PaymentService } from '@dashboard/payment/service/payment.service';
import { PaymentMapper } from '@dashboard/payment/mappers/payment-mapper';
import { FinancialBalance } from '@dashboard/payment/entity/financial-balance';
import { ApartmentService } from '@dashboard/apartment/service/apartment.service';
import { ApartmentMapper } from '@dashboard/apartment/mappers/apartment-mapper';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Apartment } from '@dashboard/apartment/entity/Apartment';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type Trimester = {
  name: string;
  start: Date;
  end: Date;
};

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.css',
})
export class PropertyDetailsComponent implements OnInit {
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  minDate = new Date();
  bsConfig = {
    isAnimated: true,
    containerClass: 'theme-red',
  };
  filterDateType: 'dateToDate' | 'quarterly' = 'quarterly';
  trimestersDropdownOptions: SearchResult[] = [];
  trimesterSearchValue?: SearchResult;

  propertyDetails?: PropertyDetails;
  financialBalance?: FinancialBalance;
  formGroup: FormGroup;
  isLoadingFetchingApartments = false;

  filtersFormGroup: FormGroup;
  trimesters: Trimester[] = [];
  constructor(
    private formBuilder: FormBuilder,

    private route: ActivatedRoute,
    private confirmDialogService: ConfirmDialogService,
    private modalService: BsModalService,
    private toastAlertService: ToastAlertService,
    private propertyService: PropertyService,
    private paymentService: PaymentService,
    private apartmentService: ApartmentService,
  ) {
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];
    this.filtersFormGroup = this.formBuilder.group({
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      previousStartDate: new FormControl(''),
      previousEndDate: new FormControl(''),
    });
    this.formGroup = this.formBuilder.group({
      apartmentId: new FormControl('', Validators.required),
    });
  }
  submitted = false;
  isLoading = false;

  totalLength = 0;
  page = 1;
  pageSize = 10;
  apartments: Apartment[] = [];
  endDate: Date = new Date();
  previousEndDate?: Date;

  ngOnInit(): void {
    const year = new Date().getFullYear();
    const currentYearTrimersters = this.getTrimesters(year);
    const previousYearTrimesters = this.getTrimesters(year - 1);
    this.trimesters = [...previousYearTrimesters, ...currentYearTrimersters];

    this.trimestersDropdownOptions = this.trimesters.map(
      (item): SearchResult => ({
        id: item.name,
        title: `${item.name} - ${item.start.toLocaleDateString('fr-FR')} - ${item.end.toLocaleDateString('fr-FR')}`,
      }),
    );

    const currrentTrimstre = this.getCurrentTrimestre();

    if (currrentTrimstre) {
      this.trimesterSearchValue = {
        id: currrentTrimstre.name,
        title: `${currrentTrimstre.name} - ${currrentTrimstre.start.toLocaleDateString('fr-FR')} - ${currrentTrimstre.end.toLocaleDateString('fr-FR')}`,
      };
    }
    this.getPropertyDetails();
    this.getAllApartmentsByProperty(
      this.page,
      this.pageSize,
      { propertyId: this.getPropertyId() },
      false,
    );
    this.getFinancialBalance(
      currrentTrimstre?.start.toISOString().split('T')[0],
      currrentTrimstre?.end.toISOString().split('T')[0],
    );
  }

  get editApartmentForm() {
    return this.formGroup.controls;
  }

  getPropertyId(): string {
    return this.route.snapshot.paramMap.get('id') ?? '';
  }

  onSelectedTrimesterSearchItem($event: SearchResult) {
    const id = $event.id;

    const index = this.trimesters.findIndex((item) => item.name === id);

    const currentTrimester = index >= 0 ? this.trimesters[index] : null;
    const previousTrimester = index > 0 ? this.trimesters[index - 1] : null;
    this.previousEndDate = previousTrimester?.end;
    console.log(this.trimesters);

    if (currentTrimester) {
      this.filtersFormGroup
        .get('startDate')
        ?.setValue(currentTrimester?.start.toISOString().split('T')[0]);
      this.filtersFormGroup
        .get('endDate')
        ?.setValue(currentTrimester?.end.toISOString().split('T')[0]);
    }

    if (previousTrimester) {
      this.filtersFormGroup
        .get('previousStartDate')
        ?.setValue(previousTrimester?.start.toISOString().split('T')[0]);
      this.filtersFormGroup
        .get('previousEndDate')
        ?.setValue(previousTrimester?.end.toISOString().split('T')[0]);
    }
  }

  filterFinancialBalance() {
    this.getFinancialBalance(
      this.filtersFormGroup.get('startDate')?.value,
      this.filtersFormGroup.get('endDate')?.value,
      this.filtersFormGroup.get('previousStartDate')?.value,
      this.filtersFormGroup.get('previousEndDate')?.value,
    );
  }
  onStartDateChange($event: Date) {
    this.filtersFormGroup
      .get('startDate')
      ?.setValue($event.toISOString().split('T')[0]);
  }
  setDefaultRentStartDateAndRentEndDate() {
    const now = new Date();

    const startDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    ).toLocaleDateString('en-CA', {
      timeZone: 'Africa/Tunis',
    });

    const endDate = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
    ).toLocaleDateString('en-CA', {
      timeZone: 'Africa/Tunis',
    });
    this.filtersFormGroup.get('startDate')?.setValue(startDate.split('T')[0]);

    this.filtersFormGroup.get('endDate')?.setValue(endDate.split('T')[0]);
  }
  onEndDateChange($event: Date) {
    this.filtersFormGroup
      .get('endDate')
      ?.setValue($event?.toISOString().split('T')[0]);
  }

  getFinancialBalance(
    startDate?: string,
    endDate?: string,
    previousStartDate?: string,
    previousEndDate?: string,
  ) {
    const params = {
      propertyId: this.getPropertyId(),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(previousStartDate && { previousStartDate }),
      ...(previousEndDate && { previousEndDate }),
    };

    if (endDate) {
      this.endDate = new Date(endDate);
    }

    const queryString = new URLSearchParams(params).toString();
    this.paymentService.getFinancialBalance(`?${queryString}`).subscribe({
      next: (value) => {
        this.financialBalance = PaymentMapper.mapFinancialBalance(value.body);
      },
    });
  }
  getPropertyDetails() {
    this.propertyService.getProperty(this.getPropertyId()).subscribe({
      next: (value) => {
        const result = value.body;
        const propertyDetails = PropertyMapper.mapPropertyDetails(result);
        this.propertyDetails = propertyDetails;
      },
    });
  }

  pageChange(event: PageChangedEvent) {
    this.page = event.page;

    this.getAllApartmentsByProperty(
      this.page,
      this.pageSize,
      { propertyId: this.getPropertyId() },
      false,
    );
  }

  async getAllApartmentsByProperty(
    page: number,
    pageSize: number,
    filters?: Record<string, string>,
    useCache = true,
  ) {
    this.isLoadingFetchingApartments = true;
    const urlParameters = new URLSearchParams({
      page: `${page}`,
      limit: `${pageSize}`,
      ...filters,
    }).toString();
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

  getTrimesters(year: number): Trimester[] {
    return Array.from({ length: 4 }, (_, i) => {
      const start = new Date(year, i * 3, 1);
      const end = new Date(year, (i + 1) * 3, 0);

      return {
        name: `T${i + 1}-${year.toLocaleString().slice(-2)}`,
        start,
        end,
      };
    });
  }

  getCurrentTrimestre(date = new Date()) {
    const year = new Date().getFullYear();
    return this.getTrimesters(year).find(
      (item) => item.start <= date && date <= item.end,
    );
  }
  @ViewChild('printSection') printSection!: ElementRef;

  exportFinancialBalanceToPdf() {
    const content = this.printSection.nativeElement.outerHTML;
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print</title>
            <style>
              
            * {
            box-sizing: border-box;
          }
          body {
            font-family: Arial, sans-serif;
            font-size: 13px;
            color: #32325d;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 1rem;
          }
          table.table-bordered th,
          table.table-bordered td {
            border: 1px solid #dee2e6;
            padding: 0.6rem 0.85rem;
            vertical-align: middle;
          }
          table.table-borderless th,
          table.table-borderless td {
            border: none;
            padding: 0.25rem 0.5rem;
            vertical-align: middle;
          }
          thead th {
            background-color: #f6f9fc;
            font-size: 0.47rem;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            font-weight: 700;
            color: #8898aa;
            border-bottom: 2px solid #dee2e6;
          }
          tbody tr:nth-child(even) {
            background-color: #fafbff;
          }
          h4 {
            font-size: 0.47rem;
            font-weight: 600;
            margin: 0;
          }
          .text-warning {
            color: #fb6340;
          }
          .text-success {
            color: #2dce89;
          }
          .d-flex {
            display: flex;
          }
          .justify-content-end {
            justify-content: flex-end;
          }
          .row {
            display: flex;
            flex-wrap: wrap;
            margin-right: -10px;
            margin-left: -10px;
          }
          .col-6 {
            flex: 0 0 50%;
            max-width: 50%;
            padding: 0 10px;
          }
          .mr-3 {
            margin-right: 0.75rem;
          }
            
            </style>
          </head>
          <body>${content}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  }
}
