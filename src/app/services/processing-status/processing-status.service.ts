import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum Operation {
  INIT,
  GENERATE_REPORT,
  UPLOAD_TIME_SHEETS,
  CLEAN_TIME_SHEETS,
  UPLOAD_REPORTS_TEMPLATE,
  DOWNLOAD_REPORT_TEMPLATE,
  UPLOAD_TIME_SHEET_TEMPLATE,
  DOWNLOAD_TIME_SHEET_TEMPLATE,
  CREATE_ROOT_FOLDER,
  DELETE_ROOT_FOLDER
}

export enum OperationStatus {
  INIT,
  START,
  STOP,
  END
}

export interface AppStatus {
  operation: Operation,
  operationStatus: OperationStatus;
}

@Injectable({
  providedIn: 'root'
})
export class ProcessingStatusService {
  private _appStatus = new BehaviorSubject<AppStatus>({ operation: Operation.INIT, operationStatus: OperationStatus.INIT })

  constructor() { }

  public get appStatus(): Observable<AppStatus> {
    return this._appStatus.asObservable();
  }

  public set appStatus(appStatus: AppStatus) {
    this._appStatus.next(appStatus);
  }
}
