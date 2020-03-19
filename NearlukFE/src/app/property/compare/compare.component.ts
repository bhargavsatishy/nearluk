
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NearlukService } from 'src/app/services/nearluk.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {

  i: any
  propertyList: any
  array: any[] = [];


  comparecount: any = 0;
  one: number = 0;
  two: number = 0;
  three: number = 0;
  logstatus: any;
  showowner: string = "";
  ownerinfo: any;
  noData: boolean;
  count: any;
  userid:any;

  constructor(private router: Router, private act: ActivatedRoute, private actt: ActivatedRoute, private nearlukservice: NearlukService, private acttt: ActivatedRoute) { }


  CheckLocalStore(): Observable<any> {
    return of(sessionStorage.getItem('sessionId'));

  }

  removeallCompare() {

    localStorage.removeItem("compare1")
    localStorage.removeItem("compare2")
    localStorage.removeItem("compare3")


    localStorage.setItem('remove', 'remo')
    

    let user_type = sessionStorage.getItem("user_type");
    if (user_type == 'Owner/Tenant' || user_type == null) {
      this.router.navigate(['home']);
    }
    else if (user_type == 'Agent') {
      this.router.navigate(['agent']);
    }

  }

  removecompare(pid) {



    if (localStorage.getItem("compare1") == pid) {
      localStorage.removeItem("compare1");
      this.ngOnInit();
    }
    else if (localStorage.getItem("compare2") == pid) {
      localStorage.removeItem("compare2");
      this.ngOnInit();
    }
    else if (localStorage.getItem("compare3") == pid) {
      localStorage.removeItem("compare3");
      this.ngOnInit();
    }
    if (localStorage.getItem("compare1") == null && localStorage.getItem("compare2") == null && localStorage.getItem("compare3") == null) { this.router.navigate(['home']) }
  }


  ownerinfos(pid) {
    if (!sessionStorage.getItem('user')) {
      this.router.navigate(['login']);
    }
    else {
      this.showowner = pid;
      this.nearlukservice.getOwnersInfo(pid,this.userid).subscribe(data => {
        this.ownerinfo = data[0];
        pid = "";

      })
    }
  }

  ngOnInit() {
    // let uname = sessionStorage.getItem('sessionId');

    let property_id1 = localStorage.getItem('compare1');
    let property_id2 = localStorage.getItem('compare2');
    let property_id3 = localStorage.getItem('compare3')

    this.nearlukservice.GetCompare(property_id1, property_id2, property_id3).subscribe((data) => {

      this.propertyList = data.data;
    });

  }
}

