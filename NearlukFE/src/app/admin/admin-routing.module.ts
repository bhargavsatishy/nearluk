import { ContactusdetailsComponent } from './contactusdetails/contactusdetails.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminhomeComponent } from './adminhome/adminhome.component';
import { AdminserviceService as AuthGuard } from '../services/adminservice.service';


const routes: Routes = [
  { path: 'adminhome', component: AdminhomeComponent,canActivate: [AuthGuard]
},
  { path: 'admincontactus', component: ContactusdetailsComponent,canActivate: [AuthGuard]
},

];

@NgModule({
  imports: [RouterModule.forChild(routes),],
  exports: [RouterModule],
  providers: [
    AuthGuard
  ],
})
export class AdminRoutingModule { }
