import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertPaymentComponent } from './upsert-payment.component';

describe('UpsertPaiementComponent', () => {
  let component: UpsertPaymentComponent;
  let fixture: ComponentFixture<UpsertPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsertPaymentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UpsertPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
