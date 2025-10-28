import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchableMapsComponent } from './searchable-maps.component';

describe('SearchableMapsComponent', () => {
  let component: SearchableMapsComponent;
  let fixture: ComponentFixture<SearchableMapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchableMapsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchableMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
