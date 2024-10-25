import { HttpClient, HttpErrorResponse, HttpEventType, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createRootFolder(userId: string): Observable<string> {
    const params = new HttpParams().set('userId', userId);

    return this.http.post(`${this.apiUrl}/createRootFolder`, null, { params: params, responseType: 'text' })
  }

  deleteRootFolder(userId: string): Observable<any> {
    const params = new HttpParams().set('userId', userId);

    return this.http.delete(`${this.apiUrl}/deleteRootFolder`, { params: params });
  }

  downloadTimeSheetTemplateFile(userId: string): Observable<Blob> {
    const params = new HttpParams()
      .set('userId', userId);

    return this.http.get(`${this.apiUrl}/getTimeSheetTemplate`,
      {
        params: params,
        responseType: 'blob',
      });
  }

  getRootFolderId(userId: string): Observable<string> {
    const params = new HttpParams()
      .set('userId', userId);
    return this.http.get<string>(`${this.apiUrl}/getRootFolderId`,
      {
        params: params,
      });
  }

  downloadReportTemplateFile(userId: string): Observable<Blob> {
    const params = new HttpParams()
      .set('userId', userId);

    return this.http.get(`${this.apiUrl}/getReportTemplate`,
      {
        params: params,
        responseType: 'blob',
      });
  }

  uploadTimeSheetTemplateFile(userId: string, file: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    const params = new HttpParams()
      .set('userId', userId);

    return this.http.post<string>(`${this.apiUrl}/uploadTimeSheetTemplate`, formData, {
      params: params,
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => this.getEventMessage(event, file)),
      catchError(this.handleError)
    );
  }

  uploadReportTemplateFile(userId: string, file: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    const params = new HttpParams()
      .set('userId', userId);

    return this.http.post<string>(`${this.apiUrl}/uploadRepotTemplate`, formData, {
      params: params,
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => this.getEventMessage(event, file)),
      catchError(this.handleError)
    );
  }

  generateReports(userId: string): Observable<string> {
    const params = new HttpParams()
      .set('userId', userId);

    return this.http.post<string>(`${this.apiUrl}/generateReports`, null, {
      params: params,
    });
  }

  private getEventMessage(event: any, file: File) {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        return Math.round(100 * event.loaded / event.total);
      case HttpEventType.Response:
        return event.body;
      default:
        return `File "${file.name}" uploading...`;
    }
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error ', error);
    return throwError(() => new Error(error.message || 'Server Error'));
  }
}
