import { TestBed } from '@angular/core/testing';

import { UploadFileService } from './upload-file.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UploadFileService', () => {
  let service: UploadFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(UploadFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
