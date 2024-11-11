import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export enum GenerateReportsStatus {
  EMPTY = '',
  INPROCESS = 'Inprocess',
  COMPLETED = 'Completed',
  ERROR = 'Error'
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private apiUrl = environment.apiUrl;

  private _generateReportsStatus = new BehaviorSubject<GenerateReportsStatus>(GenerateReportsStatus.EMPTY);


  constructor(private http: HttpClient) { }

  generateReports(userId: string): Observable<string> {
    const params = new HttpParams()
      .set('userId', userId);

    return this.http.post<string>(`${this.apiUrl}/generateReports`, null, {
      params: params,
    });
  }

  public get generateReportsStatus(): Observable<GenerateReportsStatus> {
    return this._generateReportsStatus.asObservable();
  }

  public checkGenerateReportsStatus(userId: string) {
    const params = new HttpParams().set('userId', userId);
    this.http.get(`${this.apiUrl}/checkReportsStatus`, { params: params, responseType: 'text' }).subscribe({
      next: (status) => {

        if (status == 'InProcess') {
          setTimeout(() => {
            this.checkGenerateReportsStatus(userId);
          }, 10000)
        } else if (status == 'Finished successfully') {
          this._generateReportsStatus.next(GenerateReportsStatus.COMPLETED);
        } else {
          this._generateReportsStatus.next(GenerateReportsStatus.ERROR);
        }
      },
      error: (error) => {
        this._generateReportsStatus.next(GenerateReportsStatus.ERROR);
      }
    });
  }
}
