import { TestBed } from '@angular/core/testing';

import { TimeSheetsService } from './time-sheets.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TimeSheetsService', () => {
  let service: TimeSheetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(TimeSheetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
