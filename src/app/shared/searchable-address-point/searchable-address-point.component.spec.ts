import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchableAddressPointComponent } from './searchable-address-point.component';

describe('SearchableAddressPointComponent', () => {
  let component: SearchableAddressPointComponent;
  let fixture: ComponentFixture<SearchableAddressPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchableAddressPointComponent ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(SearchableAddressPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
