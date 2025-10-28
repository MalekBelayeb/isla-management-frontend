import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Owner } from '@dashboard/owner/entity/owner';
import { OwnerDetails } from '@dashboard/owner/entity/owner-details';
import { GetOwnerDetailsMapper } from '@dashboard/owner/mappers/get-owner-details';
import { OwnerService } from '@dashboard/owner/service/owner.service';
import { FinancialBalance } from '@dashboard/payment/entity/financial-balance';
import { PaymentMapper } from '@dashboard/payment/mappers/payment-mapper';
import { PaymentService } from '@dashboard/payment/service/payment.service';
import { PropertyMapper } from '@dashboard/property/mappers/property-mapper';
import { PropertyService } from '@dashboard/property/service/property.service';
import { ConfirmDialogService } from '@shared/confirm-dialog/confirm-dialog.service';
import { SearchResult } from '@shared/search-input/search-input.component';
import { ToastAlertService } from '@shared/toast-alert/toast-alert.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { defaultSearchLimit } from 'src/app/variables/consts';

@Component({
  selector: 'app-owner-details',
  templateUrl: './owner-details.component.html',
  styleUrl: './owner-details.component.css',
})
export class OwnerDetailsComponent implements OnInit {
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  minDate = new Date();
  bsConfig = {
    isAnimated: true,
    containerClass: 'theme-red',
  };

  ownerDetails?: OwnerDetails;
  financialBalance?: FinancialBalance;
  formGroup: FormGroup;
  submitted = false;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,

    private route: ActivatedRoute,
    private ownerService: OwnerService,
    private paymentService: PaymentService,
    private propertyService: PropertyService,
    private confirmDialogService: ConfirmDialogService,
    private modalService: BsModalService,
    private toastAlertService: ToastAlertService,
  ) {
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];

    this.formGroup = this.formBuilder.group({
      propertyId: new FormControl('', Validators.required),
    });
  }
  ngOnInit(): void {
    this.getOwnerDetails();
    this.getFinancialBalance();
  }
  propertiesInitialList: SearchResult[] = [
    { id: '', title: 'B9 - 12 Rue Nozha, Ariana, Tunis' },
    { id: '', title: 'B6 - 36 Rue Yasmine, Ariana, Tunis' },
  ];
  getOwnerId(): string {
    return this.route.snapshot.paramMap.get('id') ?? '';
  }

  getFinancialBalance() {
    const params = {
      ownerId: this.getOwnerId(),
    };

    const queryString = new URLSearchParams(params).toString();
    this.paymentService.getFinancialBalance(`?${queryString}`).subscribe({
      next: (value) => {
        this.financialBalance = PaymentMapper.mapFinancialBalance(value.body);
      },
    });
  }

  propertyOptions: SearchResult[] = [];

  onSearchApartmentValueChanged(searchValue?: string) {
    const params = {
      ...(searchValue && { searchValue }),
      limit: `${defaultSearchLimit}`,
    };

    const queryString = new URLSearchParams(params).toString();

    this.propertyService.getAllProperties(`?${queryString}`).subscribe({
      next: (value) => {
        const properties = PropertyMapper.mapProperties(value.body);
        this.propertyOptions = properties.map((item) => ({
          id: item.id,
          title: `${item.matricule} - ${item.address}`,
        }));
      },
    });
  }
  onSelectedPropertySearchItem(searchResult: SearchResult) {
    this.formGroup.get('propertyId')?.setValue(searchResult.id);
  }
  searchPropertyValue: string = '';

  get editPropertyForm() {
    return this.formGroup.controls;
  }
  setPropertyToOwner() {
    this.submitted = true;
    console.log(this.formGroup.controls);
    if (this.formGroup.invalid) return;
    this.isLoading = true;

    let body: any = {
      ownerId: this.getOwnerId(),
    };
    this.propertyService
      .updateProperty(this.formGroup.get('propertyId')?.value, body)
      .subscribe({
        next: (value) => {
          this.toastAlertService.showSuccessNotification(
            'Propriétaire modifié avec succés',
            'Propriétaire a été modifier avec succés',
          );
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
        },
      });
  }

  getOwnerDetails() {
    console.log(this.getOwnerId());

    this.ownerService.getOwner(this.getOwnerId()).subscribe({
      next: (value) => {
        const result = value.body;
        this.ownerDetails = GetOwnerDetailsMapper.fromResponse(result);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
