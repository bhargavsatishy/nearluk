import { RegistrationComponent } from './registration/registration.component';
import { ProfileComponent } from './profile/profile.component';
import { NearuComponent } from './nearu/nearu.component';
import { MyagentsComponent } from './myagents/myagents.component';
import { MyOwnersComponent } from './my-owners/my-owners.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnquiryComponent } from './enquiry/enquiry.component';
import { RecommendationComponent } from './recommendation/recommendation.component';
import { VerifyComponent } from './verify/verify.component';
import { AuthenticateService as AuthGuard } from '../services/authenticate.service';


const routes: Routes = [
  { path: 'myowner', component: MyOwnersComponent, canActivate: [AuthGuard] },
  { path: 'myagent', component: MyagentsComponent, canActivate: [AuthGuard] },
  { path: 'nearu', component: NearuComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'registration', component: RegistrationComponent },
  { path: 'enquiry', component: EnquiryComponent, canActivate: [AuthGuard] },
  { path: 'recommendation', component: RecommendationComponent, canActivate: [AuthGuard] },
  { path: 'verify/:sessionid', component: VerifyComponent }
];

@NgModule({

  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuard
  ],
})
export class UserprofileRoutingModule { }
