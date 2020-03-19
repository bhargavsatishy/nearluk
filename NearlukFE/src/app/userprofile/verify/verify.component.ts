import { Component, OnInit } from '@angular/core';
import { NearlukService } from '../../services/nearluk.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

  constructor(private router: Router, private nearlukservice: NearlukService, private acr: ActivatedRoute) { }

  ngOnInit() {
    var sessionid = this.acr.snapshot.params.sessionid;



    this.nearlukservice.verifyUser(sessionid).subscribe((data) => {
      // this.images 
      sessionStorage.setItem('user', sessionid)


      this.router.navigate(['profile'])
    })

  }

}