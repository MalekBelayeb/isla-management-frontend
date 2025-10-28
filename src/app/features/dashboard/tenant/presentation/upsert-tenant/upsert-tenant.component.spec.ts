import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertTenantComponent } from './upsert-tenant.component';

describe('UpsertTenantComponent', () => {
  let component: UpsertTenantComponent;
  let fixture: ComponentFixture<UpsertTenantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsertTenantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpsertTenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
