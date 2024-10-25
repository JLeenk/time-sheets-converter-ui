import { Component, OnInit } from '@angular/core';
import { ManagerService } from '../../services/manager/manager.service';
import { FileLoadStatus, FileStatus, GenerateReportsStatus, RootFolderIdResp, RootFolderIdStatus, UploadFileService } from '../../services/manager/upload-file.service';
import { TimeSheetLoadStatus, TimeSheetsService, TimeSheetStatus } from '../../services/manager/time-sheets.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'manager',
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.css'
})
export class ManagerComponent implements OnInit {

  userId: string = '';



  timeSheetStatus: TimeSheetStatus[] = [];
  selectedFiles: File[] = [];
  timeSheetTemplate: File | null = null;
  reportTemplateTemplate: File | null = null;
  timeSheetTemplateMessage: string = '';
  reportTemplateMessage: string = '';
  deleteTimeSheetsMessage: string = '';
  generateReportsMessage = '';
  deleteReportsMessage = '';
  rootFolderIdResp: RootFolderIdResp = {folderId: '', folderIdMessage: '', status: RootFolderIdStatus.INIT};
  createRootFolderMessage = '';

  constructor(
    private service: ManagerService, 
    private uploadFileService: UploadFileService,
    private timeSheetsService: TimeSheetsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.timeSheetsService.getFileStatus().subscribe((statuses) => this.timeSheetStatus = statuses);

    this.uploadFileService.getRootFolderId().subscribe((resp) => {
      this.rootFolderIdResp = resp;
    });

    this.uploadFileService.getGenerateReportsStatus().subscribe((status) => {
      this.generateReportsMessage = status;
    })

    this.route.queryParams.subscribe(params => {
      this.userId = params['token'];
      this.checkRootFolderId();
    });
  }

  private timeoutId: any;

  checkRootFolderId() {
    this.uploadFileService.getRootFolderIdReq(this.userId);
  }

  createButtonCheck(): boolean {
    let statusResp: RootFolderIdStatus = this.rootFolderIdResp.status
    return statusResp == RootFolderIdStatus.INIT || statusResp == RootFolderIdStatus.CREATED || statusResp == RootFolderIdStatus.ERROR
  }

  createRootFolder() {
    if (this.userId.length) {
      this.service.createRootFolder(this.userId).subscribe({
        next: (id) => {
          this.rootFolderIdResp = { folderId: id, folderIdMessage: 'Root folder Created', status: RootFolderIdStatus.CREATED };
        },
        error: (error) => {
          this.rootFolderIdResp = { folderId: 'error', folderIdMessage: 'Try to login againe', status: RootFolderIdStatus.ERROR };
        }
      });
    }
  }

  deleteRootFolder() {
    if (this.userId.length) {
      this.service.deleteRootFolder(this.userId).subscribe(
        {
          next: (id) => {
            this.rootFolderIdResp = { folderId: id, folderIdMessage: 'Root folder Deleted', status: RootFolderIdStatus.DELETED };
          },
          error: (error) => {
            this.createRootFolderMessage = 'Root folder deletion faild';
            this.uploadFileService.getRootFolderIdReq(this.userId);
          }
        }
      );
    }
  }

  onDownloadTimeSheetTemplate() {
    const fileName = 'Time Sheet Template.xlsx'; // Specify the file you want to download
    this.service.downloadTimeSheetTemplateFile(this.userId).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  onDownloadReportTemplate() {
    const fileName = 'Report Template.xlsx'; // Specify the file you want to download
    this.service.downloadReportTemplateFile(this.userId).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  onTimeSheetTemplateSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.timeSheetTemplate = input.files[0];
      if (this.timeSheetTemplate) {
        this.timeSheetTemplateMessage = FileLoadStatus.READY;
      } else {
        this.timeSheetTemplateMessage = '';
      }
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
      // Initialize status for selected files
      this.timeSheetStatus = this.selectedFiles.map(file => ({ name: file.name, status: TimeSheetLoadStatus.READY }));
    }
  }

  onUploadTimeSheetsFiles(): void {
    this.timeSheetsService.loadTimeSheetFiles(this.userId, this.selectedFiles);
  }



  onDeleteAllTimeSheetsFiles(): void {
    if (this.userId) {
      this.timeSheetStatus = [];
      this.deleteTimeSheetsMessage = GenerateReportsStatus.INPROCESS;
      this.uploadFileService.deleteAllTimeSheets(this.userId).subscribe({
        next: () => {
          this.deleteTimeSheetsMessage = GenerateReportsStatus.COMPLETED
        },
        error: (error) => {
          this.deleteTimeSheetsMessage = `Deletion failed: ${error.message}`;
        }
      });
    } else {
      this.deleteTimeSheetsMessage = 'input email';
    }

  }

  onUploadTimeSheetTemplate(): void {
    if (this.timeSheetTemplate) {
      this.service.uploadTimeSheetTemplateFile(this.userId, this.timeSheetTemplate).subscribe({
        next: (progress) => {
          if (typeof progress === 'number') {
            this.timeSheetTemplateMessage = FileLoadStatus.INPROCESS;
          } else {
            this.timeSheetTemplateMessage = FileLoadStatus.LOADED;
          }
        },
        error: (err) => {
          console.error('Upload Error:', err);
          this.timeSheetTemplateMessage = FileLoadStatus.ERROR;
        }
      });
    }
  }

  onUploadReporTemplate(): void {
    if (this.reportTemplateTemplate) {
      this.service.uploadReportTemplateFile(this.userId, this.reportTemplateTemplate).subscribe({
        next: (progress) => {
          if (typeof progress === 'number') {
            this.reportTemplateMessage = FileLoadStatus.INPROCESS;
          } else {
            this.reportTemplateMessage = FileLoadStatus.LOADED;
          }
        },
        error: (err) => {
          console.error('Upload Error:', err);
          this.timeSheetTemplateMessage = FileLoadStatus.ERROR;
        }
      });
    }
  }

  onReportTemplateSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.reportTemplateTemplate = input.files[0];

      if (this.reportTemplateTemplate) {
        this.reportTemplateMessage = FileLoadStatus.READY;
      } else {
        this.reportTemplateMessage = '';
      }
    }
  }

  onGenerateReports(): void {
    if (this.userId) {
      this.generateReportsMessage = GenerateReportsStatus.INPROCESS;
      this.service.generateReports(this.userId).subscribe({
        next: (progress) => {
          this.uploadFileService.checkGenerateReportsStatus(this.userId);
        },
        error: (err) => {
          if (err.status == 503) {
            this.generateReportsMessage = "Server busy please wait until Reports will be generated"
          } else {
            console.error('Upload Error:', err);
            this.generateReportsMessage = FileLoadStatus.ERROR;
          }
        }
      });
    }
  }
}
