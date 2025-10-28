import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QueryStringBuilder } from '@core/query-string-builder/query-string-builder';
import { SearchResult } from '@shared/search-input/search-input.component';

@Component({
  selector: 'app-search-employee-input',
  templateUrl: './search-employee-input.component.html',
  styleUrl: './search-employee-input.component.css',
})
export class SearchEmployeeInputComponent {
  employeeSearchResult: SearchResult[] = [];
  @Output() selectedEmployee = new EventEmitter<SearchResult>();
  @Input() initialValue = '';
  constructor(private queryStringBuilder: QueryStringBuilder) {}
  onSearchInputClickedChanged(event: boolean) {
    const urlParameters = this.queryStringBuilder.create({
      page: 0,
      pageSize: 10,
    });
    /*this.employeeService.getEmployeeBySociety(urlParameters).subscribe({
      next: (value) => {
        this.employeeSearchResult = value.body.data.content.map(
          (item: any): SearchResult => {
            return { id: item.id, title: item.fullname };
          },
        );
      },
      error: (err) => {
        console.log(err);
      },
    });*/
  }
  onSelectedSearchItem(event: SearchResult) {
    this.selectedEmployee.emit(event);
  }
  onSearchValueChanged(event: string) {
    if (event === '') {
      this.selectedEmployee.emit(undefined);
    }

    const urlParameters = this.queryStringBuilder.create({
      ...(event.length > 0 && { name: event }),
      ...{
        page: 0,
        pageSize: 20,
      },
    });

    /*this.employeeService.getEmployeeBySociety(urlParameters).subscribe({
      next: (value) => {
        this.employeeSearchResult = value.body.data.content.map(
          (item: any): SearchResult => {
            return { id: item.id, title: item.fullname };
          },
        );
      },
      error: (err) => {
        console.log(err);
      },
    });*/
  }
}
