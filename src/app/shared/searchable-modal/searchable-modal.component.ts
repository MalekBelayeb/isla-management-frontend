import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { SearchResult } from '../search-input/search-input.component';
import { TenantService } from '@dashboard/tenant/service/tenant.service';
import { TenantMapper } from '@dashboard/tenant/mappers/tenant-mapper';
import { Tenant } from '@dashboard/tenant/entity/tenant';

@Component({
  selector: 'app-searchable-modal',
  templateUrl: './searchable-modal.component.html',
  styleUrls: ['./searchable-modal.component.css'],
})
export class SearchableModalComponent implements OnInit, OnChanges {
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
  pageSize = 20;

  tenants: Tenant[] = [];

  constructor(
    private tenantService: TenantService,
    private tenantMapper: TenantMapper,
  ) {}
  isLoadingFetchingTenants = false;

  ngOnInit(): void {
    this.getAllTenants(this.page, this.pageSize);
  }
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

  moveToDetails(id: string) {
    this.tenantClicked.emit(id);
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
