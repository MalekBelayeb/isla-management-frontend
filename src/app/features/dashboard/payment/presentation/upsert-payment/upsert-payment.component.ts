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
import { AgreeementMapper } from '@dashboard/agreement/mappers/agreement.mapper';
import { AgreementService } from '@dashboard/agreement/service/agreement.service';
import { PaymentDetails } from '@dashboard/payment/entity/payment-details';
import { PaymentService } from '@dashboard/payment/service/payment.service';
import { DataTypes } from '@models/data';
import { SearchResult } from '@shared/search-input/search-input.component';
import { ToastAlertService } from '@shared/toast-alert/toast-alert.service';
import { defaultSearchLimit } from 'src/app/variables/consts';

@Component({
  selector: 'app-upsert-payment',
  templateUrl: './upsert-payment.component.html',
  styleUrl: './upsert-payment.component.css',
})
export class UpsertPaymentComponent implements OnInit {
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

  @Input() paymentDetails?: PaymentDetails;

  constructor(
    private formBuilder: FormBuilder,
    private agreementService: AgreementService,
    private paymentService: PaymentService,
    private toastAlertService: ToastAlertService,
  ) {
    this.formGroup = this.formBuilder.group({
      amount: new FormControl('', Validators.required),
      type: new FormControl(this.paymentTypeList[0].id, Validators.required),
      category: new FormControl(
        this.paymentCategoryList[0].id,
        Validators.required,
      ),
      method: new FormControl(
        this.paymentMethodTypeList[0].id,
        Validators.required,
      ),
      agreementId: new FormControl('', Validators.required),
      notes: new FormControl(''),
    });
  }
  paymentMethodTypeList: SearchResult[] = DataTypes.paymentMethodTypeList;

  paymentTypeList: SearchResult[] = DataTypes.paymentTypeList;
  paymentCategoryList: SearchResult[] = DataTypes.paymentCategoryList;

  agreementOptions: SearchResult[] = [];
  searchAgreementValue: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['paymentDetails'] && !changes['paymentDetails'].firstChange) {
      this.paymentDetails = changes['paymentDetails'].currentValue;
      if (this.paymentDetails) {
        this.formGroup.get('amount')?.setValue(this.paymentDetails?.amount);
        this.formGroup.get('method')?.setValue(this.paymentDetails?.method);
        this.formGroup.get('type')?.setValue(this.paymentDetails?.type);
        this.formGroup.get('category')?.setValue(this.paymentDetails?.category);
        this.formGroup
          .get('agreementId')
          ?.setValue(this.paymentDetails?.agreementId);

        this.formGroup.get('notes')?.setValue(this.paymentDetails?.notes);

        this.searchAgreementValue = this.paymentDetails.agreement;
      }
    }
  }
  selectedPaymentType(resultItem: SearchResult) {
    this.formGroup.get('type')?.setValue(resultItem.id);
  }

  selectedPaymentCategory(resultItem: SearchResult) {
    this.formGroup.get('category')?.setValue(resultItem.id);
  }

  selectedPaymentMethod(resultItem: SearchResult) {
    this.formGroup.get('method')?.setValue(resultItem.id);
  }
  ngOnInit(): void {}

  get upsertPaymentForm() {
    return this.formGroup.controls;
  }

  onSearchAgreementValueChanged(searchValue?: string) {
    const params = {
      ...(searchValue && { searchTerm: searchValue }),
      limit: `${defaultSearchLimit}`,
    };

    const queryString = new URLSearchParams(params).toString();

    this.agreementService.getAllAgreement(`?${queryString}`).subscribe({
      next: (value) => {
        const agreements = AgreeementMapper.mapAgreements(value.body);
        this.agreementOptions = agreements.map((item) => ({
          id: item.id,
          title: `${item.matricule}`,
        }));
      },
    });
  }
  onSelectedAgreementSearchItem(searchResult: SearchResult) {
    this.formGroup.get('agreementId')?.setValue(searchResult.id);
  }

  upsertPayment() {
    this.submitted = true;
    console.log(this.formGroup.controls);
    if (this.formGroup.invalid) return;
    this.isLoading = true;
    let body: any = {
      ...(this.paymentDetails && { id: this.paymentDetails.id }),
      amount: this.formGroup.get('amount')?.value,
      type: this.formGroup.get('type')?.value,
      category: this.formGroup.get('category')?.value,
      method: this.formGroup.get('method')?.value,
      agreementId: this.formGroup.get('agreementId')?.value,
      ...(this.formGroup.get('notes')?.value && {
        notes: this.formGroup.get('notes')?.value,
      }),
    };
    if (this.paymentDetails) {
      this.paymentService
        .updatePayment(this.paymentDetails.id, body)
        .subscribe({
          next: (value) => {
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
