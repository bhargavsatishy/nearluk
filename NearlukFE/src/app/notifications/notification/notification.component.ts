import { Component, OnInit } from '@angular/core';
import { NearlukService } from '../../services/nearluk.service';
import { addagent, owneraddagent } from 'src/app/model/agent';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';



@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  requestnotifications: any;
  notifications: any;
  userid: any;
  roleid: any;
  addagents: addagent;
  addagent: owneraddagent;
  agentData: any;
  agentMoreDetails: boolean;

  constructor(private nearlukservice: NearlukService, private toastr: ToastrService, private router: Router) {
    this.addagents = new addagent()
    this.addagent = new owneraddagent();

  }

  moredetails(a: any) {
    this.router.navigate(["/moredetails/" + a])
  }
  agentprofile(agentUserid) {


    this.nearlukservice.getUserDetails(agentUserid).subscribe((data) => {
      this.agentData = data.data;

      this.agentMoreDetails = true;
    })

  }


  addAgentRes(touserid, propertyid, notification_id) {


    this.addagents.propertyid = propertyid
    this.addagents.fromuserid = this.userid;
    this.addagents.touserid = touserid;


    if (this.roleid == 2) {
      this.addagents.agentuserid = this.userid;
    }
    else {
      this.addagents.agentuserid = touserid;
    }
    this.addagents.status = 'accepted'

    this.addagents.notificationId = notification_id;


    this.nearlukservice.addagenttoowner(this.addagents).subscribe(data => {
      this.toastr.success('Added Successfully');

      // this.notifyvisible = false;
      this.ngOnInit();
      this.get();
      // this.agentRequest();
    })

  }

  reject(username, property_id, notification_id) {
    this.addagent.agentuserid = username;
    this.addagent.propertyid = property_id;
    this.addagent.status = 'rejected';
    this.nearlukservice.updateagentrequest(notification_id, this.addagent.status).subscribe(data => {
      this.toastr.info('Rejected Successfully');

      this.ngOnInit();
    })
  }

  get() {
    this.nearlukservice.getNotificationsbyuserid(this.userid).subscribe((data) => {
      if (data.result == false) {
        var res = data.message
      }
      else {
        if (data.data == "NDF") {
          var res = data.message
        }
        else {
          if (data.data.length > 0) {
            this.notifications = data.data;
          }
          else {
          }
        }
      }
    })
  }



  getAgentRequest() {
    this.nearlukservice.getagentnotifications(this.userid).subscribe((data) => {

      if (data.result == false) {
        var res = data.message
      }
      else {
        if (data.data == "NDF") {
          var res = data.message
          // alert("No Data")

        }
        else {
          if (data.data.length > 0) {

            this.requestnotifications = data.data;

          }
          else {
          }
        }
      }
    })
  }

  ngOnInit() {

    this.nearlukservice.getSectionid(sessionStorage.getItem('user')).subscribe((data) => {
      this.userid = data[0].userid;
      this.roleid = data[0].roleid;
      this.get();
      this.getAgentRequest();
    });




  }

}
