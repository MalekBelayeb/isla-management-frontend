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
import { PropertyService } from '@dashboard/property/service/property.service';
import { PropertyMapper } from '@dashboard/property/mappers/property-mapper';
import { Property } from '@property/entity/property';

@Component({
  selector: 'app-property-searchable-modal',
  templateUrl: './property-searchable-modal.component.html',
  styleUrls: ['./property-searchable-modal.component.scss'],
  providers: [BsDropdownDirective],
})
export class PropertySearchableModalComponent implements OnInit, OnChanges {
  @ViewChild('modalSearch') modalSearch?: TemplateRef<void>;
  searchModal?: BsModalRef;

  @Input() title = 'Chercher des propriétés';
  focus = false;
  isEmptyResult = false;

  @Input() prefixIcon?: string = 'fas fa-search';
  @Input() searchInputValue = '';
  // Text shown in the trigger input; set by the consumer or on property selection
  @Input() selectedValue = '';
  @Input() suffixIcon?: string;
  @Input() searchResult: SearchResult[] = [];

  @Output() cancelClicked = new EventEmitter<void>();
  @Output() propertyClicked = new EventEmitter<Property>();

  @Input() searchPlaceholder = 'Chercher par adresse de la propriété';
  searchResultIsLoading = false;

  debounceDelay = 500;
  timerId: any;

  @Output() searchValue = new EventEmitter<string>();

  totalLength = 0;
  page = 1;
  pageSize = 10;

  properties: Property[] = [];
  isLoadingFetchingProperties = false;

  constructor(
    private propertyService: PropertyService,
    private modalService: BsModalService,
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
    this.getAllProperties(this.page, this.pageSize);
  }

  hideModal() {
    this.searchModal?.hide();
  }

  onPropertyClicked(property: Property) {
    // An @Output always exists; `observed` tells whether a parent bound (propertyClicked)
    if (this.propertyClicked.observed) {
      this.selectedValue = `${property.idNumber} - ${property.address}`;
      this.propertyClicked.emit(property);
      this.hideModal();
    } else {
      this.openPropertyDetails(property.id);
    }
  }

  openPropertyDetails(id: string) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/dashboard/property/property-details/${id}`]),
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
    this.getAllProperties(this.page, this.pageSize, searchValue, false);
  }

  async getAllProperties(
    page: number,
    pageSize: number,
    searchTerm?: string,
    useCache = true,
  ) {
    this.isLoadingFetchingProperties = true;
    const urlParameters = new URLSearchParams({
      limit: `${pageSize}`,
      page: `${page}`,
      ...(searchTerm && { searchTerm: `${searchTerm}` }),
    }).toString();

    this.propertyService
      .getAllProperties(`?${urlParameters}`, useCache)
      .subscribe({
        next: (value) => {
          this.isLoadingFetchingProperties = false;
          this.totalLength = value.body.meta.total ?? 0;
          this.properties = PropertyMapper.mapProperties(
            value.body.properties,
          );
        },
        error: (err) => {
          console.log(err);
          this.isLoadingFetchingProperties = false;
        },
      });
  }
}
