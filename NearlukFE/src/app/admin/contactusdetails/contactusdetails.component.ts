import { Component, OnInit } from '@angular/core';
import { NearlukService } from 'src/app/services/nearluk.service';

@Component({
  selector: 'app-contactusdetails',
  templateUrl: './contactusdetails.component.html',
  styleUrls: ['./contactusdetails.component.css']
})
export class ContactusdetailsComponent implements OnInit {

  contact: any;

  constructor(private nls: NearlukService) { }


  StatusUpdate(ct_id: any) {

    this.nls.updateStatus(ct_id).subscribe((data) => {

    })

  }

  ngOnInit() {

    this.nls.getContact().subscribe((data) => {

      this.contact = data.data;
      // alert(JSON.stringify(data))

    })

  }
}
