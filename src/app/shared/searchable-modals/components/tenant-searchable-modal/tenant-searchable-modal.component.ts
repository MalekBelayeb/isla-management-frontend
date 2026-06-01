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
import { TenantService } from '@dashboard/tenant/service/tenant.service';
import { TenantMapper } from '@dashboard/tenant/mappers/tenant-mapper';
import { Tenant } from '@dashboard/tenant/entity/tenant';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tenant-searchable-modal',
  templateUrl: './tenant-searchable-modal.component.html',
  styleUrls: ['./tenant-searchable-modal.component.scss'],
  providers: [BsDropdownDirective],
})
export class TenantSearchableModalComponent implements OnInit, OnChanges {
  @ViewChild('modalSearch') modalSearch?: TemplateRef<void>;
  searchModal?: BsModalRef;

  @Input() title = 'Chercher des locataires';
  focus = false;
  isEmptyResult = false;

  @Input() prefixIcon?: string = 'fas fa-search';
  @Input() searchInputValue = '';
  @Input() suffixIcon?: string;
  @Input() searchResult: SearchResult[] = [];

  @Output() cancelClicked = new EventEmitter<void>();
  @Output() tenantClicked = new EventEmitter<string>();

  @Input() searchPlaceholder =
    'Chercher par tél, cin, prénom et nom, email, address...';
  searchResultIsLoading = false;

  debounceDelay = 500;
  timerId: any;

  @Output() searchValue = new EventEmitter<string>();

  totalLength = 0;
  page = 1;
  pageSize = 10;

  tenants: Tenant[] = [];

  constructor(
    private tenantService: TenantService,
    private tenantMapper: TenantMapper,
    private modalService: BsModalService,
    private router: Router,
  ) {}
  isLoadingFetchingTenants = false;

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
    this.getAllTenants(this.page, this.pageSize);
  }

  hideModal() {
    this.searchModal?.hide();
  }

  moveToTenantDetails(id: string) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/dashboard/tenant/tenant-details/${id}`]),
    );

    window.open(url, '_blank');
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
    this.getAllTenants(this.page, this.pageSize, searchValue, false);
  }

  async getAllTenants(
    page: number,
    pageSize: number,
    searchTerm?: string,
    useCache = true,
  ) {
    this.isLoadingFetchingTenants = true;

    const urlParameters = new URLSearchParams({
      limit: `${pageSize}`,
      page: `${page}`,
      ...(searchTerm && { searchTerm: `${searchTerm}` }),
    }).toString();

    this.tenantService.getAllTenant(`?${urlParameters}`, useCache).subscribe({
      next: (value) => {
        this.isLoadingFetchingTenants = false;
        this.totalLength = value.body.meta.total ?? 0;
        this.tenants = this.tenantMapper.mapTenants(value.body.tenants);
      },
      error: (err) => {
        console.log(err);
        this.isLoadingFetchingTenants = false;
      },
    });
  }
}
