import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ReceiptIncomePaymentComponent } from '@dashboard/payment/presentation/receipt-income-payment/receipt-income-payment.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  agreementIdFieldRequiredIfcategoryIsRentValidator,
  bankFieldRequiredIfMethodIsCheckValidator,
  checkNumberFieldRequiredIfMethodIsCheckValidator,
  transferNumberFieldRequiredIfMethodIsTransferValidator,
} from '@core/form-validators/form-validators';
import { Agreement } from '@dashboard/agreement/entity/agreement';
import { AgreementDetails } from '@dashboard/agreement/entity/agreement-details';
import { PaymentDetails } from '@dashboard/payment/entity/payment-details';
import { PaymentService } from '@dashboard/payment/service/payment.service';
import { RentPaymentPeriodService } from '@dashboard/payment/service/rent-payment-period.service';
import { TenantMapper } from '@dashboard/tenant/mappers/tenant-mapper';
import { TenantService } from '@dashboard/tenant/service/tenant.service';
import { DataTypes } from '@models/data';
import { SearchResult } from '@shared/search-input/search-input.component';
import { ToastAlertService } from '@shared/toast-alert/toast-alert.service';
import { propertyPrefix } from 'src/app/variables/consts';

@Component({
  selector: 'app-upsert-income-payment',
  templateUrl: './upsert-income-payment.component.html',
  styleUrl: './upsert-income-payment.component.css',
})
export class UpsertIncomePaymentComponent implements OnInit {
  incomeFormGroup: FormGroup;
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
  focus9 = false;
  focus10 = false;
  focus11 = false;
  focus12 = false;

  withTax: boolean = false;

  @Input() paymentDetails?: PaymentDetails;
  paymentId?: string;

  @ViewChild(ReceiptIncomePaymentComponent)
  receiptIncomeComponent?: ReceiptIncomePaymentComponent;

  agreement?: AgreementDetails;

