import { GMapsService } from './../../services/gmaps.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { NearlukService } from 'src/app/services/nearluk.service';

@Component({
  selector: 'app-getareabycity',
  templateUrl: './getareabycity.component.html',
  styleUrls: ['./getareabycity.component.css']
})
export class GetareabycityComponent implements OnInit {


  latt: number;
  lngg: number;
  propertyList: any;
  // showPopup: boolean;
  // pid1: any;
  // display: boolean;
  constructor(private nearlukservice: NearlukService, private router: Router, private gMapsService: GMapsService, private acr: ActivatedRoute) {


  }

  // closeEventHandler(res: boolean) {
  //   this.showPopup = res;
  // }


  ngOnInit() {


    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latt = position.coords.latitude;
        this.lngg = position.coords.longitude;

        var propertytype = this.acr.snapshot.params.id;

        var city = sessionStorage.getItem('city').trim();
        this.nearlukservice.getproertytypebylatlng(this.latt, this.lngg, propertytype, city).subscribe(data => {
          this.propertyList = data
          sessionStorage.setItem('getpropertybyarea', 'true');
          // this.display = true;;
        })
        this.gMapsService.getLatLan(this.latt, this.lngg).subscribe(result => {

        }, error =>
            console.log(error),

          () => console.log('Geocoding completed!')
        );
      });
    }
    else {
      alert("Geolocation is not supported by this browser.");
    }

  }

}
