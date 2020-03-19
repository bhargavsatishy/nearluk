import { UpdatepropertyComponent } from './updateproperty/updateproperty.component';
import { MypropertyComponent } from './myproperty/myproperty.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { ContactAgentComponent } from './contact-agent/contact-agent.component';
import { BiddingComponent } from './bidding/bidding.component';

import { CompareComponent } from './compare/compare.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PropertysComponent } from './propertys/propertys.component';
import { GetareabycityComponent } from './getareabycity/getareabycity.component';
import { ViewpropertyComponent } from './viewproperty/viewproperty.component';
import { AuthenticateService as AuthGuard } from '../services/authenticate.service';

const routes: Routes = [
  { path: 'bidding', component: BiddingComponent ,canActivate: [AuthGuard]},
  { path: 'compare', component: CompareComponent },
  { path: 'contactagent/:propertyid', component: ContactAgentComponent ,canActivate: [AuthGuard]},
  { path: 'favourites', component: FavouritesComponent,canActivate: [AuthGuard] },
  { path: 'property', component: PropertysComponent ,canActivate: [AuthGuard]},
  { path: 'myproperty', component: MypropertyComponent,canActivate: [AuthGuard] },
  { path: 'updateproperty/:id', component: UpdatepropertyComponent ,canActivate: [AuthGuard]},
  { path: 'getareabycity/:id', component: GetareabycityComponent },
  { path: 'viewproperty/:type', component: ViewpropertyComponent }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuard
  ],
})
export class PropertyRoutingModule { }
