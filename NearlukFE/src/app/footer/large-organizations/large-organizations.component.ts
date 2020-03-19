import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NearlukService } from 'src/app/services/nearluk.service';

@Component({
  selector: 'app-large-organizations',
  templateUrl: './large-organizations.component.html',
  styleUrls: ['./large-organizations.component.css']
})
export class LargeOrganizationsComponent implements OnInit {

  constructor( private router: Router,private nearlukservice: NearlukService) { }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
  })
  }

}
