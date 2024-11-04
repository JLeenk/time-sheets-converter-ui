import { HttpClient, HttpErrorResponse, HttpEventType, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TimeSheetStatus {
  name: string,
  status: FileLoadStatus,
}

export interface TimeSheets {
  wholeStatus: FileLoadStatus,
  timeSheetStatus: TimeSheetStatus[]
}

export enum FileLoadStatus {
  READY = 'Ready for upload',
  INPROCESS = 'Inprocess',
  LOADED = 'Loaded',
  COMPLETED = 'Completed',
  ERROR = 'Error'
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private apiUrl = environment.apiUrl;

  private timeSheetsSubject = new BehaviorSubject<TimeSheets>({wholeStatus: FileLoadStatus.READY, timeSheetStatus: []});

  constructor(private http: HttpClient) { }

  private uploadTemplateFile(userId: string, file: File, path: string): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    const params = new HttpParams()
      .set('userId', userId);

    return this.http.post<string>(`${this.apiUrl}/${path}`, formData, {
      params: params,
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => this.getEventMessage(event, file)),
      catchError(this.handleError)
    );
  }

  public uploadReportTemplateFile(userId: string, file: File): Observable<string> {
    return this.uploadTemplateFile(userId, file, 'uploadRepotTemplate');
  }

  uploadTimeSheetTemplateFile(userId: string, file: File): Observable<string> {
    return this.uploadTemplateFile(userId, file, 'uploadTimeSheetTemplate');
  }

  public uploadTimeSheetFiles(userId: string, files: File[]): void {
    const timeSheetsStatus: TimeSheetStatus[] = [];

    files.map(file => (timeSheetsStatus.push({ name: file.name, status: FileLoadStatus.INPROCESS })));

    const timeSheets: TimeSheets = {wholeStatus: FileLoadStatus.INPROCESS, timeSheetStatus: timeSheetsStatus};

    this.timeSheetsSubject.next(timeSheets);

    this.sendRequest(userId, files, timeSheets);
  }

  private sendRequest(userId: string, files: File[], timeSheets: TimeSheets): void {
    const file: File | undefined = files.shift();
    if (file) {
      this.uploadTimeSheet(userId, file).subscribe({
        next: () => {
          this.updateTimeSheetStatus(file.name, timeSheets, FileLoadStatus.LOADED);
          this.sendRequest(userId, files, timeSheets);
        },
        error: () => {
          this.updateTimeSheetStatus(file.name, timeSheets, FileLoadStatus.ERROR);
          this.sendRequest(userId, files, timeSheets);
        }
      });
    } else {
      timeSheets.wholeStatus = FileLoadStatus.COMPLETED;
      this.timeSheetsSubject.next(timeSheets);
    }
  }

  private updateTimeSheetStatus(fileName: string, timeSheets: TimeSheets, status: FileLoadStatus): void {
    const foundStatus: TimeSheetStatus | undefined = timeSheets.timeSheetStatus.find(fileElement => fileElement.name == fileName)
    if (foundStatus) {
      foundStatus.status = status;
    }
  }

  private uploadTimeSheet(userId: string, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const params = new HttpParams().set('userId', userId);
    return this.http.post(`${this.apiUrl}/uploadTimeSheetFile`, formData, { params: params, responseType: 'text' });
  }

  public getFileStatus(): Observable<TimeSheets> {
    return this.timeSheetsSubject.asObservable();
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

  public deleteAllTimeSheets(userId: string): Observable<void> {
    const params = new HttpParams().set('userId', userId);
    return this.http.delete<void>(`${this.apiUrl}/deleteAllTimeSheetFiles`, { params: params }).pipe(
      catchError(this.handleError)
    );
  }

}
