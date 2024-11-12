import { Component, Input, OnInit } from '@angular/core';
import { ConverterStrutureService, StrutureStatus } from '../../services/converter-struture/converter-struture.service';
import { Operation, OperationStatus, ProcessingStatusService } from '../../services/processing-status/processing-status.service';

@Component({
  selector: 'app-structure',
  templateUrl: './structure.component.html',
  styleUrl: './structure.component.css'
})
export class StructureComponent implements OnInit {

  @Input() public userId: string = '';
  public rootFolderID: string = '';

  public disableCreateButton: boolean = true;
  public disableDeleteButton: boolean = true;
  public disableAllButtons: boolean = false;

  public structureMessage: string = '';

  constructor(private structure: ConverterStrutureService, private appStatus: ProcessingStatusService) { }

  ngOnInit(): void {
    this.structure.getRootFolderId(this.userId)
      .subscribe({
        next: (response) => {
          if (response.status == StrutureStatus.CREATED) {
            this.disableCreateButton = true;
            this.disableDeleteButton = false;
            this.rootFolderID = response.rootFolderId;
            this.structureMessage = 'Structure has already created';
          } else {
            this.disableCreateButton = false;
            this.disableDeleteButton = true;
            this.structureMessage = 'Create structure first please';
          }
        },
        error: (error) => {
          if (error.strutureStatus == StrutureStatus.DELETED) {
            this.disableCreateButton = false;
            this.disableDeleteButton = true;
            this.structureMessage = 'Create structure first please';
          } else {
            this.disableCreateButton = true;
            this.disableDeleteButton = true;
            this.structureMessage  = 'Something wrong with server or connection wait please'
          }
        }
      });

      this.appStatus.appStatus.subscribe(appStatus => {
        switch(appStatus.operationStatus) {
          case OperationStatus.START:
            this.disableAllButtons = true;
            break;
          case OperationStatus.END:
            this.disableAllButtons = false;
        }
      });
  }

  onCreateRootFolder(): void {
    this.appStatus.appStatus = {operation: Operation.CREATE_ROOT_FOLDER, operationStatus: OperationStatus.START};
    this.structure.createRootFolder(this.userId).subscribe({
      next: (response) => {
        this.disableCreateButton = true;
        this.disableDeleteButton = false;
        this.rootFolderID = response.message;
        this.structureMessage = `Structure was created the root folder Id is ${this.rootFolderID}`;
        this.appStatus.appStatus = {operation: Operation.CREATE_ROOT_FOLDER, operationStatus: OperationStatus.END};
      },
      error: (error) => {
        this.structureMessage = error.structureMessage;
      }
    });
  }

  onDeleteRootFolder(): void {
    this.appStatus.appStatus = {operation: Operation.DELETE_ROOT_FOLDER, operationStatus: OperationStatus.START};
    this.structure.deleteRootFolder(this.userId).subscribe({
      next: () => {
        this.disableDeleteButton = true;
        this.disableCreateButton = false;
        this.rootFolderID = '';
        this.structureMessage = 'Structure was deleted. Create structure first please';
        this.appStatus.appStatus = {operation: Operation.DELETE_ROOT_FOLDER, operationStatus: OperationStatus.END};
      },
      error: (error) => {
        this.rootFolderID = '';
        this.structureMessage = error.structureMessage;
      }
    });
  }

}
