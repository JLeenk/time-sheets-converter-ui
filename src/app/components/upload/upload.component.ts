import { Component, Input, OnInit } from '@angular/core';
import { FileLoadStatus, TimeSheetStatus, UploadService } from '../../services/upload/upload.service';
import { DownloadService } from '../../services/download/download.service';

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

  constructor(private uploadService: UploadService, private downloadService: DownloadService) { }

  ngOnInit(): void {
    this.uploadService.getFileStatus().subscribe((statuses) => {
      this.timeSheetStatus = statuses.timeSheetStatus
      if(statuses.wholeStatus == FileLoadStatus.COMPLETED) {
        this.timeSheetsDisabled = true;
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
      this.uploadService.uploadTimeSheetTemplateFile(this.userId, this.timeSheetTemplate).subscribe({
        next: (progress) => {
          if (typeof progress === 'number') {
            this.timeSheetTemplateMessage = FileLoadStatus.INPROCESS;
            this.timeSheetTemplateDisabled = true;
            this.disableAllButtons = true;
          } else {
            this.timeSheetTemplateMessage = FileLoadStatus.LOADED;
            this.timeSheetTemplateDisabled = false;
            this.disableAllButtons = false;
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
    const fileName = 'Time Sheet Template.xlsx';
    this.downloadService.downloadTimeSheetTemplateFile(this.userId).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
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
      this.uploadService.uploadReportTemplateFile(this.userId, this.reportTemplate).subscribe({
        next: (progress) => {
          if (typeof progress === 'number') {
            this.reportTemplateMessage = FileLoadStatus.INPROCESS;
            this.reportTemplateDisabled = true;
            this.disableAllButtons = true;
          } else {
            this.reportTemplateMessage = FileLoadStatus.LOADED;
            this.reportTemplateDisabled = false;
            this.disableAllButtons = false;
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
    this.downloadService.downloadReportTemplateFile(this.userId).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
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
    this.uploadService.uploadTimeSheetFiles(this.userId, this.selectedFiles);
  }

  public onDeleteAllTimeSheetsFiles(): void {
    this.disableAllButtons = true;
    this.deleteTimeSheetsMessage = FileLoadStatus.INPROCESS;
    this.uploadService.deleteAllTimeSheets(this.userId).subscribe({
      next: () => {
        this.deleteTimeSheetsMessage = FileLoadStatus.COMPLETED;
        this.disableAllButtons = false;
        },
      error: () => {
        this.deleteTimeSheetsMessage = 'Deletion failed';
      }
    });
  }
}
