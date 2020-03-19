import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NearlukService } from '../services/nearluk.service';
import { filters } from '../model/filters';
import { Router, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-search-main',
  templateUrl: './search-main.component.html',
  styleUrls: ['./search-main.component.css']
})
export class SearchMainComponent implements OnInit {

  filterObj: filters;
  propertyselect: { label: string; value: string[]; }[];
  facing: SelectItem[];
  rating: SelectItem[];
  verification: SelectItem[];
  prope: any[];
  propertyresults: any[] = [];
  propertyresults1: any[] = [];
  // results: any;

  results: string[] = [];
  propertyid: any[] = [];



  brands: any[] = ['Mumbai,Maharashtra,India', 'Hyderabad,Telangana,India', 'Chennai,Tamil Nadu,India', 'Bangalore,Karnataka,India', 'Pune,Maharashtra,India', 'Jaipur,Rajasthan,India'];
  images: any;
  optionPropertyType: any;
  GetFeturedProperties1: any;
  GetFeturedProperties: any;
  citycnt: any;
  citycnt1: any;
  propertybyareaorcity: any;
  showPropertiesByArea: boolean;
  userid: any;
  roleid: any;
  compare1: string;
  compare2: string;
  compare3: string;
  propertytype: any;
  show: boolean;
  afterresultscity: any[] = [];
  afterresultsarea: any[] = [];
  preresults: any[] = [];


  constructor(private nearlukservice: NearlukService, private router: Router, private toastr: ToastrService) {

    this.filterObj = new filters();

    this.propertyselect = [



    ];


    this.facing = [
      { label: 'North', value: ['North'] },
      { label: 'South', value: ['South'] },
      { label: 'East', value: ['East'] },
      { label: 'West', value: ['West'] },
      { label: 'North East', value: ['North East'] },
      { label: 'North West', value: ['North West'] },
      { label: 'South East', value: ['South East'] },
      { label: 'South West', value: ['South West'] }


    ];
    this.verification = [
      { label: 'Verified', value: { id: 1, name: 'V', code: 'Verified' } },
      { label: 'Not Verified', value: { id: 2, name: 'N', code: 'Not Verified' } },

    ];
    this.rating = [
      { label: '1', value: { id: 1, name: '1', code: '1' } },
      { label: '2', value: { id: 2, name: '2', code: '2' } },
      { label: '3', value: { id: 3, name: '3', code: '3' } },
      { label: '4', value: { id: 4, name: '4', code: '4' } },
      { label: '5', value: { id: 5, name: '5', code: '5' } }
    ];
  }

  clickproperty(propertytype) {
    var propname = propertytype.value;
    this.filterObj.propertytype = propname;
    for (var i = 0; i < this.prope.length; i++) {
      if (propname == this.prope[i].propertytype) {
        this.filterObj.propertyTypeId = this.prope[i].id;
      }

    }
  }

  searchProperty(event) {
    this.propertyresults = []
    this.propertyresults1 = []
    if (event.query != undefined) {
      for (var i = 0; i < this.prope.length; i++) {

        var form = event.query
        var proptype = this.prope[i].propertytype

        if (form.toUpperCase() == proptype.toUpperCase().substring(0, form.length)) {
          this.propertyresults.push(proptype);

        }
      }
      this.propertyresults1 = this.propertyresults
    }
    else {
      for (var i = 0; i < this.prope.length; i++) {
        var proptype = this.prope[i].propertytype
        this.propertyresults1.push(proptype);
      }
    }
  }




  onSubmit(myFrm: NgForm) {
    myFrm.resetForm();
  }


  propertyTypeOnChange(c: any) {

    this.filterObj.propertyTypeId = c.value

  }
  // clickCity(cityname: any) {
  //   this.filterObj.cityName = cityname.value
  // }

  // searchCity(event) {
  //   this.results.length = 0;
  //   if (event.query.length > 2) {
  //     this.nearlukservice.cityAutoComplete(event.query).subscribe(data => {
  //       if (data.result == false) {
  //         let errormessage = data.message;
  //       } else {
  //         if (data.data === 'NDF') {
  //           let errormessage = data.message;
  //         }
  //         else {

  //           this.results = data.data;


  //         }
  //       }
  //     });
  //   }

  //   else if (event.query == '') {
  //     this.results = this.brands;

  //   }

  // }





  // search(verifyy, rat) {

  //   if (verifyy.value != undefined) {
  //     this.filterObj.veification = verifyy.value.name
  //   }
  //   if (rat.value != undefined) {
  //     this.filterObj.rating = rat.value.id
  //   }
  //   if (this.filterObj.cityName == undefined) {
  //     this.toastr.error('Select City');
  //     return
  //   }

