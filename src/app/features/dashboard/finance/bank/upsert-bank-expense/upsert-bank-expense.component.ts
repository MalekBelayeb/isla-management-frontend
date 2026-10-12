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
  selector: 'app-upsert-bank-expense',
  templateUrl: './upsert-bank-expense.component.html',
  styleUrl: './upsert-bank-expense.component.css',
})
export class UpsertBankExpenseComponent implements OnInit, OnChanges {
  bankExpenseFormGroup: FormGroup;

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
    this.bankExpenseFormGroup = this.formBuilder.group({});
    this.setFormToDefaultState();
  }

  paymentMethodTypeList: SearchResult[] = [
    { id: 'deposit', title: 'Versement Bancaire' },
    { id: 'transfer', title: 'Virement Bancaire' },
    { id: 'check', title: 'Par Chéque' },
  ];

  paymentTypeList: SearchResult[] = DataTypes.paymentTypeList;

  expensePaymentCategoryList: SearchResult[] =
    DataTypes.expensePaymentCategoryList;

  searchExpensePaymentCategoryValue: string =
    this.expensePaymentCategoryList.find((item) => item.id === 'others')
      ?.title ?? '';

  agreementOptions: SearchResult[] = [];

  searchAgreementValue: string = '';

  searchTypeValue: string = this.paymentTypeList[0].title;

  searchExpensePaymentMethodValue: string = this.paymentMethodTypeList[0].title;

  setFormToDefaultState() {
    this.bankExpenseFormGroup = this.formBuilder.group(
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
    this.bankExpenseFormGroup.get('method')?.setValue(resultItem.id);
    this.submitted = false;
  }
  selectedPaymentCategory(resultItem: SearchResult) {
    this.bankExpenseFormGroup.get('category')?.setValue(resultItem.id);
  }

  setDefaultPaymentDate() {
    const now = new Date();
    const todayDate = now.toLocaleDateString('en-CA', {
      timeZone: 'Africa/Tunis',
    });
    this.bankExpenseFormGroup
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
          this.expensePaymentCategoryList.find((item) => {
            return item.title === this.paymentDetails?.category;
          })?.id ?? '';
        const paymentMethodId =
          this.paymentMethodTypeList.find((item) => {
            return item.title === this.paymentDetails?.method;
          })?.id ?? '';

        this.bankExpenseFormGroup
          .get('amount')
          ?.setValue(this.paymentDetails.amount);
        this.bankExpenseFormGroup.get('category')?.setValue(categoryId);
        this.bankExpenseFormGroup
          .get('label')
          ?.setValue(this.paymentDetails.label);
        this.bankExpenseFormGroup.get('method')?.setValue(paymentMethodId);
        this.bankExpenseFormGroup
          .get('bank')
          ?.setValue(this.paymentDetails.bank ?? '');
        this.bankExpenseFormGroup
          .get('checkNumber')
          ?.setValue(this.paymentDetails.checkNumber ?? '');
        this.bankExpenseFormGroup
          .get('transferNumber')
          ?.setValue(this.paymentDetails.transferNumber ?? '');
        this.bankExpenseFormGroup
          .get('paymentDate')
          ?.setValue(this.paymentDetails.paymentDate.toString().split('T')[0]);
        this.bankExpenseFormGroup
          .get('notes')
          ?.setValue(this.paymentDetails.notes);

        this.searchExpensePaymentCategoryValue = this.paymentDetails.category;
        this.searchExpensePaymentMethodValue = this.paymentDetails.method ?? '';
      }
    }
  }

  ngOnInit(): void {
    // Edit mode: keep the values filled by ngOnChanges
    if (this.paymentDetails) return;

    this.setDefaultStartDateAndEndDate();
  }

  onPaymentDateChange($event: Date) {
    this.bankExpenseFormGroup
      .get('paymentDate')
      ?.setValue($event.toISOString().split('T')[0]);
  }

  upsertPayment() {
    this.submitted = true;

    if (this.bankExpenseFormGroup.invalid) return;
    this.isLoading = true;

    const getPaymentDate = () => {
      const d = new Date(this.bankExpenseFormGroup.get('paymentDate')?.value);
      const n = new Date();
      d.setHours(
        n.getHours(),
        n.getMinutes(),
        n.getSeconds(),
        n.getMilliseconds(),
      );
      return d;
    }; // add current time to date (for exact sorting)

    const expenseBankBody = {
      type: 'expense_bank',
      amount: this.bankExpenseFormGroup.get('amount')?.value,
      category: this.bankExpenseFormGroup.get('category')?.value,
      label: this.bankExpenseFormGroup.get('label')?.value,
      method: this.bankExpenseFormGroup.get('method')?.value,
      paymentDate: getPaymentDate(),
      ...(this.bankExpenseFormGroup.get('notes')?.value && {
        notes: this.bankExpenseFormGroup.get('notes')?.value,
      }),
      rentStartDate: null,
      rentEndDate: null,
      bank: this.bankExpenseFormGroup.get('bank')?.value,
      checkNumber: `${this.bankExpenseFormGroup.get('checkNumber')?.value}`,
      transferNumber: `${this.bankExpenseFormGroup.get('transferNumber')?.value}`,
    };

    const body: any = {
      ...(this.paymentDetails && { id: this.paymentDetails.id }),
      ...expenseBankBody,
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
