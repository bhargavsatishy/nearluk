import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyRoutingModule } from './property-routing.module';
import { ContactAgentComponent } from './contact-agent/contact-agent.component';
import { BiddingComponent } from './bidding/bidding.component';
import { PropertysComponent } from './propertys/propertys.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { CompareComponent } from './compare/compare.component';
import { AgmCoreModule } from '@agm/core';
import { KeyFilterModule } from 'primeng/keyfilter';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from 'primeng/fileupload';
import { MypropertyComponent } from './myproperty/myproperty.component';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { MatStepperModule } from '@angular/material/stepper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { UpdatepropertyComponent } from './updateproperty/updateproperty.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { GetareabycityComponent } from './getareabycity/getareabycity.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ViewpropertyComponent } from './viewproperty/viewproperty.component';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [ContactAgentComponent, BiddingComponent, PropertysComponent, FavouritesComponent, CompareComponent, MypropertyComponent, UpdatepropertyComponent, GetareabycityComponent, ViewpropertyComponent],
  imports: [
    CommonModule,
    PropertyRoutingModule,
    FormsModule, KeyFilterModule, AgmCoreModule, GooglePlaceModule, HttpClientModule, FileUploadModule, MatStepperModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, DialogModule, InputSwitchModule, InfiniteScrollModule, MatProgressSpinnerModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDm77E42SA0rbXGp__BAtdnxJRxad1gdjw',
      // libraries: ['geometry']
    }), CalendarModule,
  ],
  exports: [ContactAgentComponent, BiddingComponent, PropertysComponent, FavouritesComponent, CompareComponent, MypropertyComponent, GetareabycityComponent]
})
export class PropertyModule { }
