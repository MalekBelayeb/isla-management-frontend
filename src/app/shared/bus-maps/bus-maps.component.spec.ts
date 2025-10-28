import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusMapsComponent } from './bus-maps.component';

describe('MapsComponent', () => {
  let component: BusMapsComponent;
  let fixture: ComponentFixture<BusMapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusMapsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
