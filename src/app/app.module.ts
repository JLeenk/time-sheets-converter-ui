import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OauthComponent } from './components/oauth/oauth.component';
import { FailureComponent } from './components/failure/failure.component';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ManagerComponent } from './components/manager/manager.component';
import { StructureComponent } from './components/structure/structure.component';
import { UploadComponent } from './components/upload/upload.component';
import { ReportsComponent } from './components/reports/reports/reports.component';

@NgModule({
  declarations: [
    AppComponent,
    OauthComponent,
    FailureComponent,
    ManagerComponent,
    StructureComponent,
    UploadComponent,
    ReportsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
