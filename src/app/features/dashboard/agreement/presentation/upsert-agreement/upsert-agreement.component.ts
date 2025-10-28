import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { agreementPeriodDateValidator } from '@core/form-validators/form-validators';
import { AgreementDetails } from '@dashboard/agreement/entity/agreement-details';
import { AgreementService } from '@dashboard/agreement/service/agreement.service';
import { ApartmentMapper } from '@dashboard/apartment/mappers/apartment-mapper';
import { ApartmentService } from '@dashboard/apartment/service/apartment.service';
import { TenantMapper } from '@dashboard/tenant/mappers/tenant-mapper';
import { TenantService } from '@dashboard/tenant/service/tenant.service';
import { DataTypes } from '@models/data';
import { SearchResult } from '@shared/search-input/search-input.component';
import { ToastAlertService } from '@shared/toast-alert/toast-alert.service';
import { conts, defaultSearchLimit } from 'src/app/variables/consts';

@Component({
  selector: 'app-upsert-agreement',
  templateUrl: './upsert-agreement.component.html',
  styleUrl: './upsert-agreement.component.css',
})
export class UpsertAgreementComponent implements OnInit {
  formGroup: FormGroup;
  submitted = false;
  isLoading = false;
  focus1 = false;
  focus2 = false;
  focus3 = false;
  focus4 = false;
  focus5 = false;
  focus6 = false;
  focus7 = false;

  @Input() agreementDetails?: AgreementDetails;

  constructor(
    private formBuilder: FormBuilder,
    private agreementService: AgreementService,
    private tenantService: TenantService,
    private apartmentService: ApartmentService,
    private toastAlertService: ToastAlertService,
  ) {
    this.formGroup = this.formBuilder.group(
      {
        matricule: new FormControl('', Validators.required),
        rentAmount: new FormControl('', Validators.required),
        startDate: new FormControl('', Validators.required),
        expireDate: new FormControl('', Validators.required),
        paymentFrequency: new FormControl(
          this.frequencyPaymentsTypeList[0].id,
          Validators.required,
        ),
        apartmentId: new FormControl('', Validators.required),
        tenantId: new FormControl('', Validators.required),
        deposit: new FormControl(''),
        firstDayOfPayment: new FormControl(''),
        documentUrl: new FormControl(''),
        notes: new FormControl(''),
      },
      { validators: [agreementPeriodDateValidator] },
    );
  }
  frequencyPaymentsTypeList: SearchResult[] =
    DataTypes.paymentFrequencyTypeList;

