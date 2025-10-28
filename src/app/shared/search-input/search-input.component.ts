import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { conts, defaultSearchLimit } from 'src/app/variables/consts';
export interface SearchResult {
  id: string;
  title: string;
}

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css'],
})
export class SearchInputComponent implements OnChanges {
  focus = false;

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
  @Input() isInvalid = false;
  @Input() errorMessage: string = '';

  debounceDelay = 500;
  timerId?: NodeJS.Timeout;

  showSearchResult = false;
  isEmptyResult = false;
  searchResultIsLoading = false;
  @Input() searchInputValue = '';
  @Input() clearInput = false;

  @Input() triggerSearchOnOpen?: boolean;

  @Input() suffixIcon?: string;
  @Input() prefixIcon?: string;
  @Input() prefixText?: string;
  @Input() itemIcon?: string;
  @Input() maxSize = defaultSearchLimit;

  @Input() searchResult: SearchResult[] = [];
  @Input() searchPlaceholder = 'Search...';
  @Input() searchLabel = 'Liste';

  @Input() enableResultView = true;
  @Input() disabled = false;

  @Output() searchValue = new EventEmitter<string>();
  @Output() selectedResultItem = new EventEmitter<SearchResult>();
  @Output() inputClickTriggered = new EventEmitter<boolean>();

  onInputClicked() {
    this.showSearchResult = true;
    this.inputClickTriggered.emit(true);
    console.log(this.triggerSearchOnOpen);
    if (this.triggerSearchOnOpen) {
      this.searchValue.emit();
    }
  }

  debounceValueChange(newValue: KeyboardEvent) {
    const target = newValue.target as HTMLInputElement;
    if (!this.searchValue.observed) return;

    if (target.value.length == 0) {
      this.searchInputValue = '';
    }

    if (this.timerId) {
      clearTimeout(this.timerId);
    }

    this.timerId = setTimeout(() => {
      if (target.value.length >= 0) {
        this.searchValue.emit(target.value);

        if (this.enableResultView) {
          this.searchResultIsLoading = true;
          this.showSearchResult = target.value.length != 0;
        }
      } else {
        this.showSearchResult = false;
      }
    }, this.debounceDelay);
  }

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  public onClick(target: Event) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside && this.showSearchResult) {
      this.showSearchResult = false;
      this.inputClickTriggered.emit(false);
    }
  }

  onSelectedItem(item: SearchResult) {
    this.searchInputValue = item.title;
    this.selectedResultItem.emit(item);
    this.showSearchResult = false;
  }

  clearInputValue() {
    this.searchInputValue = '';
    this.searchValue.emit('');
    this.selectedResultItem.emit({ id: '', title: '' });
    this.showSearchResult = false;
  }
}
