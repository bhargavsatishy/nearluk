import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotificationComponent } from './notification/notification.component';
import { AuthenticateService as AuthGuard } from '../services/authenticate.service';

const routes: Routes = [{path:'notification', component:NotificationComponent,canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuard
  ],
})
export class NotificationsRoutingModule { }
