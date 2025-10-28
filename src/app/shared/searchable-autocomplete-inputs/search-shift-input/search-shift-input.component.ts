import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QueryStringBuilder } from '@core/query-string-builder/query-string-builder';
import { SearchResult } from '@shared/search-input/search-input.component';

@Component({
  selector: 'app-search-shift-input',
  templateUrl: './search-shift-input.component.html',
  styleUrl: './search-shift-input.component.css',
})
export class SearchShiftInputComponent {
  @Output() selectedShift = new EventEmitter<SearchResult>();
  @Input() initialValue = '';

  shiftSearchResult: SearchResult[] = [];

  constructor(private queryStringBuilder: QueryStringBuilder) {}

  onSearchInputClickedChanged(event: boolean) {
    if (event) {
      const body = {
        ...(event && {
          label: '',
        }),
        limit: 5,
      };

      const urlParameters = this.queryStringBuilder.create(body);

      /*this.shiftService.searchShift(urlParameters).subscribe({
        next: (value) => {
          this.shiftSearchResult = value.body.data.map(
            (item: any): SearchResult => {
              return { id: item.id, title: item.label };
            },
          );
        },
        error: (err) => {
          console.log(err);
        },
      });*/
    }
  }
  onSelectedSearchItem(event: SearchResult) {
    this.selectedShift.emit(event);
  }
  onSearchValueChanged(event: string) {
    if (event === '') {
      this.selectedShift.emit(undefined);
    }

    const urlParameters = this.queryStringBuilder.create({
      label: event,
      limit: 5,
    });

    /*this.shiftService.searchShift(urlParameters).subscribe({
      next: (value) => {
        this.shiftSearchResult = value.body.data.map(
          (item: any): SearchResult => {
            return { id: item.id, title: item.label };
          },
        );
      },
      error: (err) => {
        console.log(err);
      },
    });*/
  }
}
