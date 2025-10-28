import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchableModalComponent } from './searchable-modal.component';

describe('SearchableModalComponent', () => {
  let component: SearchableModalComponent;
  let fixture: ComponentFixture<SearchableModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchableModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
