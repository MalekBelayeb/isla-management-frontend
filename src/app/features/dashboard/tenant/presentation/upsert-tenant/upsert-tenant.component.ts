import { Component, Input, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  cinValidator,
  emailValidator,
  phoneNumberTnValidator,
} from '@core/form-validators/form-validators';
import {
  TenantDetails,
  TenantType,
} from '@dashboard/tenant/entity/tenant-details';
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
        tenantType: new FormControl<TenantType>('natural', Validators.required),
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
        // Société — only validated when tenantType is legal
        companyName: new FormControl(''),
        managerFirstname: new FormControl(''),
        managerLastname: new FormControl(''),
        managerPhoneNumber: new FormControl(''),
        managerCin: new FormControl(''),
      },
      { validators: [phoneNumberTnValidator, emailValidator] },
    );

    this.formGroup
      .get('tenantType')
      ?.valueChanges.subscribe((type: TenantType) =>
        this.updateTenantTypeValidators(type),
      );
  }
  nationalityTypeList: SearchResult[] = DataTypes.nationalityTypeList;
  onChangeGender(gender: string) {
    this.formGroup.get('gender')?.setValue(gender);
  }

  get isCompany(): boolean {
    return this.formGroup.get('tenantType')?.value === 'legal';
  }

  onChangeTenantType(type: TenantType) {
    this.formGroup.get('tenantType')?.setValue(type);
  }

  // Validates only the fields of the selected tenant type. Values of the other
  // type are kept so switching back and forth loses nothing; upsertTenant()
  // only sends the fields of the selected type.
  private updateTenantTypeValidators(type: TenantType) {
    const eightDigits = Validators.pattern(/^\d{8}$/);
    const personControls: Record<string, ValidatorFn[]> = {
      firstname: [Validators.required],
      lastname: [Validators.required],
      cin: [Validators.required],
      gender: [Validators.required],
    };
    const companyControls: Record<string, ValidatorFn[]> = {
      companyName: [Validators.required],
      managerFirstname: [Validators.required],
      managerLastname: [Validators.required],
      managerPhoneNumber: [Validators.required, eightDigits],
      managerCin: [Validators.required, eightDigits],
    };

    this.toggleControls(personControls, type === 'natural');
    this.toggleControls(companyControls, type === 'legal');
    this.formGroup.updateValueAndValidity({ emitEvent: false });
  }

  private toggleControls(
    validatorsByControl: Record<string, ValidatorFn[]>,
    enabled: boolean,
  ) {
    Object.entries(validatorsByControl).forEach(([name, validators]) => {
      const control = this.formGroup.get(name);
      if (!control) return;
      if (enabled) {
        control.setValidators(validators);
      } else {
        control.clearValidators();
      }
      control.updateValueAndValidity({ emitEvent: false });
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tenantDetails'] && !changes['tenantDetails'].firstChange) {
      this.tenantDetails = changes['tenantDetails'].currentValue;
      if (this.tenantDetails) {
        this.formGroup
          .get('tenantType')
          ?.setValue(this.tenantDetails?.tenantType ?? 'natural');
        this.updateTenantTypeValidators(
          this.tenantDetails.tenantType ?? 'natural',
        );
        this.formGroup
          .get('firstname')
          ?.setValue(this.tenantDetails?.firstname);
        this.formGroup
          .get('companyName')
          ?.setValue(this.tenantDetails?.companyName);

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

        this.formGroup
          .get('managerFirstname')
          ?.setValue(this.tenantDetails?.managerFirstname);
        this.formGroup
          .get('managerLastname')
          ?.setValue(this.tenantDetails?.managerLastname);
        this.formGroup
          .get('managerPhoneNumber')
          ?.setValue(this.tenantDetails?.managerPhoneNumber);
        this.formGroup
          .get('managerCin')
          ?.setValue(this.tenantDetails?.managerCin);
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
    console.log(this.formGroup.errors);
    if (this.formGroup.invalid) return;
    this.isLoading = true;

    let body: any = {
      ...(this.tenantDetails && { id: this.tenantDetails.id }),
      phoneNumber: `${this.formGroup.get('phoneNumber')?.value}`,
      address: this.formGroup.get('address')?.value,
      job: this.formGroup.get('job')?.value,
      nationality: this.formGroup.get('nationality')?.value,
      email: this.formGroup.get('email')?.value,
      tenantType: this.formGroup.get('tenantType')?.value,
      ...(!this.isCompany && {
        firstname: this.formGroup.get('firstname')?.value,
        lastname: this.formGroup.get('lastname')?.value,
        cin: `${this.formGroup.get('cin')?.value}`,
        gender: this.formGroup.get('gender')?.value,
      }),
      ...(this.isCompany && {
        societyName: this.formGroup.get('companyName')?.value,
        managerFirstname: this.formGroup.get('managerFirstname')?.value,
        managerLastname: this.formGroup.get('managerLastname')?.value,
        managerPhoneNumber: `${this.formGroup.get('managerPhoneNumber')?.value}`,
        managerCin: `${this.formGroup.get('managerCin')?.value}`,
      }),
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
