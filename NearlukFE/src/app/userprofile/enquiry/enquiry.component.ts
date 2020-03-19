import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NearlukService } from 'src/app/services/nearluk.service';
import swal from 'sweetalert2';
import { EnquiryForm } from 'src/app/model/enquiryform';
import { Alert } from 'selenium-webdriver';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.css']
})
export class EnquiryComponent implements OnInit {
  enqform: EnquiryForm;
  options: any;
  optionscity: any;
  optionsstate: any = [];

  optionsarea: any;
  pTypes: any;
  showSaveUpdate: boolean = false;
  price: any[];
  min: number;
  maxpricee: any[] = [];
  max;
  userid: any
  getEnquiryForm: any
  constructor(private nls: NearlukService, private router: Router, private acr: ActivatedRoute, private toastr: ToastrService) {
    this.enqform = new EnquiryForm();
    this.price = [
      { opt: 1000 },
      { opt: 5000 },
      { opt: 10000 },
      { opt: 15000 },
      { opt: 20000 },
      { opt: 50000 },
      { opt: 100000 },
      { opt: 1000000 },
      { opt: 2000000 },
    ]
  }


  storemin(minval) {
    // alert(minval)
    this.maxpricee = [];
    this.min = minval;
    for (let index = 0; index < this.price.length; index++) {
      if (this.min == this.price[index].opt)
        this.max = index;
    }
    for (let index = this.max + 1; index < this.price.length; index++) {
      this.maxpricee.push(this.price[index].opt);
      // alert(this.maxpricee)
    }
    // console.log(this.maxpricee)
  }

  homeNavigate() {
    this.router.navigate(['home']);
  }

  optionstate(c: any) {


    this.nls.getStates(c).subscribe((data) => {
      this.optionsstate = data.data;
      // console.log(data)

    })
  }


  optioncity(c: any) {
    this.optionsarea = null
    this.optionscity = null
    this.nls.getCities(c).subscribe((data) => {
      this.optionscity = data.data;
    })
  }

  optionarea(c: any) {
    this.nls.getArea(c).subscribe((data) => {
      this.optionsarea = data.data;

      //   alert(JSON.stringify(data));
    })
  }

  cancel() {

    this.router.navigate(['home'])

  }

  SearchUpdate(myFrm: any) {
    if ((myFrm.value.countryname == undefined) || (myFrm.value.statename == undefined) || (myFrm.value.cityname == undefined)) {
    }
    else {

      this.enqform.userid = this.userid;
      // this.enqform.countryname = myFrm.value.country;
      this.nls.EnquiryFormUpdate(this.enqform).subscribe((data) => {
        // alert('updated successfully.....')
        this.router.navigate(['recommendation'])
      })
    }
  }

  AddEnquiryFormData(myFrm: any) {

    // alert(myFrm.value.statename)


    if ((myFrm.value.countryname == undefined) || (myFrm.value.statename == undefined) || (myFrm.value.cityname == undefined)) {
      // alert('not inserted')
    }
    else {
      this.enqform.userid = this.userid;
      // this.enqform.countryname = myFrm.value.countryname
      // alert(JSON.stringify(this.enqform))
      this.nls.EnquiryFormAdd(this.enqform).subscribe((data) => {
        // alert('posted successfully')
        // console.log(data.data)
        this.toastr.warning('Searched successfully');
        this.router.navigate(['recommendation'])
      })

    }



  }

  getdata() {
    this.nls.CheckinEnquiryFormuser(this.userid).subscribe((response) => {
      // console.log(JSON.parse(JSON.stringify(response)).data)
      this.getEnquiryForm = JSON.parse(JSON.stringify(response)).data
      // alert(JSON.stringify(this.getEnquiryForm))
      if (JSON.parse(JSON.stringify(response)).data == "NDF") {
        this.showSaveUpdate = false;
      }
      else {
        this.showSaveUpdate = true;

      }
    })
  }


  ngOnInit() {
    if (sessionStorage.getItem('user') != null) {
      this.nls.getSectionid(sessionStorage.getItem('user')).subscribe((data) => {
        this.userid = data[0].userid;
        if (data.length > 0) {
          this.getdata();
          this.nls.getcountries().subscribe((data) => {
            // console.log(data.data)
            this.options = data.data

          })

          this.nls.getPropertyType().subscribe((data) => {
            this.pTypes = data.data
            // console.log(data)

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

      });
    }

  }
}
