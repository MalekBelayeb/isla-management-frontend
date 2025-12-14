import { Component, Input, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  cinValidator,
  emailValidator,
  phoneNumberTnValidator,
} from '@core/form-validators/form-validators';
import { TenantDetails } from '@dashboard/tenant/entity/tenant-details';
import { TenantService } from '@dashboard/tenant/service/tenant.service';
import { DataTypes } from '@models/data';
import { SearchResult } from '@shared/search-input/search-input.component';
import { ToastAlertService } from '@shared/toast-alert/toast-alert.service';

@Component({
  selector: 'app-upsert-tenant',
  templateUrl: './upsert-tenant.component.html',
  styleUrl: './upsert-tenant.component.css',
})
export class UpsertTenantComponent {
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

  @Input() tenantDetails?: TenantDetails;

  constructor(
    private formBuilder: FormBuilder,
    private tenantService: TenantService,
    private toastAlertService: ToastAlertService,
  ) {
    this.formGroup = this.formBuilder.group(
      {
        firstname: new FormControl('', Validators.required),
        lastname: new FormControl('', Validators.required),
        cin: new FormControl('', Validators.required),
        phoneNumber: new FormControl('', Validators.required),
        gender: new FormControl('', Validators.required),
        address: new FormControl(''),
        job: new FormControl(''),
        email: new FormControl(''),
        nationality: new FormControl(
          DataTypes.nationalityTypeList[0].id,
          Validators.required,
        ),
      },
      { validators: [phoneNumberTnValidator, cinValidator, emailValidator] },
    );
  }
  nationalityTypeList: SearchResult[] = DataTypes.nationalityTypeList;
  onChangeGender(gender: string) {
    this.formGroup.get('gender')?.setValue(gender);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tenantDetails'] && !changes['tenantDetails'].firstChange) {
      this.tenantDetails = changes['tenantDetails'].currentValue;
      if (this.tenantDetails) {
        this.formGroup
          .get('firstname')
          ?.setValue(this.tenantDetails?.firstname);
        this.formGroup.get('lastname')?.setValue(this.tenantDetails?.lastname);
        this.formGroup.get('cin')?.setValue(this.tenantDetails?.cin);
        this.formGroup
          .get('phoneNumber')
          ?.setValue(this.tenantDetails?.phoneNumber);
        this.formGroup.get('address')?.setValue(this.tenantDetails?.address);
        this.formGroup.get('job')?.setValue(this.tenantDetails?.job);
        this.formGroup.get('email')?.setValue(this.tenantDetails?.email);
        this.formGroup.get('gender')?.setValue(this.tenantDetails?.gender);
        this.formGroup
          .get('nationality')
          ?.setValue(this.tenantDetails?.nationality);
      }
    }
  }

  ngOnInit(): void {}

  get upsertTenantForm() {
    return this.formGroup.controls;
  }
  selectedNationaliaty(resultItem: SearchResult) {
    this.formGroup.get('nationality')?.setValue(resultItem.id);
  }
  upsertTenant() {
    this.submitted = true;
    console.log(this.formGroup.controls);
    if (this.formGroup.invalid) return;
    this.isLoading = true;

    let body: any = {
      ...(this.tenantDetails && { id: this.tenantDetails.id }),
      firstname: this.formGroup.get('firstname')?.value,
      lastname: this.formGroup.get('lastname')?.value,
      cin: `${this.formGroup.get('cin')?.value}`,
      phoneNumber: `${this.formGroup.get('phoneNumber')?.value}`,
      address: this.formGroup.get('address')?.value,
      job: this.formGroup.get('job')?.value,
      nationality: this.formGroup.get('nationality')?.value,
      email: this.formGroup.get('email')?.value,
      gender: this.formGroup.get('gender')?.value,
    };
    if (this.tenantDetails) {
      this.tenantService.updateTenant(this.tenantDetails.id, body).subscribe({
        next: (value) => {
          this.toastAlertService.showSuccessNotification(
            'Locataire modifié avec succés',
            'Locataire a été modifier avec succés',
          );
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
        },
      });
    } else {
      this.tenantService.createTenant(body).subscribe({
        next: (value) => {
          this.toastAlertService.showSuccessNotification(
            'Locataire ajoutée avec succés',
            'Locataire a été créer avec succés',
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
