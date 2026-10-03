import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { SearchResult } from '../../../search-input/search-input.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { Router } from '@angular/router';
import { ApartmentService } from '@dashboard/apartment/service/apartment.service';
import { ApartmentMapper } from '@dashboard/apartment/mappers/apartment-mapper';
import { Apartment } from '@dashboard/apartment/entity/Apartment';
import { apartmentPrefix } from 'src/app/variables/consts';

@Component({
  selector: 'app-apartment-searchable-modal',
  templateUrl: './apartment-searchable-modal.component.html',
  styleUrls: ['./apartment-searchable-modal.component.scss'],
  providers: [BsDropdownDirective],
})
export class ApartmentSearchableModalComponent implements OnInit, OnChanges {
  @ViewChild('modalSearch') modalSearch?: TemplateRef<void>;
  searchModal?: BsModalRef;

  @Input() title = 'Chercher des locaux';
  focus = false;
  isEmptyResult = false;

  @Input() prefixIcon?: string = 'fas fa-search';
  @Input() searchInputValue = '';
  // Text shown in the trigger input; set by the consumer or on tenant selection
  @Input() selectedValue = '';
  @Input() suffixIcon?: string;
  @Input() searchResult: SearchResult[] = [];

  @Output() cancelClicked = new EventEmitter<void>();
  @Output() apartmentClicked = new EventEmitter<Apartment>();

  @Input() searchPlaceholder = 'Chercher par adresse du local';
  searchResultIsLoading = false;

  debounceDelay = 500;
  timerId: any;

  @Output() searchValue = new EventEmitter<string>();

  totalLength = 0;
  page = 1;
  pageSize = 10;

  apartments: Apartment[] = [];
  isLoadingFetchingApartments = false;

  constructor(
    private apartmentService: ApartmentService,
    private modalService: BsModalService,
    private apartmentMapper: ApartmentMapper,
    private router: Router,
  ) {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchResult'] && !changes['searchResult'].firstChange) {
      this.searchResult = changes['searchResult'].currentValue;
      this.isEmptyResult = this.searchResult.length == 0;
      this.searchResultIsLoading = false;
    }

    if (changes['clearInput'] && !changes['clearInput'].firstChange) {
      this.searchInputValue = '';
    }
  }

  showModal() {
    this.searchModal = this.modalService.show(this.modalSearch!, {
      class: 'modal-xl',
    });
    this.getAllApartments(this.page, this.pageSize);
  }

  hideModal() {
    this.searchModal?.hide();
  }

  onApartmentClicked(apartment: Apartment) {
    // An @Output always exists; `observed` tells whether a parent bound (apartmentClicked)

    if (this.apartmentClicked.observed) {
      this.selectedValue = `${apartmentPrefix}${apartment.matricule} - ${apartment.address}`;
      this.apartmentClicked.emit(apartment);
      this.hideModal();
    } else {
      const url = this.router.serializeUrl(
        this.router.createUrlTree([
          `/dashboard/apartment/apartment-details/${apartment.id}`,
        ]),
      );

      window.open(url, '_blank');
    }
  }

  moveToPaymentDetails(id: string) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/dashboard/payment/create-payment/${id}`]),
    );

    window.open(url, '_blank');
  }

  debounceValueChange(newValue: any) {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }

    this.timerId = setTimeout(() => {
      if (newValue.target.value.length >= 0) {
        this.searchValueChanged(newValue.target.value);
      }
    }, this.debounceDelay);
  }

  onCancel() {
    this.cancelClicked.emit();
    this.hideModal();
  }

  searchValueChanged(searchValue: string) {
    console.log(searchValue);
    this.getAllApartments(this.page, this.pageSize, searchValue, false);
  }

  async getAllApartments(
    page: number,
    pageSize: number,
    searchTerm?: string,
    useCache = true,
  ) {
    this.isLoadingFetchingApartments = true;
    const urlParameters = new URLSearchParams({
      limit: `${pageSize}`,
      page: `${page}`,
      ...(searchTerm && { searchTerm: `${searchTerm}` }),
    }).toString();
    this.apartmentService
      .getAllApartments(`?${urlParameters}`, useCache)
      .subscribe({
        next: (value) => {
          console.log(value.body);
          this.isLoadingFetchingApartments = false;
          this.totalLength = value.body.meta.total ?? 0;
          this.apartments = ApartmentMapper.mapApartments(
            value.body.apartments,
          );
        },
        error: (err) => {
          this.isLoadingFetchingApartments = false;
        },
      });
  }
}
