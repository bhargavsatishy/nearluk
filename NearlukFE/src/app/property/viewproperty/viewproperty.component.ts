import { GMapsService } from './../../services/gmaps.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NearlukService } from 'src/app/services/nearluk.service';

@Component({
  selector: 'app-viewproperty',
  templateUrl: './viewproperty.component.html',
  styleUrls: ['./viewproperty.component.css']
})
export class ViewpropertyComponent implements OnInit {

  // viewProperty: any
  optionPropertyType: any
  images: any
  // page: any = 1;
  statename:any;
  cityname:any;
  userid:any;
  viewProperty: any[] = [];
  pdetails:any;
  page: any = 0;

  constructor(private arc: ActivatedRoute, private map: GMapsService, private nluk: NearlukService) { }

  moredetails(propertyid: any) {
    window.open('moredetails' + '/' + propertyid)
  }

  onScroll() {
    this.page = this.page + 1;
    this.infinite();
  }

  // infinite() {
  //   var type = this.arc.snapshot.params.type;
  //   var propertytype = type;
  //   var statename = this.map.state;
  //   var cityname = this.map.city;
  //   this.nluk.getCityidbyPropertytype(propertytype, statename, cityname, this.page).subscribe((data) => {
  //     this.viewProperty = data.data;
  //   })
  // }

  // infinite() {
  //   var type = this.arc.snapshot.params.type;
  //   var propertytype = type;
  //   this.statename = this.map.state;
  //    this.cityname = this.map.city;

  //   this.nluk.getCityidbyPropertytype(propertytype, this.statename,this.cityname, this.page).subscribe((data) => {
  //     this.viewProperty = data.data;
  //   })
  // }


  // infinite() {
  //   var type = this.arc.snapshot.params.type;
  //   var propertytype = type;
  //   this.statename = this.map.state;
  //    this.cityname = this.map.city;

  //   this.nluk.getCityidbyPropertytype(propertytype, this.statename,this.cityname,this.userid, this.page).subscribe((data) => {
  //     this.viewProperty = data.data;
  //   })
  // }


  infinite() {
    var type = this.arc.snapshot.params.type;
    var propertytype = type;
    this.statename = this.map.state;
    this.cityname = this.map.city;
    console.log(this.page)
    this.nluk.getCityidbyPropertytypenew(propertytype, this.statename, this.cityname, this.userid, this.page).subscribe((data) => {
      this.pdetails = data.data;
          for (var i = 0; i < this.pdetails.length; i++) {
            this.viewProperty.push(this.pdetails[i]);
       
        }


    })
  }

//   ngOnInit() {
//     if (sessionStorage.getItem('user') != null) {
//       this.nluk.getSectionid(sessionStorage.getItem('user')).subscribe((data) => {
//         // console.log(data.data)
//         this.userid = data[0].userid;
//         this.infinite();
//       })
//     }
//     this.infinite();
//   }
// }

ngOnInit() {
  if (sessionStorage.getItem('user') != null) {
    this.nluk.getSectionid(sessionStorage.getItem('user')).subscribe((data) => {
      this.userid = data[0].userid;
      this.infinite();
    })
  } else {
    this.infinite();
  }

}
}