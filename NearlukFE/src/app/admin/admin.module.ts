import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminhomeComponent } from './adminhome/adminhome.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ContactusdetailsComponent } from './contactusdetails/contactusdetails.component';
import { AdminnotificationComponent } from './adminnotification/adminnotification.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
  declarations: [AdminhomeComponent, ContactusdetailsComponent, AdminnotificationComponent],
  imports: [
    CommonModule,
    AdminRoutingModule, InputSwitchModule, DialogModule, FormsModule,InfiniteScrollModule
  ]
})
export class AdminModule { }
