import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QueryStringBuilder } from '@core/query-string-builder/query-string-builder';
import { SearchResult } from '@shared/search-input/search-input.component';

@Component({
  selector: 'app-search-package-input',
  templateUrl: './search-package-input.component.html',
  styleUrl: './search-package-input.component.css',
})
export class SearchPackageInputComponent {
  packageSearchResult: SearchResult[] = [];
  @Output() selectedPackage = new EventEmitter<SearchResult>();
  @Input() initialValue = '';
  constructor(private queryStringBuilder: QueryStringBuilder) {}
  onSearchInputClickedChanged(event: boolean) {
    /*this.pacakgeService.getAllPackages(0, 50).subscribe({
      next: (value) => {
        this.packageSearchResult = value.body.data.content.map(
          (item: any): SearchResult => {
            return { id: item.id, title: item.name };
          },
        );
      },
      error: (err) => {
        console.log(err);
      },
    });*/
  }
  onSelectedSearchItem(event: SearchResult) {
    this.selectedPackage.emit(event);
  }
  onSearchValueChanged(event: string) {
    if (event === '') {
      this.selectedPackage.emit(undefined);
    }

    const urlParameters = this.queryStringBuilder.create({
      ...(event.length > 0 && { label: event }),
      limit: 5,
    });

    /*this.pacakgeService.searchPackages(urlParameters).subscribe({
      next: (value) => {
        this.packageSearchResult = value.body.data.map(
          (item: any): SearchResult => {
            return { id: item.id, title: item.name };
          },
        );
      },
      error: (err) => {
        console.log(err);
      },
    });*/
  }
}
