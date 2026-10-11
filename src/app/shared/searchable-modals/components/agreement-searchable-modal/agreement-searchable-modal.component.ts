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
import { AgreementService } from '@dashboard/agreement/service/agreement.service';
import { AgreeementMapper } from '@dashboard/agreement/mappers/agreement.mapper';
import { Agreement } from '@dashboard/agreement/entity/agreement';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { apartmentPrefix } from 'src/app/variables/consts';

@Component({
  selector: 'app-agreement-searchable-modal',
  templateUrl: './agreement-searchable-modal.component.html',
  styleUrls: ['./agreement-searchable-modal.component.scss'],
  providers: [BsDropdownDirective],
})
export class AgreementSearchableModalComponent implements OnInit, OnChanges {
  @ViewChild('modalSearch') modalSearch?: TemplateRef<void>;
  searchModal?: BsModalRef;

  @Input() title = 'Chercher des contrats';
  focus = false;
  isEmptyResult = false;

  @Input() prefixIcon?: string = 'fas fa-search';
  @Input() searchInputValue = '';
  // Text shown in the trigger input; set by the consumer or on agreement selection
  @Input() selectedValue = '';
  @Input() suffixIcon?: string;
  @Input() errorText?: string;
  @Input() searchResult: SearchResult[] = [];

  @Output() cancelClicked = new EventEmitter<void>();
  @Output() agreementClicked = new EventEmitter<Agreement | undefined>();

  @Input() searchInputPlaceholder = 'Chercher un contrat...';
  @Input() searchPlaceholder = 'Chercher par locataire, local, propriétaire...';
  searchResultIsLoading = false;

  debounceDelay = 500;
  timerId: any;

  @Output() searchValue = new EventEmitter<string>();

  totalLength = 0;
  page = 1;
  pageSize = 10;

  agreements: Agreement[] = [];
  criteriaFormGroup: FormGroup;

  constructor(
    private agreementService: AgreementService,
    private modalService: BsModalService,
    private router: Router,
    private formBuilder: FormBuilder,
    private agreeementMapper: AgreeementMapper,
  ) {
    this.criteriaFormGroup = this.formBuilder.group({
      searchByTenant: new FormControl(''),
      searchByApartment: new FormControl(''),
      searchByOwner: new FormControl(''),
    });
  }

  isLoadingFetchingAgreements = false;

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
    this.getAllAgreements(this.page, this.pageSize);
  }

  hideModal() {
    this.searchModal?.hide();
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

  onAgreementClicked(agreement: Agreement) {
    // An @Output always exists; `observed` tells whether a parent bound (agreementClicked)
    if (this.agreementClicked.observed) {
      this.selectedValue = `${agreement.matricule} - ${apartmentPrefix}${agreement.apartment.matricule} - ${agreement.apartment.address}`;
      this.agreementClicked.emit(agreement);
      this.hideModal();
    } else {
      this.moveToAgreementDetails(agreement.id);
    }
  }

  clearSelectedValue() {
    this.selectedValue = '';
    this.searchValue.emit('');
    this.agreementClicked.emit(undefined);
  }

  clearSearch(input: HTMLInputElement) {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
    input.value = '';
    input.focus();
    this.clearSelectedValue();
    this.searchValueChanged('');
  }

  onCancel() {
    this.cancelClicked.emit();
    this.hideModal();
  }

  moveToAgreementDetails(id: string) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([
        `/dashboard/agreement/agreement-details/${id}`,
      ]),
    );

    window.open(url, '_blank');
  }

  searchValueChanged(searchValue: string) {
    this.getAllAgreements(this.page, this.pageSize, searchValue, false);
  }

  async getAllAgreements(
    page: number,
    pageSize: number,
    searchTerm?: string,
    useCache = false,
  ) {
    this.isLoadingFetchingAgreements = true;

    const searchByTenant = this.criteriaFormGroup.get('searchByTenant')?.value;
    const searchByApartment =
      this.criteriaFormGroup.get('searchByApartment')?.value;
    const searchByOwner = this.criteriaFormGroup.get('searchByOwner')?.value;
    const searchOnlyByAgreementNum =
      !searchByTenant && !searchByApartment && !searchByOwner;

    const urlParameters = new URLSearchParams({
      limit: `${pageSize}`,
      page: `${page}`,

      // Search only by agreement matricule, no criteria selected
      ...(searchTerm &&
        searchOnlyByAgreementNum && { searchTerm: `${searchTerm}` }),

      ...(searchByTenant && { tenantName: `${searchTerm}` }),
      ...(searchByApartment && { apartmentAdress: `${searchTerm}` }),
      ...(searchByOwner && { ownerName: `${searchTerm}` }),
    }).toString();

    this.agreementService
      .getAllAgreement(`?${urlParameters}`, useCache)
      .subscribe({
        next: (value) => {
          this.isLoadingFetchingAgreements = false;
          this.totalLength = value.body.meta.total ?? 0;
          this.agreements = this.agreeementMapper.mapAgreements(
            value.body.agreements,
          );
        },
        error: (err) => {
          console.log(err);
          this.isLoadingFetchingAgreements = false;
        },
      });
  }
}
