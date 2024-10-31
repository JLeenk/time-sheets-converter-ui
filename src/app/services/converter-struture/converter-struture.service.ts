import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface StructreResponse {
  status: StrutureStatus,
  message: string
}

export interface StructreFolderIdResponse {
  status: StrutureStatus,
  rootFolderId: string
}

export class StructreErrorResponse extends HttpErrorResponse {

  strutureStatus: StrutureStatus;
  structureMessage: string;

  constructor(httpErrorResponse: HttpErrorResponse, structureMessage?: string, strutureStatus?: StrutureStatus) {
    super({
      error: httpErrorResponse.error,
      headers: httpErrorResponse.headers,
      status: httpErrorResponse.status,
      statusText: httpErrorResponse.statusText,
    });

    this.structureMessage = structureMessage || 'Unknown Error';
    this.strutureStatus = strutureStatus || StrutureStatus.ERROR;
  };
}

export enum StrutureStatus {
  CREATED = 'Created',
  DELETED = 'Deleted',
  ERROR = 'Error'
}

@Injectable({
  providedIn: 'root'
})
export class ConverterStrutureService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public createRootFolder(userId: string): Observable<StructreResponse> {
    const params = new HttpParams().set('userId', userId);

    return this.http
      .post<StructreResponse>(`${this.apiUrl}/createRootFolder`, null, { params: params })
      .pipe(catchError(this.handleError));
  }

  public deleteRootFolder(userId: string): Observable<StructreResponse> {
    const params = new HttpParams().set('userId', userId);

    return this.http
      .delete<StructreResponse>(`${this.apiUrl}/deleteRootFolder`, { params: params })
      .pipe(catchError(this.handleError));
  }

  getRootFolderId(userId: string): Observable<StructreFolderIdResponse> {
    const params = new HttpParams()
      .set('userId', userId);
    return this.http
      .get<StructreFolderIdResponse>(`${this.apiUrl}/getRootFolderId`, { params: params })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status == 404) {
      return throwError(() => new StructreErrorResponse(error, 'Structure was deleted', StrutureStatus.DELETED));
    }
    return throwError(() => new StructreErrorResponse(error, 'Some server error'));
  }
}