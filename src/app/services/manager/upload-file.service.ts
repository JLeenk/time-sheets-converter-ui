import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, lastValueFrom, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface FileStatus {
  name: string,
  status: FileLoadStatus,
}

export interface RootFolderIdResp {
  folderId: string,
  folderIdMessage: string,
  status: RootFolderIdStatus
}

export interface GenerateReportsStatusCheck {
  status: string;
}

export enum RootFolderIdStatus {
  INIT,
  CREATED,
  DELETED,
  ERROR
}

export enum FileLoadStatus {
  READY = 'Ready for upload',
  INPROCESS = 'Inprocess',
  LOADED = 'Loaded',
  ERROR = 'Error'
}

export enum GenerateReportsStatus {
  EMPTY = '',
  INPROCESS = 'Inprocess',
  COMPLETED = 'Completed',
  ERROR = 'Error'
}

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  private apiUrl = environment.apiUrl;

  private filesSubject = new BehaviorSubject<Map<string, FileStatus>>(new Map<string, FileStatus>);
  private rooFolderId = new BehaviorSubject<RootFolderIdResp>({
    folderId: '',
    folderIdMessage: '',
    status: RootFolderIdStatus.INIT
  });
  
  private generateReportsStatus = new BehaviorSubject<GenerateReportsStatus>(GenerateReportsStatus.EMPTY);

  private deleteUrl = `${this.apiUrl}/deleteAllTimeSheetFiles`;
  private getRootFolderIdUrl = `${this.apiUrl}/getRootFolderId`;
  private getReportsStatusUrl = `${this.apiUrl}/checkReportsStatus`;
  
  constructor(private http: HttpClient) { }

  getRootFolderIdReq(userId: string): void {
    const params = new HttpParams().set('userId', userId);
    this.http.get(this.getRootFolderIdUrl, { params: params, responseType: 'text' }).subscribe({
      next: (id) => {
        if (id) {
          this.rooFolderId.next({ folderId: id, folderIdMessage: 'Root folder has already Created', status: RootFolderIdStatus.CREATED });
        } else {
          this.rooFolderId.next({ folderId: '', folderIdMessage: 'Root folder was not found', status: RootFolderIdStatus.DELETED });
        }
      },
      error: (error) => {
        if (error.status == 500) {
          this.rooFolderId.next({ folderId: 'error', folderIdMessage: 'IO error try later', status: RootFolderIdStatus.ERROR });
        } else {
          this.rooFolderId.next({ folderId: 'error', folderIdMessage: 'Try to login againe', status: RootFolderIdStatus.ERROR });
        }
      }
    })
  }

  getRootFolderId(): Observable<RootFolderIdResp> {
    return this.rooFolderId.asObservable();
  }

  getGenerateReportsStatus():Observable<GenerateReportsStatus> {
    return this.generateReportsStatus.asObservable();
  }

  deleteAllTimeSheets(userId: string): Observable<void> {
    const params = new HttpParams().set('userId', userId);
    return this.http.delete<void>(this.deleteUrl, { params: params }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  public checkGenerateReportsStatus(userId: string) {
    const params = new HttpParams().set('userId', userId);
    this.http.get(this.getReportsStatusUrl, { params: params, responseType: 'text' }).subscribe({
      next: (status) => {

        if(status == 'InProcess') {
            setTimeout(() => {
              this.checkGenerateReportsStatus(userId);
            }, 10000)
        } else if (status == 'Finished successfully') {
          this.generateReportsStatus.next(GenerateReportsStatus.COMPLETED);
        } else {
          this.generateReportsStatus.next(GenerateReportsStatus.ERROR);
        }
      },
      error: (error) => {
        this.generateReportsStatus.next(GenerateReportsStatus.ERROR);
      }
    })
  }
}
