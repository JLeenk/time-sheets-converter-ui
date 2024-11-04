import { Component, OnInit } from '@angular/core';
import { ManagerService } from '../../services/manager/manager.service';
import { FileLoadStatus, GenerateReportsStatus, RootFolderIdResp, RootFolderIdStatus, UploadFileService } from '../../services/manager/upload-file.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'manager',
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.css'
})
export class ManagerComponent implements OnInit {

  userId: string = '';

  generateReportsMessage = '';
  deleteReportsMessage = '';
  rootFolderIdResp: RootFolderIdResp = {folderId: '', folderIdMessage: '', status: RootFolderIdStatus.INIT};
  createRootFolderMessage = '';

  constructor(
    private service: ManagerService, 
    private uploadFileService: UploadFileService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.uploadFileService.getGenerateReportsStatus().subscribe((status) => {
      this.generateReportsMessage = status;
    })

    this.route.queryParams.subscribe(params => {
      this.userId = params['token'];
    });
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
