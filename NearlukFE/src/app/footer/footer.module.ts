import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FooterRoutingModule } from './footer-routing.module';
import { TermsComponent } from './terms/terms.component';
import { AgentsComponent } from './agents/agents.component';
import { WorkWithUsComponent } from './work-with-us/work-with-us.component';
import { PressComponent } from './press/press.component';
import { HouseOwnersComponent } from './house-owners/house-owners.component';
import { LargeOrganizationsComponent } from './large-organizations/large-organizations.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdvertiseComponent } from './advertise/advertise.component';
import { TabViewModule } from 'primeng/tabview';
import { TenantComponent } from './tenant/tenant.component';

@NgModule({
  declarations: [TermsComponent, AgentsComponent, WorkWithUsComponent, PressComponent, HouseOwnersComponent, LargeOrganizationsComponent, PrivacyPolicyComponent, AdvertiseComponent, TenantComponent ],
  imports: [
    CommonModule,
    FooterRoutingModule, FormsModule, BrowserAnimationsModule,TabViewModule,
  ],
  exports: [TermsComponent, AgentsComponent, WorkWithUsComponent, PressComponent, HouseOwnersComponent, LargeOrganizationsComponent, PrivacyPolicyComponent,AdvertiseComponent,TenantComponent]
})
export class FooterModule { }
