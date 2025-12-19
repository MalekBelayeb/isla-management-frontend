import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '@dashboard/payment/service/payment.service';
import { DataTypes } from '@models/data';
import { SearchResult } from '@shared/search-input/search-input.component';
import { ToastAlertService } from '@shared/toast-alert/toast-alert.service';

@Component({
  selector: 'app-upsert-agency-expense',
  templateUrl: './upsert-agency-expense.component.html',
  styleUrl: './upsert-agency-expense.component.css',
})
export class UpsertAgencyExpenseComponent implements OnInit {
  agencyExpenseFormGroup: FormGroup;

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
    this.agencyExpenseFormGroup = this.formBuilder.group({});
    this.setFormToDefaultState();
  }

  paymentMethodTypeList: SearchResult[] = DataTypes.paymentMethodTypeList;
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
    this.agencyExpenseFormGroup = this.formBuilder.group({
      amount: new FormControl('', Validators.required),
      label: new FormControl(''),
      paymentDate: new FormControl(''),
      category: new FormControl('others', Validators.required),
      method: new FormControl(
        this.paymentMethodTypeList[0].id,
        Validators.required,
      ),
      notes: new FormControl(''),
    });
  }

  selectedPaymentMethod(resultItem: SearchResult) {
    this.agencyExpenseFormGroup.get('method')?.setValue(resultItem.id);
  }
  selectedPaymentCategory(resultItem: SearchResult) {
    this.agencyExpenseFormGroup.get('category')?.setValue(resultItem.id);
  }

  setDefaultPaymentDate() {
    const now = new Date();
    const todayDate = now.toLocaleDateString('en-CA', {
      timeZone: 'Africa/Tunis',
    });
    this.agencyExpenseFormGroup
      .get('paymentDate')
      ?.setValue(todayDate.split('T')[0]);
  }

  setDefaultStartDateAndEndDate() {
    this.setDefaultPaymentDate();
  }

  ngOnInit(): void {
    this.setDefaultStartDateAndEndDate();
  }

  onPaymentDateChange($event: Date) {
    console.log($event);
    this.agencyExpenseFormGroup
      .get('paymentDate')
      ?.setValue($event.toISOString().split('T')[0]);
  }

  upsertPayment() {
    this.submitted = true;

    if (this.agencyExpenseFormGroup.invalid) return;
    this.isLoading = true;

    const getPaymentDate = () => {
      const d = new Date(this.agencyExpenseFormGroup.get('paymentDate')?.value);
      const n = new Date();
      d.setHours(
        n.getHours(),
        n.getMinutes(),
        n.getSeconds(),
        n.getMilliseconds(),
      );
      return d;
    }; // add current time to date (for exact sorting)

    const expenseAgencyBody = {
      type: 'expense_agency',
      amount: this.agencyExpenseFormGroup.get('amount')?.value,
      category: this.agencyExpenseFormGroup.get('category')?.value,
      label: this.agencyExpenseFormGroup.get('label')?.value,
      method: this.agencyExpenseFormGroup.get('method')?.value,
      paymentDate: getPaymentDate(),
      ...(this.agencyExpenseFormGroup.get('notes')?.value && {
        notes: this.agencyExpenseFormGroup.get('notes')?.value,
      }),
      rentStartDate: null,
      rentEndDate: null,
    };

    this.paymentService.createPayment(expenseAgencyBody).subscribe({
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