  //   else if (this.filterObj.minprice) {
  //     if (this.filterObj.minprice <= this.filterObj.maxprice) {
  //       this.nearlukservice.filtersearch(this.filterObj)
  //       this.router.navigate(['search'])
  //     }
  //     else {
  //       this.toastr.error('maxprice should be greater than minprice');
  //     }
  //   }
  //   else {
  //     this.nearlukservice.filtersearch(this.filterObj)
  //     this.router.navigate(['search'])
  //   }
  // }

  clickCity(cityname: any) {
    this.filterObj.cityName = cityname.value


    for (var i = 0; i < this.afterresultscity.length; i++) {
      // console.log(data.data[i].usercityname)
      // this.preresults.push(data.data[i].usercityname)

      if (this.afterresultscity[i].usercityname == cityname.value) {


        this.filterObj.location = 'city'
        this.filterObj.locationId = this.afterresultscity[i].cityid;
      }

    }

    for (var i = 0; i < this.afterresultsarea.length; i++) {
      // console.log(data.data[i].usercityname)
      // this.preresults.push(data.data[i].usercityname)

      if (this.afterresultsarea[i].areaname == cityname.value) {

        this.filterObj.location = 'area'
        this.filterObj.locationId = this.afterresultsarea[i].id;
      }

    }
  }
  // searchCity(event) {

  //   // this.results=undefined;


  //   this.results.length = 0;
  //   if (event.query.length > 2) {
  //     this.preresults=[];
  //     // 
  //     this.nearlukservice.cityAutoComplete(event.query).subscribe(data => {
  //       if (data.result == false) {
  //         let errormessage = data.message;
  //       } else {
  //         if (data.data === 'NDF') {
  //           let errormessage = data.message;
  //         }
  //         else {

  //             this.afterresultscity = data.data;


  //            for(var i=0;i<data.data.length;i++){
  //              this.preresults.push(data.data[i].usercityname)


  //              if(data.data.length==this.preresults.length){
  //               // this.results = [];
  //                this.results = this.preresults;
  //              }

  //            }

  //           // this.results.push(data.data)


  //         }
  //       }
  //     });
  //   }

  //   if (event.query.length > 3) {
  //     this.preresults=[];
  //     // this.results=[];
  //     this.nearlukservice.areaAutoComplete(event.query).subscribe(data => {
  //       if (data.result == false) {
  //         let errormessage = data.message;
  //       } else {
  //         if (data.data === 'NDF') {
  //           let errormessage = data.message;
  //         }
  //         else {

  //             this.afterresultsarea = data.data;


  //            for(var i=0;i<data.data.length;i++){
  //              this.preresults.push(data.data[i].areaname)


  //              if(data.data.length==this.preresults.length){

  //                this.results = this.preresults;
  //              }

  //            }

  //           // this.results.push(data.data)


  //         }
  //       }
  //     });
  //   }

  //   else if (event.query == '') {
  //     this.results = this.brands;

  //   }

  // }

  searchCity(event) {

    // this.results=undefined;


    this.results.length = 0;
    if (event.query.length > 2) {
      this.preresults = [];
      // 
      this.nearlukservice.cityAutoComplete(event.query).subscribe(data => {
        if (data.result == false) {
          let errormessage = data.message;
        }
        else {
          if (data.data === 'NDF') {
            let errormessage = data.message;
            if (event.query.length > 3) {

              // this.results=[];

              this.nearlukservice.areaAutoComplete(event.query).subscribe(data => {
                if (data.result == false) {
                  let errormessage = data.message;
                } else {
                  if (data.data === 'NDF') {
                    let errormessage = data.message;
                  }
                  else {

                    this.preresults = [];
                    this.afterresultsarea = data.data;


                    for (var i = 0; i < data.data.length; i++) {
                      this.preresults.push(data.data[i].areaname)


                      if (this.afterresultsarea.length == this.preresults.length) {

                        this.results = this.preresults;
                      }

                    }

                    // this.results.push(data.data)


                  }
                }
              });
            }

          }
          else {
            this.preresults = [];
            this.afterresultscity = data.data;


            for (var i = 0; i < data.data.length; i++) {

              this.preresults.push(data.data[i].usercityname)


              if (data.data.length == this.preresults.length) {
                // this.results = [];
                this.results = this.preresults;




                if (event.query.length > 3) {

                  // this.results=[];
                  this.nearlukservice.areaAutoComplete(event.query).subscribe(data => {
                    if (data.result == false) {
                      let errormessage = data.message;
                    } else {
                      if (data.data === 'NDF') {
                        let errormessage = data.message;
                      }
                      else {

                        this.afterresultsarea = data.data;


                        for (var i = 0; i < data.data.length; i++) {
                          this.preresults.push(data.data[i].areaname)


                          if (this.afterresultscity.length + this.afterresultsarea.length == this.preresults.length) {

                            this.results = this.preresults;
                          }

                        }

                        // this.results.push(data.data)


                      }
                    }
                  });
                }
              }

            }

            // this.results.push(data.data)


          }
        }
      });
    }



    else if (event.query == '') {
      this.results = this.brands;

    }

  }



