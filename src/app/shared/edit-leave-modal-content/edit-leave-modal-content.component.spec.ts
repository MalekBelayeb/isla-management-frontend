import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLeaveModalContentComponent } from './edit-leave-modal-content.component';

describe('EditLeaveModalContentComponent', () => {
  let component: EditLeaveModalContentComponent;
  let fixture: ComponentFixture<EditLeaveModalContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLeaveModalContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLeaveModalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
