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
import { OwnerService } from '@dashboard/owner/service/owner.service';
import { GetAllOwnersMapper } from '@dashboard/owner/mappers/get-all-owners-mapper';
import { Owner } from '@dashboard/owner/entity/owner';

@Component({
  selector: 'app-owner-searchable-modal',
  templateUrl: './owner-searchable-modal.component.html',
  styleUrls: ['./owner-searchable-modal.component.scss'],
  providers: [BsDropdownDirective],
})
export class OwnerSearchableModalComponent implements OnInit, OnChanges {
  @ViewChild('modalSearch') modalSearch?: TemplateRef<void>;
  searchModal?: BsModalRef;

  @Input() title = 'Chercher des propriétaires';
  focus = false;
  isEmptyResult = false;

  @Input() prefixIcon?: string = 'fas fa-search';
  @Input() searchInputValue = '';
  // Text shown in the trigger input; set by the consumer or on owner selection
  @Input() selectedValue = '';
  @Input() suffixIcon?: string;
  @Input() searchResult: SearchResult[] = [];

  @Output() cancelClicked = new EventEmitter<void>();
  @Output() ownerClicked = new EventEmitter<Owner>();

  @Input() searchPlaceholder =
    'Chercher par tél, cin, prénom et nom, société...';
  searchResultIsLoading = false;

  debounceDelay = 500;
  timerId: any;

  @Output() searchValue = new EventEmitter<string>();

  totalLength = 0;
  page = 1;
  pageSize = 10;

  owners: Owner[] = [];
  isLoadingFetchingOwners = false;

  constructor(
    private ownerService: OwnerService,
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
    this.getAllOwners(this.page, this.pageSize);
  }

  hideModal() {
    this.searchModal?.hide();
  }

  onOwnerClicked(owner: Owner) {
    // An @Output always exists; `observed` tells whether a parent bound (ownerClicked)
    if (this.ownerClicked.observed) {
      this.selectedValue = `${owner.matricule} - ${owner.name}`;
      this.ownerClicked.emit(owner);
      this.hideModal();
    } else {
      this.openOwnerDetails(owner.id);
    }
  }

  openOwnerDetails(id: string) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/dashboard/owner/owner-details/${id}`]),
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
    this.getAllOwners(this.page, this.pageSize, searchValue, false);
  }

  async getAllOwners(
    page: number,
    pageSize: number,
    searchTerm?: string,
    useCache = true,
  ) {
    this.isLoadingFetchingOwners = true;
    const urlParameters = new URLSearchParams({
      limit: `${pageSize}`,
      page: `${page}`,
      ...(searchTerm && { searchTerm: `${searchTerm}` }),
    }).toString();

    this.ownerService.getAllOwners(`?${urlParameters}`, useCache).subscribe({
      next: (value) => {
        this.isLoadingFetchingOwners = false;
        this.totalLength = value.body.meta.total ?? 0;
        this.owners = GetAllOwnersMapper.fromResponse(value.body.owners);
      },
      error: (err) => {
        console.log(err);
        this.isLoadingFetchingOwners = false;
      },
    });
  }
}
