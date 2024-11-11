import { TestBed } from '@angular/core/testing';

import { ProcessingStatusService } from './processing-status.service';

describe('ProcessingStatusService', () => {
  let service: ProcessingStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessingStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
