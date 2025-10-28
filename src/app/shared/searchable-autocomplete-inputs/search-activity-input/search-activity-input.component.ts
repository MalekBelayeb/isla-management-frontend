import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchResult } from '@shared/search-input/search-input.component';

@Component({
  selector: 'app-search-activity-input',
  templateUrl: './search-activity-input.component.html',
  styleUrl: './search-activity-input.component.css',
})
export class SearchActivityInputComponent {
  activitySearchResult: SearchResult[] = [];
  @Output() selectedActivity = new EventEmitter<SearchResult>();
  @Input() initialValue = '';

  constructor() {}

  onSearchActivityInputClickedChanged(event: boolean) {
    if (event) {
      /*this.activityService.getAllActivities().subscribe({
        next: (value) => {
          this.activitySearchResult = value.body.data.map(
            (item: any): SearchResult => {
              return { id: item.id, title: item.label };
            },
          );
        },
        error: (err) => {
          console.log(err);
          this.activitySearchResult = [];
        },
      });*/
    }
  }

  onSelectedActivitySearchItem(event: SearchResult) {
    this.selectedActivity.emit(event);
  }
}
