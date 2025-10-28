import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchResult } from '@shared/search-input/search-input.component';

@Component({
  selector: 'app-search-site-input',
  templateUrl: './search-site-input.component.html',
  styleUrl: './search-site-input.component.css',
})
export class SearchSiteInputComponent {
  siteSearchResult: SearchResult[] = [];
  @Output() selectedSite = new EventEmitter<SearchResult>();
  @Input() initialValue = '';
  @Input() placeholder = '';
  @Input() initialList: SearchResult[] = [];
  constructor() {}

  onSearchSiteInputClickedChanged(event: boolean) {
    if (event) {
      this.siteSearchResult = this.initialList;
      /*this.siteService.getSite().subscribe({
        next: (value) => {
          this.siteSearchResult = value.body.data.map(
            (item: any): SearchResult => {
              console.log(item);
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

  onSelectedSiteSearchItem(event: any) {
    this.selectedSite.emit(event);
  }
}