  search(verifyy, rat) {

    if (verifyy.value != undefined) {
      this.filterObj.veification = verifyy.value.name
    }
    if (rat.value != undefined) {
      this.filterObj.rating = rat.value.id
    }
    if (this.filterObj.cityName == undefined) {
      this.toastr.error('Select City');
      return
    }

    else if (this.filterObj.minprice) {
      if (parseInt(this.filterObj.minprice) <= parseInt(this.filterObj.maxprice)) {
        this.nearlukservice.filtersearch(this.filterObj)
        this.router.navigate(['search'])
      }
      else {
        this.toastr.error('maxprice should be greater than minprice');
      }
    }
    else {
      this.nearlukservice.filtersearch(this.filterObj)
      this.router.navigate(['search'])
    }
  }

  search1() {

    if (this.filterObj.cityName == undefined) {
      this.toastr.error('Select City');
      return
    }

    else if (this.filterObj.minprice) {
      if (this.filterObj.minprice <= this.filterObj.maxprice) {
        this.nearlukservice.filtersearch(this.filterObj)
        this.router.navigate(['search'])
      }
      else {
        this.toastr.error('maxprice should be greater than minprice');
      }
    }
    else {
      this.nearlukservice.filtersearch(this.filterObj)
      this.router.navigate(['search'])
    }
  }



  getpropertybyarea(ptype) {
    this.router.navigateByUrl('/getareabycity', { skipLocationChange: true }).then(() =>
      this.router.navigate(['getareabycity' + '/' + ptype]));
  }

  getProperies(i: any) {
    this.router.navigate(['propertybycity/' + i])
  }


  advance() {


    this.show = true
    // alert(this.show)
  }



  closeButton() {
    this.show = false;
    // alert(this.show)
  }
  ngOnInit() {
    this.show = false

    if (sessionStorage.getItem('user') != null) {
      this.nearlukservice.getSectionid(sessionStorage.getItem('user')).subscribe((data) => {
        this.userid = data[0].userid;
        this.roleid = data[0].roleid;

      });
    }

    this.compare1 = sessionStorage.getItem('compare1')
    this.compare2 = sessionStorage.getItem('compare2')
    this.compare3 = sessionStorage.getItem('compare3')

    var area = sessionStorage.getItem('area');
    var city = sessionStorage.getItem('city');
    var state = sessionStorage.getItem('state');



    this.nearlukservice.getPropertyType().subscribe((data) => {//Get Property Type Dropdown
      this.prope = data.data
      // alert(JSON.stringify(this.prope))
      if (data.result == false) {
        var res = data.message

      }
      else {
        if (data.data == "NDF") {
          var res = data.message
        }
        else {

          this.propertytype = data.data;

          for (var i = 0; i < data.data.length; i++) {


            this.propertyselect.push({ label: data.data[i].propertytype, value: data.data[i].id })

          }
        }
      }
    });



    var area = sessionStorage.getItem('area');
    var city = sessionStorage.getItem('city');


    this.nearlukservice.getpropertybyareaorcity(city, area).subscribe(data => {
      this.showPropertiesByArea = true;
      if (data.result == false) {
        var res = data.message

      }
      else {
        if (data.data == "NDF") {
          var res = data.message
        }
        else {

          this.propertybyareaorcity = data.data;


        }
      }
    });


    this.nearlukservice.GetFeturedProperties().subscribe((data) => {


      this.GetFeturedProperties = data.data.slice(0, 4);
      this.GetFeturedProperties1 = data.data.slice(4, 8);
    })

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
    setTimeout(() => {

      this.nearlukservice.getAllPropertys(sessionStorage.getItem('state'), sessionStorage.getItem('city'), this.userid).subscribe((data1) => {

        this.optionPropertyType = data1.data;

        this.images = data1.img

        // this.getrecentViews();


      });

    }, 1500);

  }



}







