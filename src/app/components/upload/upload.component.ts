import { Component, Input, OnInit } from '@angular/core';
import { FileLoadStatus, TimeSheetStatus, UploadService } from '../../services/upload/upload.service';
import { DownloadService } from '../../services/download/download.service';
import { Operation, OperationStatus, ProcessingStatusService } from '../../services/processing-status/processing-status.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent implements OnInit {

  @Input() public userId: string = '';

  public disableAllButtons = false;

  public timeSheetTemplateDisabled: boolean = true;
  public timeSheetTemplate: File | null = null;
  public timeSheetTemplateMessage: string = '';

  public reportTemplateDisabled: boolean = true;
  public reportTemplate: File | null = null;
  public reportTemplateMessage: string = '';

  public timeSheetsDisabled: boolean = true;
  public selectedFiles: File[] = [];
  public deleteTimeSheetsMessage: string = '';
  timeSheetStatus: TimeSheetStatus[] = [];

  constructor(private uploadService: UploadService, private downloadService: DownloadService, private appStatus: ProcessingStatusService) { }

  ngOnInit(): void {
    this.uploadService.getFileStatus().subscribe((statuses) => {
      this.timeSheetStatus = statuses.timeSheetStatus
      if (statuses.wholeStatus == FileLoadStatus.COMPLETED) {
        this.timeSheetsDisabled = true;
        this.disableAllButtons = false;
        this.appStatus.appStatus = { operation: Operation.UPLOAD_TIME_SHEETS, operationStatus: OperationStatus.END };
      }
    });

    this.appStatus.appStatus.subscribe(appStatus => {
      switch (appStatus.operationStatus) {
        case OperationStatus.START:
          this.disableAllButtons = true;
          break;
        case OperationStatus.END:
          this.disableAllButtons = false;
      }
    });
  }

  public onTimeSheetTemplateSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.timeSheetTemplate = input.files[0];
      if (this.timeSheetTemplate) {
        this.timeSheetTemplateMessage = FileLoadStatus.READY;
        this.timeSheetTemplateDisabled = false;
      } else {
        this.timeSheetTemplateMessage = '';
        this.timeSheetTemplateDisabled = true;
      }
    }
  }

  public onUploadTimeSheetTemplate(): void {
    if (this.timeSheetTemplate) {
      this.appStatus.appStatus = { operation: Operation.UPLOAD_TIME_SHEET_TEMPLATE, operationStatus: OperationStatus.START };
      this.uploadService.uploadTimeSheetTemplateFile(this.userId, this.timeSheetTemplate).subscribe({
        next: (progress) => {
          if (progress) {
            this.timeSheetTemplateMessage = FileLoadStatus.INPROCESS;
            this.timeSheetTemplateDisabled = true;
            this.disableAllButtons = true;
          } else {
            this.timeSheetTemplateMessage = FileLoadStatus.LOADED;
            this.timeSheetTemplateDisabled = false;
            this.disableAllButtons = false;
            this.appStatus.appStatus = { operation: Operation.UPLOAD_TIME_SHEET_TEMPLATE, operationStatus: OperationStatus.END };
          }
        },
        error: (err) => {
          console.error('Upload Error:', err);
          this.timeSheetTemplateMessage = FileLoadStatus.ERROR;
        }
      });
    }
  }

  public onDownloadTimeSheetTemplate(): void {
    this.appStatus.appStatus = { operation: Operation.DOWNLOAD_TIME_SHEET_TEMPLATE, operationStatus: OperationStatus.START };
    const fileName = 'Time Sheet Template.xlsx';
    this.downloadService.downloadTimeSheetTemplateFile(this.userId).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      this.appStatus.appStatus = { operation: Operation.DOWNLOAD_TIME_SHEET_TEMPLATE, operationStatus: OperationStatus.END };
    });
  }

  public onReportTemplateSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.reportTemplate = input.files[0];
      if (this.reportTemplate) {
        this.reportTemplateMessage = FileLoadStatus.READY;
        this.reportTemplateDisabled = false;
      } else {
        this.reportTemplateMessage = '';
        this.reportTemplateDisabled = true;
      }
    }
  }

  public onUploadReporTemplate(): void {
    if (this.reportTemplate) {
      this.appStatus.appStatus = { operation: Operation.UPLOAD_REPORTS_TEMPLATE, operationStatus: OperationStatus.START };
      this.uploadService.uploadReportTemplateFile(this.userId, this.reportTemplate).subscribe({
        next: (progress) => {
          if (progress) {
            this.reportTemplateMessage = FileLoadStatus.INPROCESS;
            this.reportTemplateDisabled = true;
            this.disableAllButtons = true;
          } else {
            this.reportTemplateMessage = FileLoadStatus.LOADED;
            this.reportTemplateDisabled = false;
            this.disableAllButtons = false;
            this.appStatus.appStatus = { operation: Operation.UPLOAD_REPORTS_TEMPLATE, operationStatus: OperationStatus.END };
          }
        },
        error: (err) => {
          console.error('Upload Error:', err);
          this.reportTemplateMessage = FileLoadStatus.ERROR;
        }
      });
    }
  }

  public onDownloadReportTemplate(): void {
    const fileName = 'Report Template.xlsx';
    this.appStatus.appStatus = { operation: Operation.DOWNLOAD_REPORT_TEMPLATE, operationStatus: OperationStatus.START };
    this.downloadService.downloadReportTemplateFile(this.userId).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      this.appStatus.appStatus = { operation: Operation.DOWNLOAD_REPORT_TEMPLATE, operationStatus: OperationStatus.END };
    });
  }

  public onFileSelected(event: Event): void {
    this.deleteTimeSheetsMessage = '';
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFiles = Array.from(input.files);
      // Initialize status for selected files
      this.timeSheetStatus = this.selectedFiles.map(file => ({ name: file.name, status: FileLoadStatus.READY }));
      this.timeSheetsDisabled = false;
      this.timeSheetsDisabled = false;
      this.deleteTimeSheetsMessage = '';
    } else {
      this.timeSheetsDisabled = true;
      this.selectedFiles = [];
      this.timeSheetStatus = [];
      this.deleteTimeSheetsMessage = '';
    }
  }

  public onUploadTimeSheetsFiles(): void {
    this.deleteTimeSheetsMessage = '';
    this.disableAllButtons = true;
    this.appStatus.appStatus = { operation: Operation.UPLOAD_TIME_SHEETS, operationStatus: OperationStatus.START };
    this.uploadService.uploadTimeSheetFiles(this.userId, this.selectedFiles);
  }

  public onDeleteAllTimeSheetsFiles(): void {
    this.disableAllButtons = true;
    this.deleteTimeSheetsMessage = FileLoadStatus.INPROCESS;
    this.appStatus.appStatus = { operation: Operation.CLEAN_TIME_SHEETS, operationStatus: OperationStatus.START };
    this.uploadService.deleteAllTimeSheets(this.userId).subscribe({
      next: () => {
        this.deleteTimeSheetsMessage = FileLoadStatus.COMPLETED;
        this.disableAllButtons = false;
        this.appStatus.appStatus = { operation: Operation.CLEAN_TIME_SHEETS, operationStatus: OperationStatus.END };
      },
      error: () => {
        this.deleteTimeSheetsMessage = 'Deletion failed';
      }
    });
  }
}
