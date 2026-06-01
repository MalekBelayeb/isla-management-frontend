import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TenantSearchableModalComponent } from './tenant-searchable-modal.component';

describe('TenantSearchableModalComponent', () => {
  let component: TenantSearchableModalComponent;
  let fixture: ComponentFixture<TenantSearchableModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantSearchableModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TenantSearchableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
