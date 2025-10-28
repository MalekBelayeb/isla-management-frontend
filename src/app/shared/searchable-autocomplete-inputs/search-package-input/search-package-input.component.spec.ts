import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSiteInputComponent } from './search-package-input.component';

describe('SearchSiteInputComponent', () => {
  let component: SearchSiteInputComponent;
  let fixture: ComponentFixture<SearchSiteInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchSiteInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchSiteInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
