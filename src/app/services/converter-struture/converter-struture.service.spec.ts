import { TestBed } from '@angular/core/testing';

import { ConverterStrutureService, StructreErrorResponse, StructreFolderIdResponse, StructreResponse, StrutureStatus } from './converter-struture.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';

describe('ConverterStrutureService', () => {

  let apiUrl = environment.apiUrl;
  let service: ConverterStrutureService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(ConverterStrutureService);
    httpMock = TestBed.inject(HttpTestingController);


  });

  afterEach(() => {
    httpMock.verify(); // Ensure that there are no outstanding HTTP requests
  });

  it('Should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should indicate structure was created', () => {
    const userId: string = '123';

    const mockedResponse: StructreResponse = {
      status: StrutureStatus.CREATED,
      message: 'Structure was created'
    }

    service.createRootFolder(userId).subscribe(resp => {
      expect(resp).toEqual(mockedResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/createRootFolder?userId=${userId}`);
    expect(req.request.method).toBe('POST');
    req.flush(mockedResponse);
  });

  it('Should indicate structure was deleted', () => {
    const userId: string = '123';

    const mockedResponse: StructreResponse = {
      status: StrutureStatus.DELETED,
      message: 'Structure was deleted'
    }

    service.deleteRootFolder(userId).subscribe(resp => {
      expect(resp).toEqual(mockedResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/deleteRootFolder?userId=${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockedResponse);
  });

  it('Should return folder Id', () => {
    const userId: string = '123';

    const mockedResponse: StructreFolderIdResponse = {
      status: StrutureStatus.CREATED,
      rootFolderId: '1234'
    }

    service.getRootFolderId(userId).subscribe(resp => {
      expect(resp).toEqual(mockedResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/getRootFolderId?userId=${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockedResponse);
  });

  it('Should handel 404 error and return custom responce with DELETE status', () => {
    const userId: string = '123';

    const mockErrorResponse = new HttpErrorResponse({
      status: 404,
      statusText: 'Not Found'
    });

    service.deleteRootFolder(userId).subscribe({
      next: () => fail('Expected an error, not a success response'),
      error: (error: StructreErrorResponse) => {
        expect(error).toBeInstanceOf(StructreErrorResponse)
        expect(error.strutureStatus).toBe(StrutureStatus.DELETED);
        expect(error.structureMessage).toBe('Structure was deleted');
      }
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/deleteRootFolder?userId=${userId}`);
    req.flush('Not Found', mockErrorResponse);
  });

  it('Should handel server error and return custom responce with ERROR status', () => {
    const userId: string = '123';

    const mockErrorResponse = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error'
    });

    service.deleteRootFolder(userId).subscribe({
      next: () => fail('Expected an error, not a success response'),
      error: (error: StructreErrorResponse) => {
        expect(error).toBeInstanceOf(StructreErrorResponse)
        expect(error.strutureStatus).toBe(StrutureStatus.ERROR);
        expect(error.structureMessage).toBe('Some server error');
      }
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/deleteRootFolder?userId=${userId}`);
    req.flush('Internal Server Error', mockErrorResponse);
  });

});
