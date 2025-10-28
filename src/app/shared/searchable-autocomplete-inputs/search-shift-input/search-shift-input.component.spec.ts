import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchShiftInputComponent } from './search-shift-input.component';

describe('SearchShiftInputComponent', () => {
  let component: SearchShiftInputComponent;
  let fixture: ComponentFixture<SearchShiftInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchShiftInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchShiftInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
