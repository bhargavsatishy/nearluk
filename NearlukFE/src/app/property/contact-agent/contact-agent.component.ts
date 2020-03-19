import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NearlukService } from 'src/app/services/nearluk.service';
import { agent } from 'src/app/model/agent';
import { GMapsService } from '../../services/gmaps.service';

@Component({
  selector: 'app-contact-agent',
  templateUrl: './contact-agent.component.html',
  styleUrls: ['./contact-agent.component.css']
})
export class ContactAgentComponent implements OnInit {
  agents: any;
  agent: agent;
  userid: any;
  propertyid: any;
  agentData: Object;
  roleid: any;

  constructor(private nearlukservice: NearlukService, private acr: ActivatedRoute, public router: Router, private gmaps: GMapsService) {
    this.agent = new agent();
  }



  addAgent() {
    this.agent.fromuserid = this.agent_id;
    this.agent.touserid = this.userid;
    this.agent.propertyid = this.propertyid;

    this.nearlukservice.sendNotification(this.agent).subscribe((result) => {
      this.noData = true;

    })

  }


  cncl() {
    this.noData = false;
    this.alreadyAdded = false;
  }

  ngOnInit() {

    this.propertyid = this.acr.snapshot.params.propertyid;

    if (sessionStorage.getItem('user') != null) {
      this.nearlukservice.getSectionid(sessionStorage.getItem('user')).subscribe((data) => {
        if (data.length > 0) {
          this.userid = data[0].userid;
          this.roleid = data[0].roleid;
          this.getAllAgents();
        }
        else {
          localStorage.removeItem('user');
          sessionStorage.removeItem('user')
          this.router.navigate(['login']);
        }
      });
    }
    else {
      localStorage.removeItem('user');
      sessionStorage.removeItem('user')
      this.router.navigate(['login']);
    }

  }

  getAllAgents() {
    var city = sessionStorage.getItem('propCity');
    // var city = this.gmaps.city;
    // alert(city)
    this.nearlukservice.GetAllAgents(city).subscribe((data) => {
      this.agents = data.data;
      // alert(JSON.stringify(data))
    })
  }

  agentMoreDetails: boolean;
  agent_id: any;
  agentDetails(id: any) {
    this.agent_id = id;
    this.nearlukservice.getUserDetails(id).subscribe((data) => {
      this.agentData = data.data;
      this.agentMoreDetails = true;
    })

    this.agentNotificationData(this.propertyid, id)

  }

  noData: boolean;
  agentNotificationData(propertyId, userIdofAgent) {
    this.nearlukservice.dataToSendNotification(propertyId, userIdofAgent).subscribe((data) => {
      if (data.error == 'NOERROR') {
        if (data.data[0].notificationtype === 'rejected') {
          this.noData = false;
        }
        else if (data.data[0].notificationtype === 'request') {
          this.noData = true;
        }

      }
      else {
        this.noData = false;
      }
    })
    this.agentAdded(propertyId, userIdofAgent)
  }

  alreadyAdded: any;
  agentAdded(pid: any, agentUname: any) {
    this.nearlukservice.agentAdded(pid, agentUname).subscribe((result) => {
      if (result.length > 0) {
        this.alreadyAdded = true;
      }
      else {
        this.alreadyAdded = false;
      }
    })
  }

}
