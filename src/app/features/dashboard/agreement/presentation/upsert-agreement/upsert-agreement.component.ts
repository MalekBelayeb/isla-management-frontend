import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AgreementDetails } from '@dashboard/agreement/entity/agreement-details';
import { AgreementService } from '@dashboard/agreement/service/agreement.service';
import { Apartment } from '@dashboard/apartment/entity/Apartment';
import { ApartmentMapper } from '@dashboard/apartment/mappers/apartment-mapper';
import { ApartmentService } from '@dashboard/apartment/service/apartment.service';
import { Tenant } from '@dashboard/tenant/entity/tenant';
import { TenantMapper } from '@dashboard/tenant/mappers/tenant-mapper';
import { TenantService } from '@dashboard/tenant/service/tenant.service';
import { DataTypes } from '@models/data';
import { SearchResult } from '@shared/search-input/search-input.component';
import { ToastAlertService } from '@shared/toast-alert/toast-alert.service';
import { apartmentPrefix, defaultSearchLimit } from 'src/app/variables/consts';

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
  focus8 = false;

  @Input() agreementDetails?: AgreementDetails;

  constructor(
    private formBuilder: FormBuilder,
    private agreementService: AgreementService,
    private toastAlertService: ToastAlertService,
  ) {
    this.formGroup = this.formBuilder.group({
      rentAmount: new FormControl('', Validators.required),
      startDate: new FormControl('', Validators.required),
      paymentFrequency: new FormControl(
        this.frequencyPaymentsTypeList[0].id,
        Validators.required,
      ),
      apartmentId: new FormControl('', Validators.required),
      tenantId: new FormControl('', Validators.required),
      documentUrl: new FormControl(''),
      notes: new FormControl(''),
    });
  }
  frequencyPaymentsTypeList: SearchResult[] =
    DataTypes.paymentFrequencyTypeList;

  tenantOptions: SearchResult[] = [];
  apartmentOptions: SearchResult[] = [];
  searchTenantValue: string = '';
  searchApartmentValue: string = '';
  paymentFrequencySearchValue: string =
    DataTypes.paymentFrequencyTypeList[0].title;

  onStartDateChange($event: Date) {
    this.formGroup
      .get('startDate')
      ?.setValue($event.toISOString().split('T')[0]);
  }

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
          ?.setValue(this.agreementDetails?.apartment?.id);
        this.formGroup
          .get('tenantId')
          ?.setValue(this.agreementDetails?.tenant?.id);
        this.formGroup
          .get('nbDaysOfTolerance')
          ?.setValue(this.agreementDetails?.nbDaysOfTolerance);
        this.formGroup
          .get('paymentFrequency')
          ?.setValue(
            DataTypes.paymentFrequencyTypeList.find(
              (item) => item.title === this.agreementDetails?.paymentFrequency,
            )?.id ?? '',
          );

        this.paymentFrequencySearchValue =
          DataTypes.paymentFrequencyTypeList.find(
            (item) => item.title === this.agreementDetails?.paymentFrequency,
          )?.title ?? '';

        this.searchTenantValue = `${this.agreementDetails.tenant?.fullname ?? ''}`;
        this.searchApartmentValue = `${this.agreementDetails.apartment?.idNumber ?? ''} - ${this.agreementDetails.apartment?.address ?? ''}`;
      }
    }
  }
  selectedPaymentFrequency(resultItem: SearchResult) {
    this.formGroup.get('paymentFrequency')?.setValue(resultItem.id);
  }
  ngOnInit(): void {
    const now = new Date();

    const startDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    ).toLocaleDateString('en-CA', {
      timeZone: 'Africa/Tunis',
    });

    this.formGroup.get('startDate')?.setValue(startDate.split('T')[0]);
  }

  get upsertAgreementForm() {
    return this.formGroup.controls;
  }

  onSelectedTenantSearchItem(tenant: Tenant) {
    this.formGroup.get('tenantId')?.setValue(tenant.id);
  }

  onSelectedApartmentSearchItem(apartment: Apartment) {
    this.formGroup.get('apartmentId')?.setValue(apartment.id);
  }

  upsertAgreement() {
    this.submitted = true;

    if (this.formGroup.invalid) return;
    this.isLoading = true;
    let body: any = {
      ...(this.agreementDetails && { id: this.agreementDetails.id }),
      //matricule: this.formGroup.get('matricule')?.value,
      rentAmount: this.formGroup.get('rentAmount')?.value,
      startDate: new Date(this.formGroup.get('startDate')?.value),
      paymentFrequency: this.formGroup.get('paymentFrequency')?.value,
      apartmentId: this.formGroup.get('apartmentId')?.value,
      tenantId: this.formGroup.get('tenantId')?.value,
      ...(this.formGroup.get('nbDaysOfTolerance')?.value && {
        nbDaysOfTolerance: Number(
          this.formGroup.get('nbDaysOfTolerance')?.value,
        ),
      }),
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
