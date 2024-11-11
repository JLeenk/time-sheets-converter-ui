import { Component, Input, OnInit } from '@angular/core';
import { GenerateReportsStatus, ReportsService } from '../../../services/reports/reports.service';
import { Operation, OperationStatus, ProcessingStatusService } from '../../../services/processing-status/processing-status.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {

  @Input() public userId: string = '';
  public generateReportsMessage: string = '';

  public disableGenerateReportButton: boolean = false;

  constructor(private service: ReportsService, private appStatus: ProcessingStatusService) { }

  ngOnInit(): void {
    this.service.generateReportsStatus.subscribe(reportStatus => {
      if(reportStatus == GenerateReportsStatus.COMPLETED) {
        this.disableGenerateReportButton = false;
        this.appStatus.appStatus = {operation: Operation.GENERATE_REPORT, operationStatus: OperationStatus.END};
      }
      this.generateReportsMessage = reportStatus;
    });

    this.appStatus.appStatus.subscribe(appStatus => {
      switch(appStatus.operationStatus) {
        case OperationStatus.START:
          this.disableGenerateReportButton = true;
          break;
        case OperationStatus.END:
          this.disableGenerateReportButton = false;
      }
    });
  }

  onGenerateReports(): void {
    if (this.userId) {
      this.generateReportsMessage = GenerateReportsStatus.INPROCESS;
      this.disableGenerateReportButton = true;
      this.appStatus.appStatus = {operation: Operation.GENERATE_REPORT, operationStatus: OperationStatus.START};
      this.service.generateReports(this.userId).subscribe({
        next: () => {
          this.service.checkGenerateReportsStatus(this.userId);
        },
        error: (err) => {
          if (err.status == 503) {
            this.generateReportsMessage = "Server busy please wait until Reports will be generated"
          } else {
            console.error('Upload Error:', err);
            this.generateReportsMessage = `${GenerateReportsStatus.ERROR}. It could be that the program reached its resource limits, causing the cloud system to reboot. Please wait a few minutes, reauthenticate, and try generating the reports again.`;
          }
        }
      });
    }
  }

}
