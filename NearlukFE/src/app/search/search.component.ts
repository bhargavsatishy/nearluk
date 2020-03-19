import { Component, OnInit } from '@angular/core';
import { NearlukService } from '../services/nearluk.service';
import { Bidding } from '../model/bidding';
import { Router } from '@angular/router';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  // optionPropertyType: any;
  lat: number;
  showbidding: boolean;
  bidding: boolean;
  userdetailsbidding: boolean;

  lng: number;
  showmap: boolean;
  propertymap: any;
  details: any;
  Bidd: Bidding;
  name: any;
  prop: any;
  ownername: any;
  baseprice: any;
  bidprice: any;
  userid: any;
  roleid: any;
  page:any=0;
  optionPropertyType: any[] = [];
  vproperty:any;


  constructor(private nearlukservice: NearlukService,private router: Router) {
    this.Bidd = new Bidding();

   }

  

   onMouseOver(infoWindow, gm, properyid) {






    this.showmap = true;
    this.nearlukservice.getPropertyDetailsForMap(properyid).subscribe((data) => {
      // this.userid = data[0].fn_viewuserid;


      this.propertymap = data.data[0];
      // console.log(this.propertymap)

      // alert(JSON.stringify(this.propertymap))



    });

    if (gm.lastOpen != null) {
      gm.lastOpen.close();
    }

    gm.lastOpen = infoWindow;

    infoWindow.open();
  }
  // onMouseOverout(){

  //   // alert("shiva")
  // }

  mouseovershowonmap(lat, lng, infoWindow, gm) {

    // console.log(infoWindow)
  


    this.lat = parseFloat(lat);
    this.lng = parseFloat(lng);



    //   if (gm.lastOpen != null) {
    //     gm.lastOpen.close();
    // }

    // gm.lastOpen = infoWindow;

    // infoWindow.open();
  }


  onMouseOverout(infoWindow, gm) {

    // this.showmap=true;
    //  alert("shiva")
 

    gm.lastOpen = infoWindow;

    // infoWindow.clclose();
  }

 

  

  getBidding(propertyid: any, price: any, ownerid: any) {

    this.Bidd.ownerid = ownerid
    this.baseprice = price;
    this.Bidd.propertyid = propertyid;
    this.bidding = true;

    this.nearlukservice.getBidding(propertyid).subscribe((data) => {
      this.bidprice = data.data;
    })
  }


  moredetails(propertyid) {
    window.open('moredetails' + '/' + propertyid)

  }

  checkedd(propertyid: any, chk: any) {
    var v1 = 0
    var v2 = 0
    var v3 = 0
    // alert(propertyid)
    if (localStorage.getItem('compare1') == propertyid) {
      // localStorage.removeItem('compare1');
      v1 = 1
      v2 = 1
      v3 = 1
    }
    else if (localStorage.getItem('compare2') == propertyid && v2 == 0) {
      // localStorage.removeItem('compare2');
      v1 = 1
      v2 = 1
      v3 = 1
    }
    else if (localStorage.getItem('compare3') == propertyid && v3 == 0) {

      // localStorage.removeItem('compare3');
      v1 = 1
      v2 = 1
      v3 = 1
    }
    if (localStorage.getItem('compare1') == null && v1 == 0) {
      localStorage.setItem('compare1', propertyid);
    }
    else if (localStorage.getItem('compare2') == null && v2 == 0) {
      localStorage.setItem('compare2', propertyid);
      v2 = 1
    }
    else if (localStorage.getItem('compare3') == null && v3 == 0) {
      localStorage.setItem('compare3', propertyid);
      v3 = 1
    }
    else if (localStorage.getItem('compare3') != null && localStorage.getItem('compare3') == propertyid) {
      chk.checked = false;
      localStorage.removeItem('compare3');
    }
    else if (localStorage.getItem('compare1') != null && localStorage.getItem('compare1') == propertyid) {
      chk.checked = false;
      localStorage.removeItem('compare1');
    }
    else if (localStorage.getItem('compare2') != null && localStorage.getItem('compare2') == propertyid) {
      chk.checked = false;
      localStorage.removeItem('compare2');
    }
    else {

      chk.checked = false;
      alert("Excedd the limit ...")
    }

  }

  GetUserDetails(userid: any) {

    this.nearlukservice.detailsforbiding(userid).subscribe((data) => {
      this.details = data.data;
      this.userdetailsbidding = true;
    })
  }



  btnprice(biddingprice: any) {

    this.Bidd.biddingprice = biddingprice.value;
    this.Bidd.tenantid = this.userid;

    if (parseInt(this.baseprice) >= parseInt(biddingprice.value)) {
      alert("Bid price should be greater than base price..!")
    }
    else {
      this.nearlukservice.priceSend(this.Bidd).subscribe((data) => {
        biddingprice.value = '';
      })

    }
  }


  onScroll() {
    this.page = this.page + 1;
    this.infinite();
  }

  // infinite() {

  //   if (sessionStorage.getItem('user') != null) {
  //     this.nearlukservice.getSectionid(sessionStorage.getItem('user')).subscribe((data) => {
  //       this.userid = data[0].userid;
  //       this.roleid = data[0].roleid;

  //     });
  //   }
  //   this.nearlukservice.filtersearching(this.nearlukservice.filterObj, this.page).subscribe((data) => {
  //     // this.userid = data[0].fn_viewuserid;
  //     this.optionPropertyType = data;

    
  //     this.lat = parseFloat(this.optionPropertyType[0].latitude);
  //     this.lng = parseFloat(this.optionPropertyType[0].longitude);

  //   });


  // }

