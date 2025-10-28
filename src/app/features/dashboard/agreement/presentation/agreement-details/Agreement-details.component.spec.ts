import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementDetailsComponent } from './Agreement-details.component';

describe('AgreementDetailsComponent', () => {
  let component: AgreementDetailsComponent;
  let fixture: ComponentFixture<AgreementDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgreementDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgreementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
