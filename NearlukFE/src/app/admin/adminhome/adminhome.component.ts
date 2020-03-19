import { Component, OnInit } from '@angular/core';
import { NearlukService } from 'src/app/services/nearluk.service';
import { postmap } from 'src/app/model/propertymap';

@Component({
  selector: 'app-adminhome',
  templateUrl: './adminhome.component.html',
  styleUrls: ['./adminhome.component.css']
})
export class AdminhomeComponent implements OnInit {
  propertyList: any;
  myProp = 'V'
  myProp1 = 'Active'
  propertyList1: any;
  adminsearch: postmap;
  options: any;
  optionscity: any;
  optionsstate: any;
  optionsarea: any;
  viewall: boolean = false;
  page: any = 1;
  // sortingvalue:any;
  constructor(private nls: NearlukService) {
    this.adminsearch = new postmap();
  }


  handleChange(event, propertyid) {
    this.nls.verified(propertyid).subscribe(data => {
      if (event == false) {
        this.myProp = 'V';
      }

    })

  }

  handleChangee(event, propertyid) {

    this.nls.verified(propertyid).subscribe(data => {
      if (event == false) {
        this.nls.Inactive(propertyid, 'Inactive').subscribe(data => {
          this.myProp1 = 'Active';
        })

      }
      else {
        this.nls.Inactive(propertyid, 'Active').subscribe(data => {
          this.myProp1 = 'Inactive';

        })
      }
    })
  }


  optionstate(c: any) {
    this.nls.getStates(c).subscribe((data) => {
      this.optionsstate = data.data;


    })
  }


  optioncity(c: any) {
    this.nls.getCities(c).subscribe((data) => {
      this.optionscity = data.data;


    })
  }
  optionarea(c: any) {
    this.nls.getArea(c).subscribe((data) => {
      this.optionsarea = data.data;
    })
  }

  btnadminsearch(sortbyadmin: any) {
    this.viewall = true;
    this.adminsearch.adminsort = sortbyadmin;
    if (sortbyadmin == 'V') {
      this.nls.GetSorting(this.adminsearch).subscribe((data) => {
        if (data.result == false) {
          var res = data.message
        }
        else {
          if (data.data == "NDF") {
            var res = data.message
            // this.propertyList1 = data;
            this.propertyList = data.data;
          }
          else {
            if (data.data.length > 0) {
              this.propertyList = data.data;
            }
          }
        }
      })
    }
    else if (sortbyadmin == 'N') {
      this.nls.GetSorting(this.adminsearch).subscribe((data) => {
        // this.propertyList = data.data;
        if (data.result == false) {
          var res = data.message
        }
        else {
          if (data.data == "NDF") {
            var res = data.message
            // this.propertyList1 = data;
            this.propertyList = data.data;

          }
          else {
            if (data.data.length > 0) {
              this.propertyList = data.data;
            }
          }
        }


      })

    }
    else if (sortbyadmin == 'Inactive') {
      this.nls.GetSortingActive(this.adminsearch).subscribe((data) => {
        if (data.result == false) {
          var res = data.message
        }
        else {
          if (data.data == "NDF") {
            var res = data.message
            // this.propertyList1 = data;
            this.propertyList = data.data;

          }
          else {
            if (data.data.length > 0) {
              this.propertyList = data.data;
            }
          }
        }


      })
    }
    else if (sortbyadmin == 'Active') {
      this.nls.GetSortingActive(this.adminsearch).subscribe((data) => {

        if (data.result == false) {
          var res = data.message
        }
        else {
          if (data.data == "NDF") {
            var res = data.message
            // this.propertyList1 = data;
            this.propertyList = data.data;

          }
          else {
            if (data.data.length > 0) {
              this.propertyList = data.data;
            }
          }
        }

      })
    }


  }

  adminviewallproperties() {
    // this.viewall=true;
    this.infinite();

  }

  onScroll() {
    this.page = this.page + 1;
    this.infinite();
  }

  infinite() {
    this.nls.GetAdminHomeDetails(this.page).subscribe((data) => { // Home Cards Get
      this.propertyList = data.data;
    })

  }

  ngOnInit() {
    this.nls.getcountries().subscribe((data) => {
      this.options = data.data
      this.infinite();

    })

  }

}
