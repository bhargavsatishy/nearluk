import { Router } from '@angular/router';
import { NearlukService } from 'src/app/services/nearluk.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import swal from 'sweetalert2';
@Component({
  selector: 'app-myproperty',
  templateUrl: './myproperty.component.html',
  styleUrls: ['./myproperty.component.css']
})
export class MypropertyComponent implements OnInit {
  userid: any
  myproperty: any[] = [];
  roleid: any;
  page: any = 0;
  showSpinner;
  vmyproperty: any;


  constructor(private nearlukservice: NearlukService, private router: Router, private toastr: ToastrService) {
    this.showSpinner = true;


  }


  MoreDetails(propertyid: any) {
    window.open('moredetails' + '/' + propertyid)
    // this.router.navigate(['moredetails' + '/' + propertyid])

  }

  contactAgent(property_id, cityname) {
    sessionStorage.setItem("propCity", cityname)
    this.router.navigate(['contactagent/' + property_id]);
  }

  moredetails(propertyid: any) {
    // this.router.navigate(['moredetails' + '/' + propertyid])
    window.open('moredetails' + '/' + propertyid)

  }
  postProperty() {
    this.router.navigate(['property'])

  }


  update(id: any) {
    this.router.navigate(['updateproperty/' + id])
  }
  deleteProperty(id: any) {

    swal({
      title: 'Are you agree to DELETE!',
      text: "",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#17a2b8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'confirm'
    }).then((result) => {
      if (result.value) {

        this.nearlukservice.deletemyprop(id).subscribe((data) => {

          if (data.result == true) {
            this.toastr.error('You have deleted property');
            this.ngOnInit();
            this.showSpinner = true;

            // this.router.navigate(['myproperty'])
          }

        })


      }
    })


  }



  propertyStatusChange(event, property_id: any) {

    if (event.checked == true) {

      this.nearlukservice.propertystatus(property_id, 'Active').subscribe((data) => {
        // this.ngOnInit()
      })


      // alert(event.value)
    }
    else {
      this.nearlukservice.propertystatus(property_id, 'Inactive').subscribe((data) => {
        // this.ngOnInit()
      })
    }

  }



  onScroll() {
    this.page = this.page + 1;
    this.infinite();
  }



  // infinite() {
  //   this.nearlukservice.getproperty(this.userid, this.page).subscribe((data) => {
  //     this.myproperty = data.data;
  //     this.showSpinner = false;

  //     // console.log(data)
  //   });

  // }


  infinite() {
    this.nearlukservice.getpropertynew(this.userid, this.page).subscribe((data) => {
      this.vmyproperty = data.data;
      this.showSpinner = false;

      for (var i = 0; i < this.vmyproperty.length; i++) {

        this.myproperty.push(this.vmyproperty[i]);
      }
    });
    // this.nearlukservice.getproperty(this.userid, this.page).subscribe((data) => {
    //   this.myproperty = data.data;
    //   this.showSpinner = false;

    //   // console.log(data)
    // });

  }

  ngOnInit() {


    if (sessionStorage.getItem('user') != null) {
      this.nearlukservice.getSectionid(sessionStorage.getItem('user')).subscribe((data) => {
        // this.userid = data.data[0].userid;
        // this.roleid = data.data[0].roleid;
        if (data.length > 0) {
          this.userid = data[0].userid;
          this.roleid = data[0].roleid;
          setTimeout(() => {
            this.infinite();

          }, 2000);
        }
        else {
          localStorage.removeItem('user');
          sessionStorage.removeItem('user')

          this.router.navigate(['login']);
        }



      });
    }

    else {
      localStorage.removeItem('user');
      sessionStorage.removeItem('user')

      this.router.navigate(['login']);
    }





    // let userid = 1

  }

}
