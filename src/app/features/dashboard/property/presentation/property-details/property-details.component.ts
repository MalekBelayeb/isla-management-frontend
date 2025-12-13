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

  propertyDetails?: PropertyDetails;
  financialBalance?: FinancialBalance;
  formGroup: FormGroup;
  isLoadingFetchingApartments = false;

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

  ngOnInit(): void {
    this.getPropertyDetails();
    this.getAllApartmentsByProperty(
      this.page,
      this.pageSize,
      { propertyId: this.getPropertyId() },
      false,
    );
    this.getFinancialBalance();
  }

  get editApartmentForm() {
    return this.formGroup.controls;
  }

  getPropertyId(): string {
    return this.route.snapshot.paramMap.get('id') ?? '';
  }

  getFinancialBalance() {
    const params = {
      propertyId: this.getPropertyId(),
    };

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
}
