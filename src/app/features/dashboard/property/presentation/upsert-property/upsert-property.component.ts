import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GetAllOwnersMapper } from '@dashboard/owner/mappers/get-all-owners-mapper';
import { OwnerService } from '@dashboard/owner/service/owner.service';
import { SearchResult } from '@shared/search-input/search-input.component';
import { PropertyService } from '../../service/property.service';
import { DataTypes } from '@models/data';
import { ToastAlertService } from '@shared/toast-alert/toast-alert.service';
import { PropertyDetails } from '../../entity/property-details';
import { defaultSearchLimit } from 'src/app/variables/consts';
import { ActivatedRoute } from '@angular/router';
import { GetOwnerDetailsMapper } from '@dashboard/owner/mappers/get-owner-details';
import { OwnerDetails } from '@dashboard/owner/entity/owner-details';

@Component({
  selector: 'app-upsert-property',
  templateUrl: './upsert-property.component.html',
  styleUrl: './upsert-property.component.css',
})
export class UpsertPropertyComponent implements OnInit {
  formGroup: FormGroup;
  submitted = false;
  isLoading = false;
  focus1 = false;
  focus2 = false;
  ownerDetails?: OwnerDetails;

  @Input() propertyDetails?: PropertyDetails;

  constructor(
    private formBuilder: FormBuilder,
    private ownerService: OwnerService,
    private propertyService: PropertyService,
    private toastAlertService: ToastAlertService,
    private route: ActivatedRoute,
  ) {
    this.formGroup = this.formBuilder.group({
      ownerId: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      profitInPercentage: new FormControl(10, Validators.required),
    });
  }

  propertiesType: SearchResult[] = DataTypes.propertiesType;

  ownerOptions: SearchResult[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['propertyDetails'] && !changes['propertyDetails'].firstChange) {
      this.propertyDetails = changes['propertyDetails'].currentValue;
      if (this.propertyDetails) {
        this.formGroup.get('address')?.setValue(this.propertyDetails?.address);
        this.formGroup.get('type')?.setValue(this.propertyDetails?.type);
        this.formGroup.get('ownerId')?.setValue(this.propertyDetails?.ownerId);
        this.formGroup
          .get('profitInPercentage')
          ?.setValue(this.propertyDetails?.profitInPercentage);
        
        this.searchOwnerValue = this.propertyDetails.owner;
      }
    }
  }

  ngOnInit(): void {
    const ownerId = this.getOwnerId();
    if (ownerId) {
      // case coming from owner details
      this.getOwnerDetails();
    }
  }

  get createPropertyForm() {
    return this.formGroup.controls;
  }

  searchOwnerValue: string = '';
  onSearchOwnerValueChanged(searchValue?: string) {
    const params = {
      ...(searchValue && { searchTerm: searchValue }),
      limit: `${defaultSearchLimit}`,
    };
    const queryString = new URLSearchParams(params).toString();
    this.ownerService.getAllOwners(`?${queryString}`).subscribe({
      next: (value) => {
        const owners = GetAllOwnersMapper.fromResponse(value.body.owners);
        console.log(owners)
        this.ownerOptions = owners.map((item) => ({
          id: item.id,
          title: item.name,
        }));
      },
    });
  }
  onSelectedOwnerSearchItem(searchResult: SearchResult) {
    console.log(searchResult);

    this.formGroup.get('ownerId')?.setValue(searchResult.id);
  }

  onSelectedPropertyTypeSearchItem(searchResult: SearchResult) {
    console.log(searchResult);
    this.formGroup.get('type')?.setValue(searchResult.id);
  }

  getOwnerId(): string {
    return this.route.snapshot.paramMap.get('idOwner') ?? '';
  }

  getOwnerDetails() {
    console.log(this.getOwnerId());

    this.ownerService.getOwner(this.getOwnerId()).subscribe({
      next: (value) => {
        const result = value.body;
        this.ownerDetails = GetOwnerDetailsMapper.fromResponse(result);
        this.formGroup.get('ownerId')?.setValue(this.ownerDetails.id);
        this.searchOwnerValue = this.ownerDetails.fullname ?? '';
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  upsertProperty() {
    this.submitted = true;
    console.log(this.formGroup.controls);
    if (this.formGroup.invalid) return;
    this.isLoading = true;

    let body: any = {
      ...(this.propertyDetails && { id: this.propertyDetails.id }),
      ownerId: this.formGroup.get('ownerId')?.value,
      address: this.formGroup.get('address')?.value,
      type: this.formGroup.get('type')?.value,
      profitInPercentage: this.formGroup.get('profitInPercentage')?.value,
    };
    if (this.propertyDetails) {
      this.propertyService
        .updateProperty(this.propertyDetails.id, body)
        .subscribe({
          next: (value) => {
            console.log('qsdqsdqqs');
            this.toastAlertService.showSuccessNotification(
              'Propriété modifié avec succés',
              'Nouvelle Propriétée a été modifier avec succés',
            );
            this.isLoading = false;
          },
          error: (err) => {
            this.isLoading = false;
          },
        });
    } else {
      this.propertyService.createProperty(body).subscribe({
        next: (value) => {
          this.toastAlertService.showSuccessNotification(
            'Propriété ajoutée avec succés',
            'Nouvelle Propriétée a été créer avec succés',
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
