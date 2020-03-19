import { Component, OnInit } from '@angular/core';
import { NearlukService } from 'src/app/services/nearluk.service';

@Component({
  selector: 'app-adminnotification',
  templateUrl: './adminnotification.component.html',
  styleUrls: ['./adminnotification.component.css']
})
export class AdminnotificationComponent implements OnInit {
  NotificationBind: any;

  constructor(private nls: NearlukService) { }

  // send(msg) {
  //   alert(msg);
  //   // this.notify.message = msg;
  //   this.nls.adminnotification(msg).subscribe(data => {
  //     console.log(data);
  //   })
  // }

  ngOnInit() {

  //   this.nls.GetAllAdminNotifications().subscribe((data) => {
  //     this.NotificationBind = data;
  //   })

  
  }

}
