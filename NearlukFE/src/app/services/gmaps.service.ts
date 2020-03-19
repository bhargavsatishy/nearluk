import { Observable } from 'rxjs';
import { MapsAPILoader, GoogleMapsAPIWrapper } from '@agm/core';
import { Injectable, NgZone } from '@angular/core';


declare var google: any;
declare var map: any;
@Injectable({
  providedIn: 'root'
})
export class GMapsService extends GoogleMapsAPIWrapper {

  country: any;
  state: any;
  city: any;
  area: any;

  constructor(private __loader: MapsAPILoader, private __zone: NgZone) {
    super(__loader, __zone);
  }



  getLatLan(a: any, b: any) {
    let geocoder = new google.maps.Geocoder();
    return Observable.create(observer => {
      let latlng = { lat: a, lng: b };
      geocoder.geocode({ 'location': latlng }, (results, status) => {
        let add = results[0].formatted_address;
        var str_array = add.split(',');
        str_array.reverse();
        // console.log(str_array[2]);
        var str = str_array[1];
        var result = str.split(" ");
        var statename = result[1]
        this.country = str_array[0];
        this.state = statename;
        this.city = str_array[2];
        this.area = str_array[3];




        sessionStorage.setItem('state', statename)
        sessionStorage.setItem('city', str_array[2])
        sessionStorage.setItem('country', str_array[0])
        sessionStorage.setItem('area', str_array[3])

      });

    })
  }


}