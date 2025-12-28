import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
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
import { AgreeementMapper } from '@dashboard/agreement/mappers/agreement.mapper';
import { AgreementService } from '@dashboard/agreement/service/agreement.service';
import { PaymentDetails } from '@dashboard/payment/entity/payment-details';
import { PaymentService } from '@dashboard/payment/service/payment.service';
import { TenantMapper } from '@dashboard/tenant/mappers/tenant-mapper';
import { TenantService } from '@dashboard/tenant/service/tenant.service';
import { DataTypes } from '@models/data';
import { SearchResult } from '@shared/search-input/search-input.component';
import { ToastAlertService } from '@shared/toast-alert/toast-alert.service';
import { defaultSearchLimit, propertyPrefix } from 'src/app/variables/consts';

@Component({
  selector: 'app-upsert-payment',
  templateUrl: './upsert-payment.component.html',
  styleUrl: './upsert-payment.component.css',
})
export class UpsertPaymentComponent implements OnInit {
  incomeFormGroup: FormGroup;
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

  withTax: boolean = false;

  @Input() paymentDetails?: PaymentDetails;

  agreement?: Agreement;

  paymentType: 'income' | 'expense' | 'expense_agency' = 'income';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private agreementService: AgreementService,
    private paymentService: PaymentService,
    private tenantService: TenantService,
    private toastAlertService: ToastAlertService,
    private tenantMapper: TenantMapper,
  ) {
    this.incomeFormGroup = this.formBuilder.group({});
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

  agreementOptions: SearchResult[] = [];

  searchAgreementValue: string = '';

  searchTypeValue: string = this.paymentTypeList[0].title;

  searchIncomePaymentMethodValue: string = this.paymentMethodTypeList[0].title;
  searchExpensePaymentMethodValue: string = this.paymentMethodTypeList[0].title;

  setFormToDefaultState() {
    this.incomeFormGroup = this.formBuilder.group(
      {
        amount: new FormControl('', Validators.required),
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
        tva: new FormControl(19),
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
        matriculeProperty: new FormControl(
          '',
          this.paymentType === 'expense' ? Validators.required : null,
        ),
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
    if (changes['paymentDetails'] && !changes['paymentDetails'].firstChange) {
      this.paymentDetails = changes['paymentDetails'].currentValue;

      if (this.paymentDetails) {
        this.paymentType = this.paymentDetails.type as typeof this.paymentType;
        const categoryId =
          DataTypes.incomePaymentCategoryList.find((item) => {
            return item.title === this.paymentDetails?.category;
          })?.id ?? '';
        const paymentMethodId =
          DataTypes.paymentMethodTypeList.find((item) => {
            return item.title === this.paymentDetails?.method;
          })?.id ?? '';
        if (this.paymentType === 'income') {
          this.incomeFormGroup
            .get('amount')
            ?.setValue(this.paymentDetails?.amount);
          this.incomeFormGroup.get('method')?.setValue(paymentMethodId);
          this.incomeFormGroup
            .get('label')
            ?.setValue(this.paymentDetails?.label);
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
            ?.setValue(
              this.paymentDetails?.paymentDate.toString().split('T')[0],
            );
          this.incomeFormGroup
            .get('notes')
            ?.setValue(this.paymentDetails?.notes);

          this.searchIncomePaymentCategoryValue = this.paymentDetails?.category;

          this.searchIncomePaymentMethodValue =
            this.paymentDetails?.method ?? '';

          this.withTax = !!this.paymentDetails.tva;
          this.searchAgreementValue = this.paymentDetails.agreement ?? '';
        }

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
              .get('matriculeProperty')
              ?.setValue(this.paymentDetails?.matriculeProperty);
          }
          this.expenseFormGroup
            .get('paymentDate')
            ?.setValue(
              this.paymentDetails?.paymentDate.toString().split('T')[0],
            );
          this.expenseFormGroup
            .get('notes')
            ?.setValue(this.paymentDetails?.notes);

          this.searchExpensePaymentCategoryValue = this.paymentDetails.category;
          this.searchExpensePaymentMethodValue = this.paymentDetails.method;
        }
      }
    }
  }

  selectedPaymentCategory(resultItem: SearchResult) {
    this.activeForm.get('category')?.setValue(resultItem.id);
    if (resultItem.id !== 'rent') {
      this.activeForm.get('rentStartDate')?.setValue(undefined);
      this.activeForm.get('rentEndDate')?.setValue(undefined);
    } else {
      this.setDefaultRentStartDateAndRentEndDate();
    }
  }

  selectedPaymentMethod(resultItem: SearchResult) {
    this.activeForm.get('method')?.setValue(resultItem.id);
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

  get activeForm(): FormGroup {
    return this.paymentType === 'income'
      ? this.incomeFormGroup
      : this.expenseFormGroup;
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
    this.expenseFormGroup.get('paymentDate')?.setValue(todayDate.split('T')[0]);
  }

  setDefaultStartDateAndEndDate() {
    this.setDefaultRentStartDateAndRentEndDate();
    this.setDefaultPaymentDate();
  }

  ngOnInit(): void {
    this.setDefaultStartDateAndEndDate();

    this.setAgreementByTenant();
  }

  setAgreementByTenant() {
    const idTenant = this.route.snapshot.paramMap.get('idTenant') ?? '';
    if (idTenant) {
      this.tenantService.getTenant(idTenant).subscribe({
        next: (value) => {
          this.agreement = this.tenantMapper.mapTenantDetails(
            value.body,
          ).agreement;
          this.searchAgreementValue = this.agreement?.matricule ?? '';
          this.incomeFormGroup
            .get('agreementId')
            ?.setValue(this.agreement?.id ?? '');
        },
      });
    }
  }

  get upsertPaymentForm() {
    return this.incomeFormGroup.controls;
  }
  onStartDateChange($event: Date) {
    this.incomeFormGroup
      .get('rentStartDate')
      ?.setValue($event.toISOString().split('T')[0]);
  }

  onPaymentDateChange($event: Date) {
    this.activeForm
      .get('paymentDate')
      ?.setValue($event.toISOString().split('T')[0]);
  }

  onEndDateChange($event: Date) {
    this.incomeFormGroup
      .get('rentEndDate')
      ?.setValue($event?.toISOString().split('T')[0]);
  }
  onSearchAgreementValueChanged(searchValue?: string) {
    const params = {
      ...(searchValue && { searchTerm: searchValue }),
      limit: `${defaultSearchLimit}`,
    };

    const queryString = new URLSearchParams(params).toString();

    this.agreementService.getAllAgreement(`?${queryString}`).subscribe({
      next: (value) => {
        const agreements = AgreeementMapper.mapAgreements(
          value.body.agreements,
        );
        this.agreementOptions = agreements.map((item) => ({
          id: item.id,
          title: `${item.matricule}`,
        }));
      },
    });
  }
  onSelectedAgreementSearchItem(searchResult: SearchResult) {
    this.incomeFormGroup.get('agreementId')?.setValue(searchResult.id);
  }

  getTVAValue() {
    if (this.withTax) {
      return this.incomeFormGroup.get('tva')?.value;
    }

    return null;
  }

  

  upsertPayment() {
    this.submitted = true;
    console.log(this.activeForm);
    if (this.activeForm.invalid) return;
    this.isLoading = true;
    let incomeBody = {};
    let expenseBody = {};
    let expenseAgencyBody = {};

    const getPaymentDate = () => {
      console.log(this.expenseFormGroup.get('paymentDate')?.value);
      const d = new Date(this.activeForm.get('paymentDate')?.value);
      const n = new Date();
      d.setHours(
        n.getHours(),
        n.getMinutes(),
        n.getSeconds(),
        n.getMilliseconds(),
      );
      return d;
    }; // add current time to date (for exact sorting)

    if (this.paymentType === 'income') {
      incomeBody = {
        type: 'income',
        amount: this.incomeFormGroup.get('amount')?.value,
        category: this.incomeFormGroup.get('category')?.value,
        label: this.incomeFormGroup.get('label')?.value,
        ...(this.paymentType === 'income' && {
          rentStartDate: this.incomeFormGroup.get('rentStartDate')?.value
            ? new Date(this.incomeFormGroup.get('rentStartDate')?.value)
            : null,
        }),
        ...(this.paymentType === 'income' && {
          rentEndDate: this.incomeFormGroup.get('rentEndDate')?.value
            ? new Date(this.incomeFormGroup.get('rentEndDate')?.value)
            : null,
        }),
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
    }

    if (this.paymentType === 'expense') {
      expenseBody = {
        type: 'expense',
        amount: this.expenseFormGroup.get('amount')?.value,
        category: this.expenseFormGroup.get('category')?.value,
        label: this.expenseFormGroup.get('label')?.value,
        method: this.expenseFormGroup.get('method')?.value,
        matriculeProperty:
          this.expenseFormGroup.get('matriculeProperty')?.value,
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
      ...(this.paymentType === 'income' && { ...incomeBody }),
      ...(this.paymentType === 'expense' && { ...expenseBody }),
      ...(this.paymentType === 'expense_agency' && { ...expenseAgencyBody }),
    };

    if (this.paymentDetails) {
      this.paymentService
        .updatePayment(this.paymentDetails.id, body)
        .subscribe({
          next: (value) => {
            console.log(value.body);
            this.toastAlertService.showSuccessNotification(
              'Paiement modifié avec succés',
              'Paiement a été modifier avec succés',
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
          this.toastAlertService.showSuccessNotification(
            'Paiement ajoutée avec succés',
            'Paiement a été créer avec succés',
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
