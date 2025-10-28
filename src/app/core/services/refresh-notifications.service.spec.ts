import { TestBed } from '@angular/core/testing';

import { RefreshNotificationsService } from './refresh-notifications.service';

describe('RefreshNotificationsService', () => {
  let service: RefreshNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefreshNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
