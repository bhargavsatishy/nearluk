import { Component, OnInit } from '@angular/core';
import { GMapsService } from 'src/app/services/gmaps.service';
import { NearlukService } from 'src/app/services/nearluk.service';
import { propertytype } from 'src/app/model/property';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-nearu',
  templateUrl: './nearu.component.html',
  styleUrls: ['./nearu.component.css']
})
export class NearuComponent implements OnInit {
  public iconUrl = {
    url: '../assets/images/maps.png',
    scaledSize: {
      height: 40,
      width: 30
    }
  }


  property: propertytype;

  label: string = 'current Location'
  latt: any;
  lngg: any;
  propertymap: any;
  prope: any[];
  userid: any;
  radius: any[];
  noDataFound: boolean;
  propertyList: any[] = [];
  vproperty: any;
  items: any[] = [];

  constructor(private nearlukservice: NearlukService, private gMapsService: GMapsService, public router: Router, private acr: ActivatedRoute, private toastr: ToastrService) {

    this.property = new propertytype();

  }
  moredetails(propertyid) {
    window.open('moredetails' + '/' + propertyid)
  }



  onMouseOverout(infoWindow, gm) {
    gm.lastOpen = infoWindow;
  }


  onMouseOver(infoWindow, gm, properyid) {
    this.nearlukservice.getPropertyDetailsForMap(properyid).subscribe((data) => {
      this.propertymap = data.data[0];
    });
    if (gm.lastOpen != null) {
      gm.lastOpen.close();
    }
    gm.lastOpen = infoWindow;
    infoWindow.open();
  }


  onScroll() {
    this.page = this.page + 1;
    this.infinite();
  }

  onScroll1() {
 
    this.infinite();
  }

  page: any = 1;


  infinite() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latt = position.coords.latitude;
        this.lngg = position.coords.longitude;
        this.property.lat = position.coords.latitude;
        this.property.long = position.coords.longitude;
        this.property.userid = this.userid;
        this.nearlukservice.nearU(this.property, this.page).subscribe((data) => {
          if (data.result == "false") {
          }
          else {
            if (data.data.length == 0 && data.offset == 0) {
              this.toastr.info('NO data Found')
              this.propertyList = [];

              this.noDataFound = true;
            }
            else {

              this.noDataFound = false;


              this.vproperty = data.data;
              for (var j = 0; j < this.vproperty.length; j++) {

                if (this.items.indexOf(this.vproperty[j].propertyid) === -1) {

                  this.items.push(this.vproperty[j].propertyid);
                  this.propertyList.push(this.vproperty[j])


                }

              }
            }
          }
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





  selecttype() {
    if (this.property.propertyTypeId == undefined) {
    }
    else {
      this.page = 1;
      this.items = [];
      this.propertyList = [];
      this.infinite()
    }
  }


  ngOnInit() {
    this.noDataFound = true;
    if (sessionStorage.getItem('user') != null) {
      this.nearlukservice.getSectionid(sessionStorage.getItem('user')).subscribe((data) => {
        this.userid = data[0].userid;

        this.onScroll1();
      })
    }
    else{
      this.onScroll1();
    }

    this.nearlukservice.getPropertyType().subscribe((data) => {

      this.prope = data.data;

    });

  }
}
