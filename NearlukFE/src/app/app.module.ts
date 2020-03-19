import { FooterRoutingModule } from './footer/footer-routing.module';
import { FooterModule } from './footer/footer.module';

import { NotificationsRoutingModule } from './notifications/notifications-routing.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PropertyRoutingModule } from './property/property-routing.module';
import { LoginRoutingModule } from './login/login-routing.module';
import { AdminRoutingModule } from './admin/admin-routing.module';
import { AdminModule } from './admin/admin.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FaqsComponent } from './faqs/faqs.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ContactusComponent } from './contactus/contactus.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MoredetailsComponent } from './moredetails/moredetails.component';
import { LoginModule } from './login/login.module';
import { PropertyModule } from './property/property.module';
import { UserprofileModule } from './userprofile/userprofile.module';
import { UserprofileRoutingModule } from './userprofile/userprofile-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NearlukService } from './services/nearluk.service';
import { AgmCoreModule } from '@agm/core';
import { GalleriaModule } from 'primeng/galleria';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect'
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
// import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { RatingModule } from 'primeng/rating';
import { AccordionModule } from 'primeng/accordion';
import { GMapsService } from './services/gmaps.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { ShareButtonsModule } from '@ngx-share/buttons';
// import { ShareButtonsConfig } from '@ngx-share/core';
import { SearchComponent } from './search/search.component';
import { PropertybycityComponent } from './propertybycity/propertybycity.component';
import { SearchbyallComponent } from './searchbyall/searchbyall.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { KeyFilterModule } from 'primeng/keyfilter';

import { CarouselModule } from 'primeng/carousel';
import { FuturepropertyComponent } from './futureproperty/futureproperty.component';
import { FooterMainComponent } from './footer-main/footer-main.component';
import { SearchMainComponent } from './search-main/search-main.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ChatComponent } from './chat/chat.component';
import { ImageCompressService, ResizeOptions, ImageUtilityService } from 'ng2-image-compress';

const customConfig = {

  theme: 'modern-light',
  autoSetMeta: false,
  url: 'http://localhost:4200/login',
  gaTracking: true,
  facebook: {
    icon: ['fab', 'fa fa-faceb<i class="fab fa-facebook-f"></i>ook'],
    text: 'Share'
  },
  twitter: {
    icon: ['fab', 'fa-twitter-square'],
    text: 'Tweet'
  }
}




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FaqsComponent,
    AboutusComponent,
    ContactusComponent,
    PageNotFoundComponent,
    MoredetailsComponent,
    SearchComponent,
    PropertybycityComponent,
    SearchbyallComponent,
    FuturepropertyComponent,
    FooterMainComponent,
    SearchMainComponent,
    ChatComponent,


  ],
  imports: [
    BrowserModule, NgIdleKeepaliveModule.forRoot(), CarouselModule, InfiniteScrollModule, KeyFilterModule, MatTabsModule,
    AppRoutingModule, AdminModule, AdminRoutingModule, DialogModule,
    LoginModule, LoginRoutingModule, UserprofileModule, UserprofileRoutingModule, FooterModule, FooterRoutingModule
    , PropertyModule, PropertyRoutingModule, NotificationsModule, MatProgressSpinnerModule,
    NotificationsRoutingModule, FormsModule, HttpClientModule, AgmCoreModule, GalleriaModule, MultiSelectModule, DropdownModule, AutoCompleteModule
    , RatingModule, AccordionModule, BrowserAnimationsModule, ShareButtonsModule.withConfig(
      customConfig

    ),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true
    }),
  ],
  providers: [NearlukService, GMapsService, ImageCompressService, ResizeOptions],
  bootstrap: [AppComponent]
})
export class AppModule { }
