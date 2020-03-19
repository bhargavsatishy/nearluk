import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TermsComponent } from './terms/terms.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { AdvertiseComponent } from './advertise/advertise.component';
import { PressComponent } from './press/press.component';
import { AgentsComponent } from './agents/agents.component';
import { WorkWithUsComponent } from './work-with-us/work-with-us.component';
import { LargeOrganizationsComponent } from './large-organizations/large-organizations.component';
import { HouseOwnersComponent } from './house-owners/house-owners.component';
import { TenantComponent } from './tenant/tenant.component';

const routes: Routes = [
  {path:'terms', component: TermsComponent },
  {path:'privacy', component: PrivacyPolicyComponent },
  {path:'advertise', component: AdvertiseComponent },
  {path:'work', component: WorkWithUsComponent },
  {path:'agents', component: AgentsComponent },
  {path:'press', component: PressComponent },
  {path:'organization', component: LargeOrganizationsComponent },
  {path:'houseowner', component: HouseOwnersComponent },
  {path:'tenant', component: TenantComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FooterRoutingModule { }
