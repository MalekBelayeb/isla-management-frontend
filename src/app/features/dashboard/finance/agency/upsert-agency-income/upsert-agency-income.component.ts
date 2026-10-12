import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  bankFieldRequiredIfMethodIsCheckValidator,
  checkNumberFieldRequiredIfMethodIsCheckValidator,
  transferNumberFieldRequiredIfMethodIsTransferValidator,
} from '@core/form-validators/form-validators';
import { PaymentDetails } from '@dashboard/payment/entity/payment-details';
import { PaymentService } from '@dashboard/payment/service/payment.service';
import { DataTypes } from '@models/data';
import { SearchResult } from '@shared/search-input/search-input.component';
import { ToastAlertService } from '@shared/toast-alert/toast-alert.service';

@Component({
  selector: 'app-upsert-agency-income',
  templateUrl: './upsert-agency-income.component.html',
  styleUrl: './upsert-agency-income.component.css',
})
export class UpsertAgencyIncomeComponent implements OnInit, OnChanges {
  agencyIncomeFormGroup: FormGroup;

  @Input() paymentDetails?: PaymentDetails;
  paymentId?: string;

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

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private toastAlertService: ToastAlertService,
  ) {
    this.agencyIncomeFormGroup = this.formBuilder.group({});
    this.setFormToDefaultState();
  }

  paymentMethodTypeList: SearchResult[] = DataTypes.paymentMethodTypeList;
  paymentTypeList: SearchResult[] = DataTypes.paymentTypeList;

  incomePaymentCategoryList: SearchResult[] =
    DataTypes.agencyIncomePaymentCategoryList;

  searchIncomePaymentCategoryValue: string =
    this.incomePaymentCategoryList.find((item) => item.id === 'others')
      ?.title ?? '';

  agreementOptions: SearchResult[] = [];

  searchAgreementValue: string = '';

  searchTypeValue: string = this.paymentTypeList[0].title;

  searchIncomePaymentMethodValue: string = this.paymentMethodTypeList[0].title;

  setFormToDefaultState() {
    this.agencyIncomeFormGroup = this.formBuilder.group(
      {
        amount: new FormControl('', Validators.required),
        label: new FormControl(''),
        paymentDate: new FormControl(''),
        category: new FormControl('others', Validators.required),
        method: new FormControl(
          this.paymentMethodTypeList[0].id,
          Validators.required,
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
  }

  selectedPaymentMethod(resultItem: SearchResult) {
    this.agencyIncomeFormGroup.get('method')?.setValue(resultItem.id);
    this.submitted = false;
  }
  selectedPaymentCategory(resultItem: SearchResult) {
    this.agencyIncomeFormGroup.get('category')?.setValue(resultItem.id);
  }

  setDefaultPaymentDate() {
    const now = new Date();
    const todayDate = now.toLocaleDateString('en-CA', {
      timeZone: 'Africa/Tunis',
    });
    this.agencyIncomeFormGroup
      .get('paymentDate')
      ?.setValue(todayDate.split('T')[0]);
  }

  setDefaultStartDateAndEndDate() {
    this.setDefaultPaymentDate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // No firstChange guard: the parent renders this form only once paymentDetails
    // is loaded, so the value already arrives on the first change
    if (changes['paymentDetails']) {
      this.paymentDetails = changes['paymentDetails'].currentValue;
      this.paymentId = this.paymentDetails?.id;

      if (this.paymentDetails) {
        // paymentDetails holds display titles: map them back to ids
        const categoryId =
          this.incomePaymentCategoryList.find((item) => {
            return item.title === this.paymentDetails?.category;
          })?.id ?? '';
        const paymentMethodId =
          this.paymentMethodTypeList.find((item) => {
            return item.title === this.paymentDetails?.method;
          })?.id ?? '';

        this.agencyIncomeFormGroup
          .get('amount')
          ?.setValue(this.paymentDetails.amount);
        this.agencyIncomeFormGroup.get('category')?.setValue(categoryId);
        this.agencyIncomeFormGroup
          .get('label')
          ?.setValue(this.paymentDetails.label);
        this.agencyIncomeFormGroup.get('method')?.setValue(paymentMethodId);
        this.agencyIncomeFormGroup
          .get('bank')
          ?.setValue(this.paymentDetails.bank ?? '');
        this.agencyIncomeFormGroup
          .get('checkNumber')
          ?.setValue(this.paymentDetails.checkNumber ?? '');
        this.agencyIncomeFormGroup
          .get('transferNumber')
          ?.setValue(this.paymentDetails.transferNumber ?? '');
        this.agencyIncomeFormGroup
          .get('paymentDate')
          ?.setValue(this.paymentDetails.paymentDate.toString().split('T')[0]);
        this.agencyIncomeFormGroup
          .get('notes')
          ?.setValue(this.paymentDetails.notes);

        this.searchIncomePaymentCategoryValue = this.paymentDetails.category;
        this.searchIncomePaymentMethodValue = this.paymentDetails.method ?? '';
      }
    }
  }

  ngOnInit(): void {
    // Edit mode: keep the values filled by ngOnChanges
    if (this.paymentDetails) return;

    this.setDefaultStartDateAndEndDate();
  }

  onPaymentDateChange($event: Date) {
    this.agencyIncomeFormGroup
      .get('paymentDate')
      ?.setValue($event.toISOString().split('T')[0]);
  }

  upsertPayment() {
    this.submitted = true;

    if (this.agencyIncomeFormGroup.invalid) return;
    this.isLoading = true;

    const getPaymentDate = () => {
      const d = new Date(this.agencyIncomeFormGroup.get('paymentDate')?.value);
      const n = new Date();
      d.setHours(
        n.getHours(),
        n.getMinutes(),
        n.getSeconds(),
        n.getMilliseconds(),
      );
      return d;
    }; // add current time to date (for exact sorting)

    const incomeAgencyBody = {
      type: 'income_agency',
      amount: this.agencyIncomeFormGroup.get('amount')?.value,
      category: this.agencyIncomeFormGroup.get('category')?.value,
      label: this.agencyIncomeFormGroup.get('label')?.value,
      method: this.agencyIncomeFormGroup.get('method')?.value,
      paymentDate: getPaymentDate(),
      ...(this.agencyIncomeFormGroup.get('notes')?.value && {
        notes: this.agencyIncomeFormGroup.get('notes')?.value,
      }),
      rentStartDate: null,
      rentEndDate: null,
      bank: this.agencyIncomeFormGroup.get('bank')?.value,
      checkNumber: `${this.agencyIncomeFormGroup.get('checkNumber')?.value}`,
      transferNumber: `${this.agencyIncomeFormGroup.get('transferNumber')?.value}`,
    };

    const body: any = {
      ...(this.paymentDetails && { id: this.paymentDetails.id }),
      ...incomeAgencyBody,
    };

    if (this.paymentDetails) {
      this.paymentService
        .updatePayment(this.paymentDetails.id, body)
        .subscribe({
          next: (value) => {
            this.paymentId = value.body.id;

            this.toastAlertService.showSuccessNotification(
              'Opération modifiée avec succès',
              'Opération modifiée avec succès',
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
          this.paymentId = value.body.id;

          this.toastAlertService.showSuccessNotification(
            'Opération ajoutée avec succès',
            'Opération ajoutée avec succès',
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
