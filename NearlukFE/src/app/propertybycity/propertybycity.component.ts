import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NearlukService } from '../services/nearluk.service';

@Component({
  selector: 'app-propertybycity',
  templateUrl: './propertybycity.component.html',
  styleUrls: ['./propertybycity.component.css']
})
export class PropertybycityComponent implements OnInit {
  propertydetails: any[] =[]
  images: any;
  page: any = 0;
  userid:any;
  spropertydetails:any;


  constructor(private router: Router, private nearlukservice: NearlukService, private acr: ActivatedRoute) { }
  MoreDetails(propertyid: any) {
    window.open('moredetails' + '/' + propertyid)
    // this.router.navigate(['moredetails' + '/' + propertyid])

  }

  onScroll() {
    this.page = this.page + 1;
    this.infinite();
  }

  // infinite() {
  //   var cityid = this.acr.snapshot.params.cid;
  //   this.nearlukservice.getPropertiesByCity(cityid,this.userid,this.page).subscribe((data) => {
  //     this.propertydetails = data.data
  //     // alert(JSON.stringify(this.propertydetails))
  //   })

  // }


  infinite() {
    var cityid = this.acr.snapshot.params.cid;
    this.nearlukservice.getPropertiesByCitynew(cityid, this.userid, this.page).subscribe((data) => {
      this.spropertydetails = data.data;
      // console.log(this.spropertydetails)
      for (var i = 0; i < this.spropertydetails.length; i++) {
        
        this.propertydetails.push(this.spropertydetails[i]);
      }
    });
    // this.nearlukservice.getPropertiesByCity(cityid, this.userid, this.page).subscribe((data) => {

    //   this.propertydetails.push(data.data)
    //   // console.log(this.propertydetails)
    // })

  }

  ngOnInit() {
    if (sessionStorage.getItem('user') != null) {
      this.nearlukservice.getSectionid(sessionStorage.getItem('user')).subscribe((data) => {
        // console.log(data.data)
        this.userid = data[0].userid; 
     
        this.infinite();
      })
      }else {
      this.infinite();
  }

}
}




