import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ReceiptExpensePaymentComponent } from '@dashboard/payment/presentation/receipt-expense-payment/receipt-expense-payment.component';
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
import { Property } from '@dashboard/property/entity/property';
import { TenantMapper } from '@dashboard/tenant/mappers/tenant-mapper';
import { TenantService } from '@dashboard/tenant/service/tenant.service';
import { DataTypes } from '@models/data';
import { SearchResult } from '@shared/search-input/search-input.component';
import { ToastAlertService } from '@shared/toast-alert/toast-alert.service';
import { propertyPrefix } from 'src/app/variables/consts';

@Component({
  selector: 'app-upsert-expense-payment',
  templateUrl: './upsert-expense-payment.component.html',
  styleUrl: './upsert-expense-payment.component.css',
})
export class UpsertExpensePaymentComponent implements OnInit {

  expenseFormGroup: FormGroup;

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

  @ViewChild(ReceiptExpensePaymentComponent)
  receiptExpenseComponent?: ReceiptExpensePaymentComponent;

  agreement?: AgreementDetails;

  paymentType: 'income' | 'expense' | 'expense_agency' = 'income';

  searchAgreementValue = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private tenantService: TenantService,
    private toastAlertService: ToastAlertService,
    private rentPaymentPeriodService: RentPaymentPeriodService,
  ) {
    this.expenseFormGroup = this.formBuilder.group({});
    this.setFormToDefaultState();
  }

  paymentMethodTypeList: SearchResult[] = DataTypes.paymentMethodTypeList;
  propertyPrefix: string = propertyPrefix;
  paymentTypeList: SearchResult[] = DataTypes.paymentTypeList;

  incomePaymentCategoryList: SearchResult[] =
    DataTypes.incomePaymentCategoryList;

  expensePaymentCategoryList: SearchResult[] =
    DataTypes.expensePaymentCategoryList;

  searchIncomePaymentCategoryValue: string =
    this.incomePaymentCategoryList[0].title;

  searchExpensePaymentCategoryValue: string =
    this.expensePaymentCategoryList[0].title;

  searchTypeValue: string = this.paymentTypeList[0].title;

  searchIncomePaymentMethodValue: string = this.paymentMethodTypeList[0].title;
  searchExpensePaymentMethodValue: string = this.paymentMethodTypeList[0].title;

  propertySelectedValue = '';

  setFormToDefaultState() {
    this.expenseFormGroup = this.formBuilder.group(
      {
        amount: new FormControl('', Validators.required),
        label: new FormControl(''),
        paymentDate: new FormControl(''),
        category: new FormControl(
          this.expensePaymentCategoryList[0].id,
          Validators.required,
        ),
        method: new FormControl(
          this.paymentMethodTypeList[0].id,
          Validators.required,
        ),
        propertyId: new FormControl('', Validators.required),
        notes: new FormControl(''),
        bank: new FormControl(''),
        checkNumber: new FormControl(''),
        transferNumber: new FormControl(''),
      },
      {
        validators: [
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
        this.paymentType = this.paymentDetails.type as typeof this.paymentType;

        const paymentMethodId =
          DataTypes.paymentMethodTypeList.find((item) => {
            return item.title === this.paymentDetails?.method;
          })?.id ?? '';

        if (
          this.paymentType === 'expense' ||
          this.paymentType === 'expense_agency'
        ) {
          const categoryId =
            DataTypes.expensePaymentCategoryList.find((item) => {
              return item.title === this.paymentDetails?.category;
            })?.id ?? '';

          this.expenseFormGroup
            .get('amount')
            ?.setValue(this.paymentDetails?.amount);
          this.expenseFormGroup.get('method')?.setValue(paymentMethodId);
          this.expenseFormGroup
            .get('label')
            ?.setValue(this.paymentDetails?.label);
          this.expenseFormGroup
            .get('bank')
            ?.setValue(this.paymentDetails?.bank);
          this.expenseFormGroup
            .get('checkNumber')
            ?.setValue(this.paymentDetails?.checkNumber ?? '');
          this.expenseFormGroup
            .get('transferNumber')
            ?.setValue(this.paymentDetails?.transferNumber ?? '');

          this.expenseFormGroup
            .get('type')
            ?.setValue(this.paymentDetails?.type);
          this.expenseFormGroup.get('category')?.setValue(categoryId);
          if (this.paymentType === 'expense') {
            this.expenseFormGroup
              .get('propertyId')
              ?.setValue(this.paymentDetails?.property?.id);
          }
          this.expenseFormGroup
            .get('paymentDate')
            ?.setValue(
              this.paymentDetails?.paymentDate.toString().split('T')[0],
            );
          this.expenseFormGroup
            .get('notes')
            ?.setValue(this.paymentDetails?.notes);

          this.propertySelectedValue = `${this.paymentDetails.property?.idNumber} - ${this.paymentDetails.property?.address}`;
          this.searchExpensePaymentCategoryValue = this.paymentDetails.category;
          this.searchExpensePaymentMethodValue = this.paymentDetails.method;
        }
      }
    }
  }

  selectedPaymentCategory(resultItem: SearchResult) {
    this.expenseFormGroup.get('category')?.setValue(resultItem.id);
    if (resultItem.id !== 'rent') {
      this.expenseFormGroup.get('rentStartDate')?.setValue(undefined);
      this.expenseFormGroup.get('rentEndDate')?.setValue(undefined);
    } else {
      this.setRentIntervalToCurrentMonth();
    }
  }

  selectedPaymentMethod(resultItem: SearchResult) {
    this.expenseFormGroup.get('method')?.setValue(resultItem.id);
    this.submitted = false;
  }

  onChangePaymentType($event: 'income' | 'expense') {
    this.paymentType = $event;
    this.submitted = false;
    this.setFormToDefaultState();
    if (this.paymentType === 'income') {
      this.setAgreementByTenant();
    }
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
  }

  setDefaultPaymentDate() {
    const now = new Date();
    const todayDate = now.toLocaleDateString('en-CA', {
      timeZone: 'Africa/Tunis',
    });
    this.expenseFormGroup.get('paymentDate')?.setValue(todayDate.split('T')[0]);
  }

  setDefaultStartDateAndEndDate() {
    this.setDefaultPaymentDate();
  }

  ngOnInit(): void {
    // Edit mode: keep the values filled by ngOnChanges
    if (this.paymentDetails) return;

    // Preselect the type when coming from the income or expense list
    const type = this.route.snapshot.queryParamMap.get('type');
    if (!this.paymentDetails && type === 'expense') {
      this.paymentType = 'expense';
      this.setFormToDefaultState();
    }

    this.setDefaultStartDateAndEndDate();

    this.setAgreementByTenant();
  }

  setAgreementByTenant() {
    const idTenant = this.route.snapshot.paramMap.get('idTenant') ?? '';
    if (idTenant) {
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

          this.searchAgreementValue = `${this.agreement?.matricule} - ${this.agreement?.apartment?.idNumber} - ${this.agreement?.apartment?.address}`;
        },
      });
    }
  }
  onPropertySelected(property: Property | undefined) {
    this.expenseFormGroup.get('propertyId')?.setValue(property?.id ?? '');
    this.propertySelectedValue = property
      ? `${property.idNumber} - ${property.address}`
      : '';
  }

  onPaymentDateChange($event: Date) {
    this.expenseFormGroup
      .get('paymentDate')
      ?.setValue($event.toISOString().split('T')[0]);
  }

  upsertPayment() {
    this.submitted = true;
    if (this.expenseFormGroup.invalid) return;
    this.isLoading = true;
    let expenseBody = {};
    let expenseAgencyBody = {};

    const getPaymentDate = () => {
      const d = new Date(this.expenseFormGroup.get('paymentDate')?.value);
      const n = new Date();
      d.setHours(
        n.getHours(),
        n.getMinutes(),
        n.getSeconds(),
        n.getMilliseconds(),
      );
      return d;
    }; // add current time to date (for exact sorting)

    if (this.paymentType === 'expense') {
      expenseBody = {
        type: 'expense',
        amount: this.expenseFormGroup.get('amount')?.value,
        category: this.expenseFormGroup.get('category')?.value,
        label: this.expenseFormGroup.get('label')?.value,
        method: this.expenseFormGroup.get('method')?.value,
        propertyId: this.expenseFormGroup.get('propertyId')?.value,
        paymentDate: getPaymentDate(),
        ...(this.expenseFormGroup.get('notes')?.value && {
          notes: this.expenseFormGroup.get('notes')?.value,
        }),
        rentStartDate: null,
        rentEndDate: null,
        bank: this.expenseFormGroup.get('bank')?.value,
        checkNumber: `${this.expenseFormGroup.get('checkNumber')?.value}`,
        transferNumber: `${this.expenseFormGroup.get('transferNumber')?.value}`,
      };
    }

    if (this.paymentType === 'expense_agency') {
      expenseAgencyBody = {
        type: 'expense_agency',
        amount: this.expenseFormGroup.get('amount')?.value,
        category: this.expenseFormGroup.get('category')?.value,
        label: this.expenseFormGroup.get('label')?.value,
        method: this.expenseFormGroup.get('method')?.value,
        paymentDate: getPaymentDate(),
        ...(this.expenseFormGroup.get('notes')?.value && {
          notes: this.expenseFormGroup.get('notes')?.value,
        }),
        rentStartDate: null,
        rentEndDate: null,
        bank: this.expenseFormGroup.get('bank')?.value,
        checkNumber: `${this.expenseFormGroup.get('checkNumber')?.value}`,
        transferNumber: `${this.expenseFormGroup.get('transferNumber')?.value}`,
      };
    }

    let body: any = {
      ...(this.paymentDetails && { id: this.paymentDetails.id }),
      ...(this.paymentType === 'expense' && { ...expenseBody }),
      ...(this.paymentType === 'expense_agency' && { ...expenseAgencyBody }),
    };

    if (this.paymentDetails) {
      this.paymentService
        .updatePayment(this.paymentDetails.id, body)
        .subscribe({
          next: (value) => {
            console.log(value.body);
            const result = value.body;
            this.paymentId = result.id;
            // Same id after an update: the input setter won't fire, so reload explicitly
            this.receiptExpenseComponent?.getPaymentDetails(this.paymentId);

            this.toastAlertService.showSuccessNotification(
              'Opération modifiée avec succès',
              'Opération modifiée avec succès',
            );
            this.isLoading = false;
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
            'Opération ajoutée avec succès',
            'Opération ajoutée avec succès',
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
