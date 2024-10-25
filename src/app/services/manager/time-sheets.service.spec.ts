import { TestBed } from '@angular/core/testing';

import { TimeSheetsService } from './time-sheets.service';

describe('TimeSheetsService', () => {
  let service: TimeSheetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeSheetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
