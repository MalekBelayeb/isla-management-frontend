import {
  Component,
  Input,
  OnChanges,
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
import {
  cinValidator,
  emailValidator,
  phoneNumberTnValidator,
} from '@core/form-validators/form-validators';
import { OwnerDetails } from '@dashboard/owner/entity/owner-details';
import { OwnerService } from '@dashboard/owner/service/owner.service';
import { DataTypes } from '@models/data';
import { SearchResult } from '@shared/search-input/search-input.component';
import { ToastAlertService } from '@shared/toast-alert/toast-alert.service';

@Component({
  selector: 'app-upsert-owner',
  templateUrl: './upsert-owner.component.html',
  styleUrl: './upsert-owner.component.css',
})
export class UpsertOwnerComponent implements OnInit, OnChanges {
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
  focus8 = false;
  focus9 = false;
  focus10 = false;
  canChangeType: boolean = true;
  default = {
    keyboard: true,
    class: 'modal-dialog-centered modal-secondary',
  };

  @Input() ownerDetails?: OwnerDetails;

  nationalityTypeList = DataTypes.nationalityTypeList;
  constructor(
    private formBuilder: FormBuilder,
    private ownerService: OwnerService,
    private toastAlertService: ToastAlertService,
  ) {
    this.formGroup = this.formBuilder.group({
      firstname: new FormControl(''),
      lastname: new FormControl(''),
      email: new FormControl(''),
      nationality: new FormControl(DataTypes.nationalityTypeList[0].id),
      cin: new FormControl(''),
      rib: new FormControl(''),
      phoneNumber: new FormControl('', Validators.required),
      gender: new FormControl('M'),
      type: new FormControl('natural'),
      society: new FormControl(''),
      taxId: new FormControl(''),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ownerDetails'] && !changes['ownerDetails'].firstChange) {
      this.ownerDetails = changes['ownerDetails'].currentValue;
      if (this.ownerDetails) {
        this.canChangeType = false;
        this.formGroup.get('firstname')?.setValue(this.ownerDetails?.firstname);
        this.formGroup.get('lastname')?.setValue(this.ownerDetails?.lastname);
        this.formGroup.get('email')?.setValue(this.ownerDetails?.email);
        this.formGroup.get('cin')?.setValue(this.ownerDetails?.cin);
        this.formGroup.get('rib')?.setValue(this.ownerDetails?.rib);
        this.formGroup
          .get('phoneNumber')
          ?.setValue(this.ownerDetails?.phoneNumber);
        this.formGroup.get('gender')?.setValue(this.ownerDetails?.gender);
        this.formGroup.get('type')?.setValue(this.ownerDetails?.type);
        this.formGroup.get('society')?.setValue(this.ownerDetails?.society);
        this.formGroup.get('taxId')?.setValue(this.ownerDetails?.taxId);
      } else {
        this.canChangeType = true;
      }
    }
  }

  ngOnInit(): void {}

  get f() {
    return this.formGroup.controls;
  }
  selectedNationaliaty(resultItem: SearchResult) {
    this.formGroup.get('nationality')?.setValue(resultItem.id);
  }
  resetForm() {
    this.formGroup.clearValidators();
    this.submitted = false;
    [
      'firstname',
      'lastname',
      'cin',
      'rib',
      'phoneNumber',
      'society',
      'taxId',
      'rib',
      'email',
    ].forEach((key) => {
      this.formGroup.get(key)?.setValue('');
    });
  }

  onChangeType(type: string) {
    this.resetForm();
    this.formGroup.get('type')?.setValue(type);
  }

  onChangeGender(gender: string) {
    console.log(gender);
    this.formGroup.get('gender')?.setValue(gender);
  }

  checkFormValidation() {
    var requiredControls: string[] = [];
    const type = this.formGroup.get('type')?.value;
    requiredControls =
      type == 'natural'
        ? ['firstname', 'lastname', 'cin', 'rib', 'phoneNumber']
        : ['society', 'taxId', 'rib', 'phoneNumber'];

    requiredControls.forEach((key) => {
      this.formGroup.get(key)?.addValidators(Validators.required);
    });

    if (type == 'natural') {
      this.formGroup.addValidators([cinValidator]);
    }
    this.formGroup.addValidators([emailValidator, phoneNumberTnValidator]);

    Object.keys(this.formGroup.controls).forEach((key) => {
      this.formGroup.get(key)?.updateValueAndValidity();
    });
  }

  addNewEmployee() {
    this.submitted = true;
    this.checkFormValidation();
    console.log(this.formGroup);
    if (this.formGroup.invalid) return;
    this.isLoading = true;

    let body: any = {
      ...(this.ownerDetails && { id: this.ownerDetails.id }),
      firstname: this.formGroup.get('firstname')?.value,
      lastname: this.formGroup.get('lastname')?.value,
      phoneNumber: `${this.formGroup.get('phoneNumber')?.value}`,
      ...(this.formGroup.get('email')?.value && {
        email: this.formGroup.get('email')?.value,
      }),
      cin: `${this.formGroup.get('cin')?.value}`,
      rib: `${this.formGroup.get('rib')?.value}`,
      society: this.formGroup.get('society')?.value,
      taxId: `${this.formGroup.get('taxId')?.value}`,
      type: this.formGroup.get('type')?.value,
      ...(this.formGroup.get('type')?.value == 'natural' && {
        gender: this.formGroup.get('gender')?.value,
      }),
      nationality: this.formGroup.get('nationality')?.value,
    };

    if (this.ownerDetails) {
      this.ownerService.updateOwner(this.ownerDetails.id, body).subscribe({
        next: (value) => {
          this.toastAlertService.showSuccessNotification(
            'Propriétaire modifié avec succés',
            'Propriétaire a été modifier avec succés',
          );
          this.isLoading = false;
          //this.resetForm();
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
    } else {
      this.ownerService.createOwner(body).subscribe({
        next: (value) => {
          this.toastAlertService.showSuccessNotification(
            'Propriétaire ajouté avec succés',
            'Propriétaire a été créer avec succés',
          );
          this.isLoading = false;
          this.resetForm();
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
    }
  }
}
