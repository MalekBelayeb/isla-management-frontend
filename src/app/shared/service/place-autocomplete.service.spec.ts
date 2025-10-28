import { TestBed } from '@angular/core/testing';

import { PlaceAutocompleteService } from './place-autocomplete.service';

describe('PlaceAutocompleteService', () => {
  let service: PlaceAutocompleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlaceAutocompleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
