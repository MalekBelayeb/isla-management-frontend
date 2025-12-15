import { Component, Input, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApartmentService } from '@dashboard/apartment/service/apartment.service';
import { ApartmentDetails } from '@dashboard/apartment/entity/apartment-details';
import { PropertyMapper } from '@dashboard/property/mappers/property-mapper';
import { PropertyService } from '@dashboard/property/service/property.service';
import { DataTypes } from '@models/data';
import { SearchResult } from '@shared/search-input/search-input.component';
import { ToastAlertService } from '@shared/toast-alert/toast-alert.service';
import { defaultSearchLimit } from 'src/app/variables/consts';
import { ActivatedRoute } from '@angular/router';
import { PropertyDetails } from '@dashboard/property/entity/property-details';

@Component({
  selector: 'app-upsert-apartment',
  templateUrl: './upsert-apartment.component.html',
  styleUrl: './upsert-apartment.component.css',
})
export class UpsertApartmentComponent {
  formGroup: FormGroup;
  submitted = false;
  isLoading = false;
  focus1 = false;
  focus2 = false;
  focus3 = false;
  focus4 = false;
  propertyDetails?: PropertyDetails;

  @Input() apartmentDetails?: ApartmentDetails;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private propertyService: PropertyService,
    private apartmentService: ApartmentService,
    private toastAlertService: ToastAlertService,
  ) {
    this.formGroup = this.formBuilder.group({
      propertyId: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      rooms: new FormControl('', Validators.required),
      description: new FormControl(''),
    });
  }

  apartmentsType: SearchResult[] = DataTypes.apartmentsType;

  propertyOptions: SearchResult[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['apartmentDetails'] &&
      !changes['apartmentDetails'].firstChange
    ) {
      this.apartmentDetails = changes['apartmentDetails'].currentValue;
      if (this.apartmentDetails) {
        this.formGroup.get('address')?.setValue(this.apartmentDetails?.address);
        this.formGroup.get('type')?.setValue(this.apartmentDetails?.type);
        this.formGroup.get('rooms')?.setValue(this.apartmentDetails?.rooms);
        this.formGroup
          .get('propertyId')
          ?.setValue(this.apartmentDetails?.propertyId);
        this.formGroup
          .get('description')
          ?.setValue(this.apartmentDetails?.description);
        this.searchPropertyValue = this.apartmentDetails.address;
      }
    }
  }

  ngOnInit(): void {
    const propertyId = this.getPropertyId();
    if (propertyId) {
      // case coming from property details
      this.getPropertyDetails();
    }
  }

  get createApartmentForm() {
    return this.formGroup.controls;
  }

  getPropertyId(): string {
    return this.route.snapshot.paramMap.get('idProperty') ?? '';
  }

  getPropertyDetails() {
    this.propertyService.getProperty(this.getPropertyId()).subscribe({
      next: (value) => {
        const result = value.body;
        const propertyDetails = PropertyMapper.mapPropertyDetails(result);
        this.propertyDetails = propertyDetails;
        this.searchPropertyValue = this.propertyDetails.address;
        this.formGroup.get('propertyId')?.setValue(this.propertyDetails.id);
      },
    });
  }

  searchPropertyValue: string = '';
  onSearchPropertyValueChanged(searchValue?: string) {
    const params = {
      ...(searchValue && { searchTerm: searchValue }),
      limit: `${defaultSearchLimit}`,
    };

    const queryString = new URLSearchParams(params).toString();
    this.propertyService.getAllProperties(`?${queryString}`).subscribe({
      next: (value) => {
        const properties = PropertyMapper.mapProperties(value.body.properties);
        this.propertyOptions = properties.map((item) => ({
          id: item.id,
          title: `${item.matricule} - ${item.address}`,
        }));
      },
    });
  }
  onSelectedPropertySearchItem(searchResult: SearchResult) {
    console.log(searchResult);

    this.formGroup.get('propertyId')?.setValue(searchResult.id);
  }

  onSelectedApartmentTypeSearchItem(searchResult: SearchResult) {
    console.log(searchResult);
    this.formGroup.get('type')?.setValue(searchResult.id);
  }
  upsertApartment() {
    this.submitted = true;
    console.log(this.formGroup.controls);
    if (this.formGroup.invalid) return;
    this.isLoading = true;

    let body: any = {
      ...(this.apartmentDetails && { id: this.apartmentDetails.id }),
      propertyId: this.formGroup.get('propertyId')?.value,
      address: this.formGroup.get('address')?.value,
      description: this.formGroup.get('description')?.value,
      rooms: Number(this.formGroup.get('rooms')?.value),
      type: this.formGroup.get('type')?.value,
    };
    if (this.apartmentDetails) {
      this.apartmentService
        .updateApartment(this.apartmentDetails.id, body)
        .subscribe({
          next: (value) => {
            this.toastAlertService.showSuccessNotification(
              'Local modifié avec succés',
              'Local a été modifier avec succés',
            );
            this.isLoading = false;
          },
          error: (err) => {
            this.isLoading = false;
          },
        });
    } else {
      this.apartmentService.createApartment(body).subscribe({
        next: (value) => {
          this.toastAlertService.showSuccessNotification(
            'Local ajoutée avec succés',
            'Local a été créer avec succés',
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
