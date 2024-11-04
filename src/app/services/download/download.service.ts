import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public downloadTimeSheetTemplateFile(userId: string): Observable<Blob> {
    return this.downloadTemplateFile(userId, 'getTimeSheetTemplate');
  }

  public downloadReportTemplateFile(userId: string): Observable<Blob> {
    return this.downloadTemplateFile(userId, 'getReportTemplate');
  }

  private downloadTemplateFile(userId: string, path: string): Observable<Blob> {
    const params = new HttpParams()
      .set('userId', userId);

    return this.http.get(`${this.apiUrl}/${path}`,
      {
        params: params,
        responseType: 'blob',
      });
  }
}
