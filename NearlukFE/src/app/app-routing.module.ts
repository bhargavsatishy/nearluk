import { FooterRoutingModule } from './footer/footer-routing.module';
import { FooterModule } from './footer/footer.module';
import { SearchbyallComponent } from './searchbyall/searchbyall.component';
import { PropertyModule } from './property/property.module';
import { AdminModule } from './admin/admin.module';
import { AdminRoutingModule } from './admin/admin-routing.module';
import { UserprofileModule } from './userprofile/userprofile.module';
import { NotificationsRoutingModule } from './notifications/notifications-routing.module';
import { LoginModule } from './login/login.module';
import { LoginRoutingModule } from './login/login-routing.module';
import { UserprofileRoutingModule } from './userprofile/userprofile-routing.module';
import { PropertyRoutingModule } from './property/property-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FaqsComponent } from './faqs/faqs.component';
import { ContactusComponent } from './contactus/contactus.component';
import { MoredetailsComponent } from './moredetails/moredetails.component';
import { HomeComponent } from './home/home.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotificationsModule } from './notifications/notifications.module';
import { SearchComponent } from './search/search.component';
import { PropertybycityComponent } from './propertybycity/propertybycity.component';
import { FuturepropertyComponent } from './futureproperty/futureproperty.component';
import { ChatComponent } from './chat/chat.component';

import { AuthenticateService as AuthGuard } from './services/authenticate.service';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'moredetails/:propertyid', component: MoredetailsComponent },
  { path: 'contactus', component: ContactusComponent },
  { path: 'faqs', component: FaqsComponent },
  { path: 'aboutus', component: AboutusComponent },
  { path: 'search', component: SearchComponent },
  { path: 'propertybycity/:cid', component: PropertybycityComponent },
  { path: 'searchbyall/:sid', component: SearchbyallComponent },
  { path: 'featured/:id', component: FuturepropertyComponent },
  { path: 'chat/:userid/:propertid', component: ChatComponent, canActivate: [AuthGuard] },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },



  { path: '**', component: PageNotFoundComponent },

];


@NgModule({
  imports: [RouterModule.forRoot(routes), PropertyRoutingModule, PropertyModule, UserprofileRoutingModule, UserprofileModule, LoginRoutingModule, LoginModule, NotificationsModule, NotificationsRoutingModule, AdminRoutingModule, AdminModule, FooterModule, FooterRoutingModule],
  exports: [RouterModule],
  providers: [
    AuthGuard
  ],
})



export class AppRoutingModule { }
