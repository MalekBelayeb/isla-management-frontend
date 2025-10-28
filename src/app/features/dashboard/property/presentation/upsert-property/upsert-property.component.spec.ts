import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertPropertyComponent } from './upsert-property.component';

describe('UpsertPropertyComponent', () => {
  let component: UpsertPropertyComponent;
  let fixture: ComponentFixture<UpsertPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsertPropertyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpsertPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
