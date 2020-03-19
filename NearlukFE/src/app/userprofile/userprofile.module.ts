import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserprofileRoutingModule } from './userprofile-routing.module';
import { MyOwnersComponent } from './my-owners/my-owners.component';
import { RegistrationComponent } from './registration/registration.component';
import { ProfileComponent } from './profile/profile.component';
import { MyagentsComponent } from './myagents/myagents.component';
import { NearuComponent } from './nearu/nearu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AgmCoreModule } from '@agm/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EnquiryComponent } from './enquiry/enquiry.component';
import { RecommendationComponent } from './recommendation/recommendation.component';
import { VerifyComponent } from './verify/verify.component';
import { KeyFilterModule } from 'primeng/keyfilter';



@NgModule({
  declarations: [MyOwnersComponent, RegistrationComponent, ProfileComponent, MyagentsComponent, NearuComponent, EnquiryComponent, RecommendationComponent, VerifyComponent],
  imports: [
    CommonModule, DialogModule, FormsModule, BrowserAnimationsModule, NgxSpinnerModule, KeyFilterModule,
    UserprofileRoutingModule, FileUploadModule, InfiniteScrollModule, AgmCoreModule, MatProgressSpinnerModule
    , MatDatepickerModule],
  exports: [MyOwnersComponent, RegistrationComponent, ProfileComponent, MyagentsComponent, NearuComponent]
})
export class UserprofileModule { }
