import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertAgencyExpenseComponent } from './upsert-agency-expense.component';

describe('UpsertAgencyExpenseComponent', () => {
  let component: UpsertAgencyExpenseComponent;
  let fixture: ComponentFixture<UpsertAgencyExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsertAgencyExpenseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpsertAgencyExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
