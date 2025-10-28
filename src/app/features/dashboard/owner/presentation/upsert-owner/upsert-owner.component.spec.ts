import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertOwnerComponent } from './upsert-owner.component';

describe('CreateOwnerComponent', () => {
  let component: UpsertOwnerComponent;
  let fixture: ComponentFixture<UpsertOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsertOwnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpsertOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
