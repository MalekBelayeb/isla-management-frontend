import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchEmployeeInputComponent } from './search-employee-input.component';

describe('SearchEmployeeInputComponent', () => {
  let component: SearchEmployeeInputComponent;
  let fixture: ComponentFixture<SearchEmployeeInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchEmployeeInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchEmployeeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
