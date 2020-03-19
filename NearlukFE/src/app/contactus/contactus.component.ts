import { contactus } from './../model/contactus';
import { Component, OnInit } from '@angular/core';
import { NearlukService } from '../services/nearluk.service';
import { Router, NavigationEnd } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent implements OnInit {
  contact: contactus;
  constructor(private nearlukservice: NearlukService, private router: Router, private toastr: ToastrService) { }

  ContectUs(myFrm: any) {

    // alert(JSON.stringify(this.contact))
    if ((this.contact.name == undefined) || (this.contact.email == undefined) || (this.contact.message == undefined)) {

    }
    else {

      this.nearlukservice.SendContact(this.contact).subscribe((data) => {

        this.toastr.success('Submitted successfully!! We will contact you shortly');

        myFrm.resetForm();
      })
    }

  }

  onSubmit(myFrm: NgForm) {
    myFrm.resetForm();
  }

  ngOnInit() {
    this.contact = new contactus();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
  });
  }

}