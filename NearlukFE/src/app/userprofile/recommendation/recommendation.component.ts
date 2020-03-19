import { Component, OnInit } from '@angular/core';
import { EnquiryForm } from 'src/app/model/enquiryform';
import { Router } from '@angular/router';
import { NearlukService } from 'src/app/services/nearluk.service';
import swal from 'sweetalert2';
@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.css']
})
export class RecommendationComponent implements OnInit {


  Enquiry: EnquiryForm;
  optionsarea: any
  Propertys: any[] = [];
  getEnquiryForm: any;
  userid: any;
  page: any = 1;
  vproperty: any;
  items: any[] = [];
  noDataImage: boolean;
  constructor(private nls: NearlukService, private router: Router) {
    this.Enquiry = new EnquiryForm();
  }


  MoreDetails(propertyid: any, userid: any) {
    // var userid = this.userid;
    // if (username != null && ownername != username) {
    //   this.nls.Insert_property_views(property_id, username).subscribe((data) => {

    //   })
    // }
    this.router.navigate(['moredetails' + '/' + propertyid])
  }


  // infinite() {
  //   this.nls.SearchInOwnerPrpertyByEnquiryForm(this.Enquiry).subscribe((data) => {
  //     this.Propertys = data.data;
  //     // console.log(this.Propertys)
  //   })
  // }
  // infinite() {


  //   this.Enquiry.userid = this.userid
  //   this.nls.SearchInOwnerPrpertyByEnquiryForm(this.Enquiry, this.page).subscribe((data) => {
  //     if (this.Propertys == "NDF") {
  //       this.noDataImage = true;
  //     }
  //     else {
  //       this.Propertys = data.data;
  //     }
  //   })
  // }

  infinite() {


    this.Enquiry.userid = this.userid
    this.nls.SearchInOwnerPrpertyByEnquiryForm(this.Enquiry, this.page).subscribe((data) => {
      if (data.data.length ==0 && data.offset==0) {
        this.noDataImage = true;
      }
      else {
        this.vproperty = data.data;




        for (var j = 0; j < this.vproperty.length; j++) {
      
          // this.optionPropertyType.push(this.vproperty[j]);
  
      
      //     if(this.propertyList.indexOf(this.vproperty[j]) > -1) {
          
      // }
      
      if(this.items.indexOf(this.vproperty[j].propertyid) === -1) {
  
        this.items.push(this.vproperty[j].propertyid);
        this.Propertys.push(this.vproperty[j])
      }
  
        }
      }
    })
  }

  onScroll() {
    this.page = this.page + 1;
    this.infinite();
  }

  ngOnInit() {

    if (sessionStorage.getItem('user') != null) {
      this.nls.getSectionid(sessionStorage.getItem('user')).subscribe((data) => {
        // console.log(data.data)
        this.userid = data[0].userid;
        if (data.length > 0) {
          this.nls.GetPropertyRecommendations(this.userid).subscribe((data) => {
            // console.log(JSON.stringify(data))
            this.getEnquiryForm = JSON.parse(JSON.stringify(data)).data;
            // alert(JSON.stringify(this.getEnquiryForm))
            this.Enquiry.propertytypeid = this.getEnquiryForm[0].propertytypeid;
            this.Enquiry.minprice = this.getEnquiryForm[0].minprice;
            this.Enquiry.maxprice = this.getEnquiryForm[0].maxprice;
            this.Enquiry.facing = this.getEnquiryForm[0].facing;
            this.Enquiry.countryid = this.getEnquiryForm[0].countryid;
            this.Enquiry.stateid = this.getEnquiryForm[0].stateid;
            this.Enquiry.cityid = this.getEnquiryForm[0].cityid;
            this.Enquiry.areaid = this.getEnquiryForm[0].areaid;
            if (this.getEnquiryForm == "NDF") {

              this.noDataImage = true;
            }
            else {
              this.infinite();

            }

          })

        }
        else {
          swal({
            type: 'error',
            title: 'Oops...',
            text: "please login again",
            // width: '400px',
            showCancelButton: false,
            confirmButtonColor: '#17a2b8',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.value) {
              sessionStorage.clear();
              this.router.navigate(['login']);
            }
          })
        }
      })
    }

  }
}