  tenantOptions: SearchResult[] = [];
  apartmentOptions: SearchResult[] = [];
  searchTenantValue: string = '';
  searchApartmentValue: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['agreementDetails'] &&
      !changes['agreementDetails'].firstChange
    ) {
      this.agreementDetails = changes['agreementDetails'].currentValue;
      if (this.agreementDetails) {
        this.formGroup
          .get('matricule')
          ?.setValue(this.agreementDetails?.matricule);
        this.formGroup
          .get('rentAmount')
          ?.setValue(this.agreementDetails?.rentAmount);
        this.formGroup
          .get('startDate')
          ?.setValue(this.agreementDetails?.startDate.toString().split('T')[0]);
        this.formGroup
          .get('expireDate')
          ?.setValue(
            this.agreementDetails?.expireDate.toString().split('T')[0],
          );
        this.formGroup.get('status')?.setValue(this.agreementDetails?.status);
        this.formGroup.get('deposit')?.setValue(this.agreementDetails?.deposit);
        this.formGroup
          .get('firstDayOfPayment')
          ?.setValue(
            this.agreementDetails?.firstDayOfPayment?.toString().split('T')[0],
          );
        this.formGroup
          .get('documentUrl')
          ?.setValue(this.agreementDetails?.documentUrl);
        this.formGroup.get('notes')?.setValue(this.agreementDetails?.notes);
        this.formGroup
          .get('apartmentId')
          ?.setValue(this.agreementDetails?.apartmentId);
        this.formGroup
          .get('tenantId')
          ?.setValue(this.agreementDetails?.tenantId);

        this.searchTenantValue = this.agreementDetails.tenant;
        this.searchApartmentValue = this.agreementDetails.apartment;
      }
    }
  }
  selectedPaymentFrequency(resultItem: SearchResult) {
    this.formGroup.get('paymentFrequency')?.setValue(resultItem.id);
  }
  ngOnInit(): void {}

  get upsertAgreementForm() {
    return this.formGroup.controls;
  }

  onSearchTenantValueChanged(searchValue?: string) {
    const params = {
      ...(searchValue && { searchValue }),
      limit: `${defaultSearchLimit}`,
    };

    const queryString = new URLSearchParams(params).toString();

    this.tenantService.getAllTenant(`?${queryString}`).subscribe({
      next: (value) => {
        const tenants = TenantMapper.mapTenants(value.body);
        this.tenantOptions = tenants.map((item) => ({
          id: item.id,
          title: `${item.matricule} - ${item.fullname}`,
        }));
      },
    });
  }
  onSelectedTenantSearchItem(searchResult: SearchResult) {
    this.formGroup.get('tenantId')?.setValue(searchResult.id);
  }

  onSearchApartmentValueChanged(searchValue?: string) {
    const params = {
      ...(searchValue && { searchValue }),
      limit: `${defaultSearchLimit}`,
    };

    const queryString = new URLSearchParams(params).toString();

    this.apartmentService.getAllApartments(`?${queryString}`).subscribe({
      next: (value) => {
        const apartments = ApartmentMapper.mapApartments(value.body);
        this.apartmentOptions = apartments.map((item) => ({
          id: item.id,
          title: `${item.matricule} - ${item.address}`,
        }));
      },
    });
  }
  onSelectedApartmentSearchItem(searchResult: SearchResult) {
    this.formGroup.get('apartmentId')?.setValue(searchResult.id);
  }

  upsertAgreement() {
    this.submitted = true;
    console.log(this.formGroup.controls);
    if (this.formGroup.invalid) return;
    this.isLoading = true;
    let body: any = {
      ...(this.agreementDetails && { id: this.agreementDetails.id }),
      matricule: this.formGroup.get('matricule')?.value,
      rentAmount: this.formGroup.get('rentAmount')?.value,
      startDate: new Date(this.formGroup.get('startDate')?.value),
      expireDate: new Date(this.formGroup.get('expireDate')?.value),
      paymentFrequency: this.formGroup.get('paymentFrequency')?.value,
      apartmentId: this.formGroup.get('apartmentId')?.value,
      tenantId: this.formGroup.get('tenantId')?.value,
      ...(this.formGroup.get('deposit')?.value && {
        deposit: this.formGroup.get('deposit')?.value,
      }),
      ...(this.formGroup.get('firstDayOfPayment')?.value && {
        firstDayOfPayment: new Date(
          this.formGroup.get('firstDayOfPayment')?.value,
        ),
      }),
      ...(this.formGroup.get('documentUrl')?.value && {
        documentUrl: this.formGroup.get('documentUrl')?.value,
      }),

      ...(this.formGroup.get('notes')?.value && {
        notes: this.formGroup.get('notes')?.value,
      }),
    };
    if (this.agreementDetails) {
      this.agreementService
        .updateAgreement(this.agreementDetails.id, body)
        .subscribe({
          next: (value) => {
            this.toastAlertService.showSuccessNotification(
              'Contrat modifié avec succés',
              'Contrat a été modifier avec succés',
            );
            this.isLoading = false;
          },
          error: (err) => {
            this.isLoading = false;
          },
        });
    } else {
      this.agreementService.createAgreement(body).subscribe({
        next: (value) => {
          this.toastAlertService.showSuccessNotification(
            'Contrat ajoutée avec succés',
            'Contrat a été créer avec succés',
          );
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
        },
      });
    }
  }
}
