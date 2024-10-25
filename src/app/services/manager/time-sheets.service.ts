import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TimeSheetStatus {
  name: string,
  status: TimeSheetLoadStatus,
}

export enum TimeSheetLoadStatus {
  READY = 'Ready for upload',
  INPROCESS = 'Inprocess',
  LOADED = 'Loaded',
  ERROR = 'Error'
}

@Injectable({
  providedIn: 'root'
})
export class TimeSheetsService {

  private apiUrl = environment.apiUrl;

  private timeSheetsSubject = new BehaviorSubject<TimeSheetStatus[]>([]);

  private uploadUrl = `${this.apiUrl}/uploadTimeSheetFile`;
  private deleteUrl = `${this.apiUrl}/deleteAllTimeSheetFiles`;

  constructor(private http: HttpClient) { }



  public loadTimeSheetFiles(userId: string, files: File[]): void {
    const timeSheetsStatus: TimeSheetStatus[] = [];

    files.map(file => (timeSheetsStatus.push({ name: file.name, status: TimeSheetLoadStatus.INPROCESS })));

    this.timeSheetsSubject.next(timeSheetsStatus);

    this.sendRequest(userId, files, timeSheetsStatus);
  }

  public getFileStatus(): Observable<TimeSheetStatus[]> {
    return this.timeSheetsSubject.asObservable();
  }

  private sendRequest(userId: string, files: File[], filesStatus: TimeSheetStatus[]): void {
    const file: File | undefined = files.shift();
    if (file) {
      this.uploadTimeSheet(userId, file).subscribe({
        next: (resp) => {
          this.updateTimeSheetStatus(file.name, filesStatus, TimeSheetLoadStatus.LOADED);
          this.sendRequest(userId, files, filesStatus);
        },
        error: (error) => {
          this.updateTimeSheetStatus(file.name, filesStatus, TimeSheetLoadStatus.ERROR);
          this.sendRequest(userId, files, filesStatus);
        }
      });
    }
  }

  private updateTimeSheetStatus(fileName: string, filesStatus: TimeSheetStatus[], status: TimeSheetLoadStatus): void {
    const foundStatus: TimeSheetStatus | undefined = filesStatus.find(fileElement => fileElement.name == fileName)
    if (foundStatus) {
      foundStatus.status = status;
    }
  }

  private uploadTimeSheet(userId: string, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const params = new HttpParams().set('userId', userId);
    return this.http.post(this.uploadUrl, formData, { params: params, responseType: 'text' })
  }

  public deleteAllTimeSheets(userId: string): Observable<string> {
    const params = new HttpParams().set('userId', userId);
    return this.http.delete(this.deleteUrl, { params: params, responseType: 'text' });
  }
}
