import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FailureComponent } from './components/failure/failure.component';
import { OauthComponent } from './components/oauth/oauth.component';
import { ManagerComponent } from './components/manager/manager.component';

const routes: Routes = [
  {path: '', component: OauthComponent},
  {path: 'manager', component: ManagerComponent},
  {path: 'failure', component: FailureComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
