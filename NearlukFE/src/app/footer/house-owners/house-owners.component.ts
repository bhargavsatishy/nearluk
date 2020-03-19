import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NearlukService } from 'src/app/services/nearluk.service';

@Component({
  selector: 'app-house-owners',
  templateUrl: './house-owners.component.html',
  styleUrls: ['./house-owners.component.css']
})
export class HouseOwnersComponent implements OnInit {

  constructor(private router: Router,private nearlukservice: NearlukService) { }

  ngOnInit() {
   
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
  })

}
}