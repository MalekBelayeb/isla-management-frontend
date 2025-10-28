import { TestBed } from '@angular/core/testing';

import { IsValidEmployeeClientGuard } from './is-valid-employee-client.guard';

describe('IsValidEmployeeClientGuard', () => {
  let guard: IsValidEmployeeClientGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsValidEmployeeClientGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
