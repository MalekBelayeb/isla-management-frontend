import { Component, OnInit } from '@angular/core';
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
import { defaultSearchLimit } from 'src/app/variables/consts';
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
  trimestersOptions: SearchResult[] = [];
  trimesterSearchValue?: SearchResult;

  propertyDetails?: PropertyDetails;
  financialBalance?: FinancialBalance;
  formGroup: FormGroup;
  isLoadingFetchingApartments = false;

  filtersFormGroup: FormGroup;

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

  ngOnInit(): void {
    this.trimestersOptions = this.getTrimesters().map(
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
    const trimester = this.getTrimesters().find((item) => item.name === id);
    this.filtersFormGroup
      .get('startDate')
      ?.setValue(trimester?.start.toISOString().split('T')[0]);
    this.filtersFormGroup
      .get('endDate')
      ?.setValue(trimester?.end.toISOString().split('T')[0]);
  }

  filterFinancialBalance() {
    this.getFinancialBalance(
      this.filtersFormGroup.get('startDate')?.value,
      this.filtersFormGroup.get('endDate')?.value,
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

  getFinancialBalance(startDate?: string, endDate?: string) {
    const params = {
      propertyId: this.getPropertyId(),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
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
        console.log(propertyDetails);
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

  getTrimesters() {
    const year = new Date().getFullYear();

    return Array.from({ length: 4 }, (_, i) => {
      const start = new Date(year, i * 3, 1);
      const end = new Date(year, (i + 1) * 3, 0);

      return {
        name: `T${i + 1}`,
        start,
        end,
      };
    });
  }

  getCurrentTrimestre(date = new Date()) {
    return this.getTrimesters().find(
      (item) => item.start <= date && date <= item.end,
    );
  }
}
