import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiculeTypeSelectorComponent } from './vehicule-type-selector.component';

describe('VehiculeTypeSelectorComponent', () => {
  let component: VehiculeTypeSelectorComponent;
  let fixture: ComponentFixture<VehiculeTypeSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiculeTypeSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiculeTypeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
