import { TestBed } from '@angular/core/testing';

import { OauthService } from './oauth.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('OauthService', () => {
  let service: OauthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(OauthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
