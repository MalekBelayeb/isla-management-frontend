import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchActivityInputComponent } from './search-activity-input.component';

describe('SearchActivityInputComponent', () => {
  let component: SearchActivityInputComponent;
  let fixture: ComponentFixture<SearchActivityInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchActivityInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchActivityInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
