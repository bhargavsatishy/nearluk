import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationComponent } from './notification/notification.component';
import { DialogModule } from 'primeng/dialog';
@NgModule({
  declarations: [NotificationComponent],
  imports: [
    CommonModule,
    NotificationsRoutingModule, DialogModule
  ],
  exports: [NotificationComponent]
})
export class NotificationsModule { }
