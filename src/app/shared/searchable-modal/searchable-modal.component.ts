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
import { Employee } from '@models/old/employe';
//import { EmployeeService } from 'src/app/features/dashboard/employee/service/employee.service';
import { GetAllEmployeeDTO } from '@models/dto/employee/get-all-employees-dto';
import { QueryStringBuilder } from '@core/query-string-builder/query-string-builder';

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
  @Output() employeeClicked = new EventEmitter<string>();

  @Input() searchPlaceholder = 'Search...';
  searchResultIsLoading = false;

  debounceDelay = 500;
  timerId: any;

  @Output() searchValue = new EventEmitter<string>();

  totalLength = 0;
  page = 1;
  pageSize = 50;

  employees: Employee[] = [];
  isLoading = false;
  isFetched = false;

  constructor(
    //private employeeService: EmployeeService,
    private getAllEmployeeDto: GetAllEmployeeDTO,
    private queryStringBuilder: QueryStringBuilder,
  ) {}

  ngOnInit(): void {
    this.getAllEmployee(0, 10);
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
    this.employeeClicked.emit(id);
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
    //this.getAllEmployee(this.page - 1, this.pageSize, searchValue);
  }

  getAllEmployee(page: number, pageSize: number, name?: string) {
    this.isLoading = true;

    const urlParameters = this.queryStringBuilder.create({
      page,
      pageSize,
      name,
    });

    /*this.employeeService.getEmployeeBySociety(urlParameters).subscribe({
      next: (value) => {
        console.log(value.body);

        this.totalLength = value.body.data.totalElements;
        this.employees = this.getAllEmployeeDto.fromResponse(
          value.body.data.content,
        );

        this.isLoading = false;
        this.isFetched = true;
      },
      error: (err) => {
        this.isFetched = true;
        this.isLoading = false;
      },
    });*/
  }
}
