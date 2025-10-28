import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementsListComponent } from './agreements-list.component';

describe('AggrementsListComponent', () => {
  let component: AgreementsListComponent;
  let fixture: ComponentFixture<AgreementsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgreementsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgreementsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
