import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NearlukService } from '../services/nearluk.service';

@Component({
  selector: 'app-searchbyall',
  templateUrl: './searchbyall.component.html',
  styleUrls: ['./searchbyall.component.css']
})
export class SearchbyallComponent implements OnInit {

  propertydetails: any[]
  images: any;
  page: any=1;

  constructor(private router: Router, private acr: ActivatedRoute, private nearlukservice: NearlukService) { }
 
 
  moredetails(propertyid: any) {
    // alert(propertyid+'dggdggdggdggdggd')
    window.open('moredetails' + '/' + propertyid)
    // this.router.navigate(['moredetails' + '/' + propertyid.value])
  }

  onScroll()
  {

    this.page = this.page + 1;
 

    
   this.searchbyvalue();
  }

searchbyvalue(){
  var searchbyall = this.acr.snapshot.params.sid;
  //  alert(searchbyall+'snapchat')
  this.nearlukservice.searchall(searchbyall,this.page).subscribe((data) => {
    //  console.log(data);
    this.propertydetails = data.data;
    this.images;
    // alert(JSON.stringify(this.propertydetails))
  })
}

  ngOnInit() {

  this.searchbyvalue();

  }

}