//   infinite() {

//     if (sessionStorage.getItem('user') != null) {
//       this.nearlukservice.getSectionid(sessionStorage.getItem('user')).subscribe((data) => {
//         this.userid = data[0].userid;
//         this.roleid = data[0].roleid;

 
//     this.nearlukservice.filterObj.userId=this.userid
//     this.nearlukservice.filtersearching(this.nearlukservice.filterObj, this.page).subscribe((data) => {
//       this.optionPropertyType = data;
//       // console.log(this.optionPropertyType)

//       this.lat = parseFloat(this.optionPropertyType[0].latitude);
//       this.lng = parseFloat(this.optionPropertyType[0].longitude);

//     });


//   });
// }

// else{

//   this.nearlukservice.filtersearching(this.nearlukservice.filterObj, this.page).subscribe((data) => {
//     this.optionPropertyType = data;
//     // console.log(this.optionPropertyType)

//     this.lat = parseFloat(this.optionPropertyType[0].latitude);
//     this.lng = parseFloat(this.optionPropertyType[0].longitude);

//   });
// }
//   }

infinite() {

  if (sessionStorage.getItem('user') != null) {
    this.nearlukservice.getSectionid(sessionStorage.getItem('user')).subscribe((data) => {
      this.userid = data[0].userid;
      this.roleid = data[0].roleid;
      this.nearlukservice.filterObj.userId = this.userid
      this.nearlukservice.filtersearchingnew(this.nearlukservice.filterObj, this.page).subscribe((data) => {
        this.vproperty = data;
        // console.log(this.vproperty)
        for (var j = 0; j < this.vproperty.length; j++) {
          this.lat = parseFloat(this.vproperty[j].latitude);
          this.lng = parseFloat(this.vproperty[j].longitude);
          this.optionPropertyType.push(this.vproperty[j]);

          // const newArray = this.optionPropertyType.filter((elem, i, arr) => {
          //   if (arr.indexOf(elem) === i) {
          //     return elem 
          //   }
          // })
          // console.log(newArray);
          // this.temparray=newArray;
        }
      });

    });
  }

  else {
    this.nearlukservice.filtersearchingnew(this.nearlukservice.filterObj, this.page).subscribe((data) => {
      this.vproperty = data;
      for (var i = 0; i < this.vproperty.length; i++) {
        this.lat = parseFloat(this.vproperty[i].latitude);
        this.lng = parseFloat(this.vproperty[i].longitude);
        this.optionPropertyType.push(this.vproperty[i]);
      }
    });
  }
}


  ngOnInit() {
    this.infinite();

  }

}
