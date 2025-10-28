import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertApartmentComponent } from './upsert-apartment.component';

describe('UpsertApartmentComponent', () => {
  let component: UpsertApartmentComponent;
  let fixture: ComponentFixture<UpsertApartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsertApartmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpsertApartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
