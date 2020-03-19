import { GMapsService } from './services/gmaps.service';
import { tenantnotifications, owneraddagent, addagent } from './model/agent';
import { NearlukService } from 'src/app/services/nearluk.service';
import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import axios from 'axios';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  requestcount: any;
  notificatiosdisplay: boolean;
  logstatus: any;
  userid: any;
  // notifications: any;
  nomessage: string;
  notifyvisible: boolean;
  tenantnotifications: tenantnotifications;
  notifications: any[];
  notificationseen: any[] = [];

  addagent: owneraddagent;
  lat: any;
  lng: any;
  compare1: any = 0;
  compare2: any = 0;
  compare3: any = 0;
  comparecount: any = 0;
  owner: boolean;
  admin: boolean;
  agent: boolean;
  roleid: any;
  notificationscount: any;
  notificationdata: any;
  imagepic: any;
  imagepic1: any;
  addagents: addagent;
  msgcount: any;
  messageArray: Array<{ user: String, message: String }> = [];
  checksession1: number;


  constructor(private router: Router, private toastr: ToastrService, private nearlukservice: NearlukService, private gMapsService: GMapsService, private idle: Idle) {



    this.nearlukservice.newUserJoinedfornotification()
      .subscribe((data) => {
        this.messageArray.push(data)

        var socket = (data.user).toString();
        sessionStorage.setItem('socketid', socket)
        sessionStorage.setItem('socket', 'on')



      });
    this.nearlukservice.userLeftRoom()
      .subscribe(data => this.messageArray.push(data));
    this.nearlukservice.newMessageReceivedForNotificationapp()

      .subscribe((data) => {
        this.messageArray.push(data)

        this.msgcount = +this.msgcount + 1
        this.toastr.success("You got A messaged from " + data[0].user2name);

      });





    this.tenantnotifications = new tenantnotifications();
    this.addagent = new owneraddagent();
    this.addagents = new addagent()
    idle.setIdle(12000);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(12000);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    idle.onTimeout.subscribe(() => {
      alert('Timed out!');
    });
    idle.onIdleStart.subscribe(() =>
      swal({
        type: 'error',
        title: 'Oops...',
        text: "please login again",
        // width: '400px',
        showCancelButton: false,
        confirmButtonColor: '#17a2b8',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.value) {
          sessionStorage.clear();
          this.router.navigate(['login']);
        }
      })
    );
    this.reset();
  }
  get() {
    this.nearlukservice.getSectionid(sessionStorage.getItem('user')).subscribe((data) => {
      this.userid = data[0].userid;
      this.roleid = data[0].roleid;

      setInterval(() => {
        this.count()
      }, 5000)
      if (data[0].roleid == 2) {

        this.agent = true;
      }
      else if (data[0].roleid == 3) {
        this.router.navigate(['adminhome'])
      }
      else {
        this.owner = true;
      }
    });
  }
  reset() {
    this.idle.watch();
  }
  btnCompare() {
    this.router.navigate(['compare'])
  }
  // LogoutClick() {
  //   sessionStorage.removeItem('user');
  //   this.router.navigate(['home'])
  // }


  // LogoutClick() {
  //   this.nearlukservice.leaveRoomfornotification({ user: this.userid, room: this.nearlukservice.userroom });

  //   sessionStorage.removeItem('user');
  //   sessionStorage.removeItem('roleid');
  //   localStorage.setItem('reloadhome', 'reloadhome')
  //   this.router.navigate(['home']);

  // }

  LogoutClick() {
    this.nearlukservice.leaveRoomfornotification({ user: this.userid, room: this.nearlukservice.userroom });
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('roleid');

    localStorage.setItem('reloadhome', 'reloadhome')
    this.router.navigate(['home']);

  }

  getImage() {
    this.nearlukservice.getprofileimage(this.userid).subscribe((data) => {
      this.imagepic = data.data[0].img;
    })
  }


  msgcountt() {


    if (this.msgcount != null)
      this.nearlukservice.deleteappchatcount(this.userid).subscribe((data) => {

      });
    this.msgcount = null

    this.router.navigate(['chat'])
  }

  accept(touserid, propertyid, notification_id) {

    this.notificatiosdisplay = false;

    this.tenantnotifications.propertyid = propertyid
    this.tenantnotifications.fromuserid = this.userid;
    this.tenantnotifications.touserid = touserid;

    this.nearlukservice.addagentnotifications(this.tenantnotifications).subscribe(data => {

    })


    if (this.roleid == 2) {
      this.addagent.agentuserid = this.userid;
    }
    else {
      this.addagent.agentuserid = touserid;
    }
    this.addagent.propertyid = propertyid;
    this.addagent.status = 'accepted'
    this.nearlukservice.insertowneragent(this.addagent).subscribe(data => { console.log(data) })
    this.nearlukservice.updateagentrequest(notification_id, this.addagent.status).subscribe(data => {
      this.notifyvisible = false;
      this.ngOnInit();
      this.agentRequest();
    })

  }

  goToLink(url: string) {
    window.open(url, "_blank");
  }


  agentRequest() {
    this.nearlukservice.getagentnotifications(this.userid).subscribe((data) => {
      if (data.result == false) {
        var res = data.message
      }
      else {
        if (data.data == "NDF") {
          var res = data.message
          this.toastr.error('No request notifications')
          this.notificatiosdisplay = false;

        }
        else {
          if (data.data.length > 0) {

            this.notifications = data.data;
            this.notificatiosdisplay = true;
          }
          else {
          }
        }
      }
    })
  }


  reject(username, property_id, notification_id) {
    this.addagent.agentuserid = username;
    this.addagent.propertyid = property_id;
    this.addagent.status = 'rejected';
    this.nearlukservice.updateagentrequest(notification_id, this.addagent.status).subscribe(data => {
      this.notifyvisible = false;

      this.ngOnInit();
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
      this.notifyvisible = false;
      this.ngOnInit();
      this.agentRequest();
    })

  }


  getNotificationsbyuserid() {
    // let userid = 1;
    this.nearlukservice.getNotificationsbyuserid(this.userid).subscribe((data) => {
      if (data.result == false) {
        var res = data.message
      }
      else {
        if (data.data == "NDF") {
          var res = data.message
          this.toastr.error('Notifications not available')
          this.notifyvisible = false;

          // alert("No Data")
        }
        else {
          if (data.data.length > 0) {
            this.notifications = data.data;
            this.notifyvisible = true;
          }
          else {
          }
        }
      }
    })
  }
  getNotificationsbyuserid1() {
    this.nearlukservice.getNotificationsbyuserid1(this.userid).subscribe((data) => {

    })

  }
  count() {
    this.nearlukservice.getNotificationsbyuserid(this.userid).subscribe((data) => {

      if (data.data[0].status == true) {
        this.notificationscount = null;
      }

      else if (data.data[0].status == false) {
        this.notificationscount = data.data.length;
      }
      this.notificationdata
    })
    this.nearlukservice.getagentnotifications_count(this.userid).subscribe((data) => {
      this.requestcount = data.data.length;
      this.requestcount = data.data;

    })
  }






  ViewAll() {
    this.router.navigate(['notification'])
    this.notifyvisible = false;
    this.notificatiosdisplay = false;

  }

  seenn() {
    this.notifyvisible = false;
  }

  CheckLocalStore(): Observable<any> {
    return of(sessionStorage.getItem("user"));
  }



  ipLookUp = () => {
    axios.get('https://ipapi.co/json/').then((response) => {


      sessionStorage.setItem('country', response.data.country_name)
      sessionStorage.setItem('state', response.data.region)
      sessionStorage.setItem('city', response.data.city)

      let data = response.data;

    }).catch((error) => {
      console.log(error);
    });
  };


  join(userid) {


    this.userid = userid

    this.nearlukservice.joinRoomForNotification(({ user: this.userid }


    ));

  }

  ngOnInit() {
    this.ipLookUp();

    navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;



      this.gMapsService.getLatLan(this.lat, this.lng).subscribe(result => {


      }, error =>
        console.log(error),

        () => console.log('Geocoding completed!')
      );


    });
    // if (sessionStorage.getItem("uname")) {

    // }

    if (sessionStorage.getItem('user') != null) {
      this.get();

      this.nearlukservice.getSectionid(sessionStorage.getItem('user')).subscribe((data) => {
        this.userid = data[0].userid;
        this.roleid = data[0].roleid;
        this.msgcount = data[0].appncount;
        this.join(this.userid);

        setInterval(() => {
          this.count()
        }, 5000)

        this.getImage();

        if (data[0].roleid == 2) {
          this.owner = false;
          this.agent = true;
        }
        else if (data[0].roleid == 3) {
          sessionStorage.setItem('roleid', this.roleid)
          this.router.navigate(['adminhome'])
        }
        else {
          this.agent = false;
          this.owner = true;
        }
      });

    }







  }
  postproperty() {
    if (sessionStorage.getItem('user')) {
      this.router.navigate(['property'])
    }
    else {
      swal({
        title: 'You are not logged in!!',
        text: "Please login to post your property!!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#17a2b8',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Login Here'
      }).then((result) => {
        if (result.value) {
          sessionStorage.setItem("PP", "postProperty");
          this.router.navigate(['login'])
        }
      })
    }
  }

  // ngDoCheck() {
  //   this.CheckLocalStore().subscribe((data) => { this.logstatus = data })

  //   if (localStorage.getItem('compare1') != null) { this.compare1 = 1 } else { this.compare1 = 0 }
  //   if (localStorage.getItem('compare2') != null) { this.compare2 = 1 } else { this.compare2 = 0 }
  //   if (localStorage.getItem('compare3') != null) { this.compare3 = 1 } else { this.compare3 = 0 }
  //   if (localStorage.getItem('remove') == 'remo') {
  //     this.compare1 = 0;
  //     this.compare2 = 0;
  //     this.compare3 = 0;

  //     localStorage.removeItem('remove')

  //   }

  //   this.comparecount = this.compare1 + this.compare2 + this.compare3;
  //   if (sessionStorage.getItem('loroolid') != null) {


  //     this.roleid = sessionStorage.getItem('loroolid');



  //     if (this.roleid == 2) {

  //       this.agent = true;
  //     }
  //     else if (this.roleid == 3) {
  //       this.router.navigate(['adminhome'])
  //     }
  //     else {
  //       this.owner = true;
  //     }


  //     sessionStorage.removeItem('loroolid')

  //   }


  //   if (sessionStorage.getItem('loimage') != null) {
  //     this.imagepic = sessionStorage.getItem('loimage');
  //     sessionStorage.removeItem('loimage');
  //   }


  // }


  checksession() {
    this.nearlukservice.checkusersession(localStorage.getItem('user')).subscribe((data) => {





      if (data.result == true) {




        sessionStorage.setItem("loroolid", data.data[0].roleid)
        sessionStorage.setItem("loimage", data.image)

        this.imagepic = data.image;
        this.userid = data.data[0].id;
        this.roleid = data.data[0].roleid;
        if (data.data[0].roleid == 2) {

          this.agent = true;
        }
        else if (data.data[0].roleid == 3) {
          this.router.navigate(['adminhome'])
        }
        else {
          this.owner = true;
        }
        sessionStorage.setItem('user', localStorage.getItem('user'))
      }
      else {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
      }








      // // this.getImage();

      // if (data[0].roleid == 2) {

      //   this.agent = true;
      // }
      // else if (data[0].roleid == 3) {
      //   this.router.navigate(['adminhome'])
      // }
      // else {
      //   this.owner = true;
      // }
    });

  }

  ngDoCheck() {
    this.CheckLocalStore().subscribe((data) => { this.logstatus = data })
    if (localStorage.getItem('user') == null && sessionStorage.getItem('user') != null) {
      localStorage.removeItem('user')
      sessionStorage.removeItem('user')
      // sessionStorage.setItem('user',localStorage.getItem('user'))
    }
    if (localStorage.getItem('user') != null && sessionStorage.getItem('user') != null && localStorage.getItem('user') != sessionStorage.getItem('user')) {
      localStorage.removeItem('user')
      sessionStorage.removeItem('user')
      // sessionStorage.setItem('user',localStorage.getItem('user'))
    }
    if (sessionStorage.getItem('user') == null && localStorage.getItem('user') != null && this.checksession1 != 1) {

      this.checksession1 = 1



      this.checksession();

    }
    if (localStorage.getItem('compare1') != null) { this.compare1 = 1 } else { this.compare1 = 0 }
    if (localStorage.getItem('compare2') != null) { this.compare2 = 1 } else { this.compare2 = 0 }
    if (localStorage.getItem('compare3') != null) { this.compare3 = 1 } else { this.compare3 = 0 }
    if (localStorage.getItem('remove') == 'remo') {
      this.compare1 = 0;
      this.compare2 = 0;
      this.compare3 = 0;

      localStorage.removeItem('remove')

    }

    this.comparecount = this.compare1 + this.compare2 + this.compare3;
    if (sessionStorage.getItem('loroolid') != null) {


      this.roleid = sessionStorage.getItem('loroolid');



      if (this.roleid == 2) {

        this.agent = true;
      }
      else if (this.roleid == 3) {
        this.router.navigate(['adminhome'])
      }
      else {
        this.owner = true;
      }


      sessionStorage.removeItem('loroolid')

    }


    if (sessionStorage.getItem('loimage') != null) {
      this.imagepic = sessionStorage.getItem('loimage');
      sessionStorage.removeItem('loimage');
    }


  }

}