  searchAgreementValue = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private tenantService: TenantService,
    private toastAlertService: ToastAlertService,
    private rentPaymentPeriodService: RentPaymentPeriodService,
  ) {
    this.incomeFormGroup = this.formBuilder.group({});
    this.setFormToDefaultState();
  }

  paymentMethodTypeList: SearchResult[] = DataTypes.paymentMethodTypeList;
  propertyPrefix: string = propertyPrefix;
  paymentTypeList: SearchResult[] = DataTypes.paymentTypeList;

  incomePaymentCategoryList: SearchResult[] =
    DataTypes.incomePaymentCategoryList;

  searchIncomePaymentCategoryValue: string =
    this.incomePaymentCategoryList[0].title;

  searchIncomePaymentMethodValue: string = this.paymentMethodTypeList[0].title;

  setFormToDefaultState() {
    this.incomeFormGroup = this.formBuilder.group(
      {
        amount: new FormControl('', Validators.required),
        extraCharge: new FormControl(0),
        label: new FormControl(''),
        rentStartDate: new FormControl(''),
        rentEndDate: new FormControl(''),
        paymentDate: new FormControl(''),
        category: new FormControl(
          this.incomePaymentCategoryList[0].id,
          Validators.required,
        ),
        method: new FormControl(
          this.paymentMethodTypeList[0].id,
          Validators.required,
        ),
        agreementId: new FormControl('', Validators.required),
        tva: new FormControl(0),
        notes: new FormControl(''),
        bank: new FormControl(''),
        checkNumber: new FormControl(''),
        transferNumber: new FormControl(''),
      },
      {
        validators: [
          agreementIdFieldRequiredIfcategoryIsRentValidator,
          bankFieldRequiredIfMethodIsCheckValidator,
          checkNumberFieldRequiredIfMethodIsCheckValidator,
          transferNumberFieldRequiredIfMethodIsTransferValidator,
        ],
      },
    );

    this.setDefaultStartDateAndEndDate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // No firstChange guard: the parent renders this form only once paymentDetails
    // is loaded, so the value already arrives on the first change
    if (changes['paymentDetails']) {
      this.paymentDetails = changes['paymentDetails'].currentValue;
      this.paymentId = this.paymentDetails?.id;
      if (this.paymentDetails) {
        const categoryId =
          DataTypes.incomePaymentCategoryList.find((item) => {
            return item.title === this.paymentDetails?.category;
          })?.id ?? '';
        const paymentMethodId =
          DataTypes.paymentMethodTypeList.find((item) => {
            return item.title === this.paymentDetails?.method;
          })?.id ?? '';
        this.incomeFormGroup
          .get('amount')
          ?.setValue(this.paymentDetails?.amount);
        this.incomeFormGroup
          .get('extraCharge')
          ?.setValue(this.paymentDetails?.extraCharge);
        this.incomeFormGroup.get('method')?.setValue(paymentMethodId);
        this.incomeFormGroup.get('label')?.setValue(this.paymentDetails?.label);
        this.incomeFormGroup
          .get('rentStartDate')
          ?.setValue(
            this.paymentDetails?.rentStartDate?.toString().split('T')[0],
          );
        this.incomeFormGroup
          .get('rentEndDate')
          ?.setValue(
            this.paymentDetails?.rentEndDate?.toString().split('T')[0],
          );
        this.incomeFormGroup.get('type')?.setValue(this.paymentDetails?.type);
        this.incomeFormGroup.get('tva')?.setValue(this.paymentDetails?.tva);
        this.incomeFormGroup.get('bank')?.setValue(this.paymentDetails?.bank);
        this.incomeFormGroup
          .get('checkNumber')
          ?.setValue(this.paymentDetails?.checkNumber ?? '');
        this.incomeFormGroup
          .get('transferNumber')
          ?.setValue(this.paymentDetails?.transferNumber ?? '');

        this.incomeFormGroup.get('category')?.setValue(categoryId);
        this.incomeFormGroup
          .get('agreementId')
          ?.setValue(this.paymentDetails?.agreementId);

        this.incomeFormGroup
          .get('paymentDate')
          ?.setValue(this.paymentDetails?.paymentDate.toString().split('T')[0]);
        this.incomeFormGroup.get('notes')?.setValue(this.paymentDetails?.notes);

        this.searchIncomePaymentCategoryValue = this.paymentDetails?.category;

        this.searchIncomePaymentMethodValue = this.paymentDetails?.method ?? '';

        this.searchAgreementValue = `${this.paymentDetails.agreement} - ${this.paymentDetails.apartment}`;
        this.withTax = !!this.paymentDetails.tva;
      }
    }
  }

  selectedPaymentCategory(resultItem: SearchResult) {
    this.incomeFormGroup.get('category')?.setValue(resultItem.id);
    if (resultItem.id !== 'rent') {
      this.incomeFormGroup.get('rentStartDate')?.setValue(undefined);
      this.incomeFormGroup.get('rentEndDate')?.setValue(undefined);
    } else {
      this.setRentIntervalToCurrentMonth();
    }
  }

  selectedPaymentMethod(resultItem: SearchResult) {
    this.incomeFormGroup.get('method')?.setValue(resultItem.id);
    this.submitted = false;
  }

  onChangeWithTaxType($event: boolean) {
    this.withTax = $event;
  }

  setRentIntervalToCurrentMonth() {
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
    this.incomeFormGroup
      .get('rentStartDate')
      ?.setValue(startDate.split('T')[0]);

    this.incomeFormGroup.get('rentEndDate')?.setValue(endDate.split('T')[0]);
  }

  setDefaultPaymentDate() {
    const now = new Date();
    const todayDate = now.toLocaleDateString('en-CA', {
      timeZone: 'Africa/Tunis',
    });
    this.incomeFormGroup.get('paymentDate')?.setValue(todayDate.split('T')[0]);
  }

  setDefaultStartDateAndEndDate() {
    this.setDefaultPaymentDate();
  }

  ngOnInit(): void {
    // Edit mode: keep the values filled by ngOnChanges
    if (this.paymentDetails) return;

    this.setDefaultStartDateAndEndDate();

    this.setAgreementByTenant();
  }

  setAgreementByTenant() {
    const idTenant = this.route.snapshot.paramMap.get('idTenant') ?? '';
    if (!idTenant) return;
    this.tenantService.getTenant(idTenant).subscribe({
      next: (value) => {
        this.agreement = TenantMapper.mapTenantDetails(value.body).agreement;
        console.log(this.agreement);
        if (!this.agreement) return;
        let paymentDateRange;
        if (this.agreement?.payment?.rentStartDate) {
          paymentDateRange =
            this.rentPaymentPeriodService.getNextRentPaymentPeriod(
              this.agreement?.payment?.rentStartDate,
              this.agreement?.payment?.rentEndDate,
            );
        } else {
          if (this.agreement?.startDate) {
            paymentDateRange =
              this.rentPaymentPeriodService.getNextRentPaymentPeriod(
                this.agreement?.startDate,
              );
          } else {
            this.setDefaultStartDateAndEndDate();
          }
        }

        if (paymentDateRange) {
          this.incomeFormGroup.get('rentStartDate')?.setValue(
            paymentDateRange.startDate
              .toLocaleDateString('en-CA', {
                timeZone: 'Africa/Tunis',
              })
              .split('T')[0],
          );
          this.incomeFormGroup.get('rentEndDate')?.setValue(
            paymentDateRange.endDate
              .toLocaleDateString('en-CA', {
                timeZone: 'Africa/Tunis',
              })
              .split('T')[0],
          );
        }

        this.incomeFormGroup
          .get('amount')
          ?.setValue(this.agreement?.rentAmount);
        this.searchAgreementValue = `${this.agreement?.matricule} - ${this.agreement?.apartment?.idNumber} - ${this.agreement?.apartment?.address}`;
        this.incomeFormGroup
          .get('agreementId')
          ?.setValue(this.agreement?.id ?? '');
      },
    });
  }

  onAgreementSelected(agreement: Agreement | undefined) {
    this.incomeFormGroup.get('agreementId')?.setValue(agreement?.id ?? '');
    if (!agreement) {
      this.searchAgreementValue = '';
      this.agreement = undefined;
    }
  }

  onStartDateChange($event: Date) {
    this.incomeFormGroup
      .get('rentStartDate')
      ?.setValue($event.toISOString().split('T')[0]);
  }

  onPaymentDateChange($event: Date) {
    this.incomeFormGroup
      .get('paymentDate')
      ?.setValue($event.toISOString().split('T')[0]);
  }

  onEndDateChange($event: Date) {
    this.incomeFormGroup
      .get('rentEndDate')
      ?.setValue($event?.toISOString().split('T')[0]);
  }

  getTVAValue() {
    if (this.withTax) {
      return this.incomeFormGroup.get('tva')?.value;
    }

    return 0;
  }

  upsertPayment() {
    this.submitted = true;
    console.log(this.incomeFormGroup.errors);
    if (this.incomeFormGroup.invalid) return;
    this.isLoading = true;
    let incomeBody = {};

    const getPaymentDate = () => {
      const d = new Date(this.incomeFormGroup.get('paymentDate')?.value);
      const n = new Date();
      d.setHours(
        n.getHours(),
        n.getMinutes(),
        n.getSeconds(),
        n.getMilliseconds(),
      );
      return d;
    }; // add current time to date (for exact sorting)

    incomeBody = {
      type: 'income',
      amount: this.incomeFormGroup.get('amount')?.value,
      extraCharge: this.incomeFormGroup.get('extraCharge')?.value,
      category: this.incomeFormGroup.get('category')?.value,
      label: this.incomeFormGroup.get('label')?.value,
      rentStartDate: new Date(this.incomeFormGroup.get('rentStartDate')?.value),
      rentEndDate: new Date(this.incomeFormGroup.get('rentEndDate')?.value),
      method: this.incomeFormGroup.get('method')?.value,
      agreementId: this.incomeFormGroup.get('agreementId')?.value,
      paymentDate: getPaymentDate(),
      ...(this.incomeFormGroup.get('notes')?.value && {
        notes: this.incomeFormGroup.get('notes')?.value,
      }),
      tva: this.getTVAValue(),
      bank: this.incomeFormGroup.get('bank')?.value,
      checkNumber: `${this.incomeFormGroup.get('checkNumber')?.value}`,
      transferNumber: `${this.incomeFormGroup.get('transferNumber')?.value}`,
    };

    let body: any = {
      ...(this.paymentDetails && { id: this.paymentDetails.id }),
      ...incomeBody,
    };

    if (this.paymentDetails) {
      this.paymentService
        .updatePayment(this.paymentDetails.id, body)
        .subscribe({
          next: (value) => {
            const result = value.body;
            this.paymentId = result.id;
            // Same id after an update: the input setter won't fire, so reload explicitly
            this.receiptIncomeComponent?.getPaymentDetails(this.paymentId);

            this.toastAlertService.showSuccessNotification(
              'Paiement modifié avec succés',
              'Paiement a été modifier avec succés',
            );
            this.isLoading = false;
            this.submitted = false;
          },
          error: (err) => {
            this.isLoading = false;
          },
        });
    } else {
      this.paymentService.createPayment(body).subscribe({
        next: (value) => {
          const result = value.body;
          // The receipt doesn't exist yet (*ngIf): setting the id renders it,
          // and its paymentId input setter loads the data
          this.paymentId = result.id;

          this.toastAlertService.showSuccessNotification(
            'Paiement ajoutée avec succés',
            'Paiement a été créer avec succés',
          );
          this.isLoading = false;
          this.submitted = false;
        },
        error: (err) => {
          this.isLoading = false;
        },
      });
    }
  }
}
