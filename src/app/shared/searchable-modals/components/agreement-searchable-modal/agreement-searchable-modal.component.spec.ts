import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgreementSearchableModalComponent } from './agreement-searchable-modal.component';

describe('AgreementSearchableModalComponent', () => {
  let component: AgreementSearchableModalComponent;
  let fixture: ComponentFixture<AgreementSearchableModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgreementSearchableModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgreementSearchableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
