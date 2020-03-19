import { Bidding } from './../model/bidding';
import { agent, tenantnotifications } from './../model/agent';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { Router } from '@angular/router';
import { NearlukService } from '../services/nearluk.service';
import { forum } from '../model/forum';
import { NgForm } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material';


import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
class Aminity {
  id: number;
  amName: string;
}

@Component({
  selector: 'app-moredetails',
  templateUrl: './moredetails.component.html',
  styleUrls: ['./moredetails.component.css']
})
export class MoredetailsComponent implements OnInit {

  notifyvisible: boolean;
  videoshow: any;
  agentAdded: boolean;
  public iconUrl = {
    url: '../assets/images/maps.png',
    scaledSize: {
      height: 40,
      width: 30
    }
  }

  propertyId: any;
  propertydetails: any;
  array: any = [];
  facilitiesArray: any[] = [];
  propertyfa: any;
  amArray: any[] = [];
  count: number;
  amenitiesArrayGet: any[] = [];
  longitude: number;
  latitude: number;
  dispalayimages: any[];
  videoDisplay: string;
  favourites: boolean = false;
  userid: any;
  agent: agent;
  session_id: any;
  roleid: any;
  display1: boolean = false;
  ownerdata: any
  propertyviewscount: any;
  agents: boolean;
  notification: boolean;
  Bidd: Bidding;
  bidprice: any;
  baseprice: any;
  bidding: boolean;
  details: any;
  userdetailsbidding: boolean;
  proportyownerid: any;

  similarpropertys: any[];
  recentviewdpropertys: any

  Comments: any;

  propertylength: any;
  avgprice: boolean;
  displayaverage: any;
  averagebyarea: any;
  owner: boolean;
  novideoImg: any;
  likestatus:any;

  constructor(private acr: ActivatedRoute, private nearlukservice: NearlukService, private router: Router, private toastr: ToastrService) {
    this.fourm = new forum();
    this.agent = new agent();
    this.Bidd = new Bidding();
  }
  onSubmit(myFrm: NgForm) {
    myFrm.resetForm();
  }
  rating: any


  RatingSend(event) {



    if (this.userid != undefined) {

      this.getcommentsbyid()
      this.fourm.propertyid = this.propertyId;
      this.fourm.userid = this.userid;
      this.fourm.rating = event.value;


      if (this.userComments.length > 0) {
        this.fourm.comments = this.userComments[0].comment
      }
      this.nearlukservice.commentSend(this.fourm).subscribe((data) => {

        this.rating = data;

        this.toastr.success('You rated successfully');

      })

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

          this.router.navigate(['login'])
          localStorage.setItem('more', this.propertyId)


        }
      })
    }



  }


  onLinkClick(event: MatTabChangeEvent) {

    if (event.index == 1) {

      if (sessionStorage.getItem('user') != null) {
        this.nearlukservice.getSectionid(sessionStorage.getItem('user')).subscribe((data) => {
          this.userid = data[0].userid;
          this.roleid = data[0].roleid;

          this.nearlukservice.getOwnersInfo(this.propertyId, this.userid).subscribe((data) => {

            this.ownerdata = data.data
            // alert(JSON.stringify(this.ownerdata))
          })
        });
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

            this.router.navigate(['login'])
            localStorage.setItem('more', this.propertyId)


          }
        })
      }
    }

  }



  allComments: any
  rate: any


  GetComments() {
    this.nearlukservice.getComments(this.propertyId).subscribe((data) => {

      if (data.result == false) {
        var res = data.message
      }
      else {
        if (data.data == "NDF") {
          var res = data.message
          this.toastr.error('No Reviews')
        }
        else {
          if (data.data.length > 0) {

            this.allComments = data.data;
            this.notifyvisible = true
          }
          else {
          }
        }
      }

    })
  }


  chatWithUser(userId, propertyid) {
    if (!this.userid) {
      this.toastr.error('Please login');
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

          this.router.navigate(['login'])
          localStorage.setItem('more', this.propertyId)


        }
      })

    }
    else {
      this.router.navigate(['chat/' + userId + "/" + propertyid])
    }
  }

  propertyid: any
  userComments: any
  getcommentsbyid() {
    this.propertyid = this.propertyId
    this.nearlukservice.getCommentsbyid(this.propertyid, this.userid).subscribe((data) => {
      this.userComments = data;
      if (this.userComments.length > 0) {
        this.rate = this.userComments[0].rating
      }
    })
  }
  fourm: forum;
  rating1: any
  btncomments(Comments: any) {
    if (Comments) {
      if (!this.userid) {
        this.toastr.error('Please login');
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

            this.router.navigate(['login'])
            localStorage.setItem('more', this.propertyId)


          }
        })

      }
      else {
        this.fourm.propertyid = this.propertyId
        this.fourm.comments = Comments
        if (this.userComments.length > 0) {
          this.fourm.rating = this.userComments[0].rating
        }

        this.fourm.userid = this.userid
        // console.log(this.fourm)
        this.nearlukservice.commentSend(this.fourm).subscribe((data) => {
          this.GetComments();
        })
      }
    }
  }


  goToLink(url: string) {
    window.open(url, "_blank");
  }


  addintofav() {
    if (sessionStorage.getItem('user') != null) {
      this.nearlukservice.getSectionid(sessionStorage.getItem('user')).subscribe((data) => {
        this.userid = data[0].userid;
        this.roleid = data[0].roleid;
        this.nearlukservice.postfavourite(this.propertyId, this.userid).subscribe((data) => {
          this.favourites = true

          this.toastr.success('Added to my favourites');


        })
        this.getallfav();
      });
    }
    else {

      this.toastr.success('Please login');
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

          this.router.navigate(['login'])
          localStorage.setItem('more', this.propertyId)


        }
      })
    }
  }



  getallfav() {

    this.nearlukservice.getallfavs(this.propertyId, this.userid).subscribe((data) => {
      this.favourites = data.result

    })
  }


  removeFavourite() {
    this.nearlukservice.removefav(this.propertyId, this.userid).subscribe((data) => {
      this.favourites = false
      this.toastr.success('Removed from favourites');

    })
    this.getallfav();
  }



  Like() {


    if (this.userid != undefined) {


      this.nearlukservice.likeSend(this.propertyId, this.userid).subscribe((data) => { // Like Post

        this.likestatus=1

        this.propertylikes=+this.propertylikes+1;
         this.toastr.success("You Liked The Property");
        // this.getAllLikes()

      })
    }
    else {
      this.toastr.success('Please login');
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

          this.router.navigate(['login'])
          localStorage.setItem('more', this.propertyId)


        }
      })
    }


  }



  disLike() {


    if (this.userid != undefined) {


      this.nearlukservice.likeSend(this.propertyId, this.userid).subscribe((data) => { // Like Post
        this.likestatus=0
        this.propertylikes=+this.propertylikes-1;
         this.toastr.success('You Disliked The Property');
        // this.getAllLikes()

      })
    }
    else {
      this.toastr.success('Please login');
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

          this.router.navigate(['login'])
          localStorage.setItem('more', this.propertyId)


        }
      })
    }


  }


  propertylikes: any
  getAllLikes() {

    this.nearlukservice.getAllikes(this.propertyId).subscribe((data) => { // Like Post

      this.propertylikes = data[0].count;

    })

  }



  getaverage(ptypeid, areaid, pid: any) {



    this.nearlukservice.getaveragebyarea(ptypeid, areaid).subscribe((data) => {

      this.avgprice = true;
      this.displayaverage = pid;
      this.averagebyarea = data.data;
      this.averagebyarea.average = Math.floor(this.averagebyarea.average)

    })
  }

  addAgent(owneruserid: any) {

    this.agent.touserid = this.userid;
    this.agent.fromuserid = owneruserid;
    this.agent.propertyid = this.propertyId;

    this.nearlukservice.sendNotification(this.agent).subscribe((data) => {

      this.notification = true;
    })

  }


  // tenanatnotificationsfroagents() {

  //   this.nearlukservice.dataForAgentNotification(this.propertyId, this.userid, 'request').subscribe((data) => {

  //     if (data.result == false) {
  //       var res = data.message
  //     }

  //     else {

  //       if (data.data == "NDF") {

  //         var res = data.message
  //         this.notification = false;

  //       }

  //       else {

  //         // this.propertyviewscount = data.data;
  //         this.notification = true

  //       }
  //     }

  //   })

  // }
  tenanatnotificationsfroagents() {

    this.nearlukservice.dataForAgentNotification(this.propertyId, this.userid, 'request').subscribe((data) => {


      //  alert(JSON.stringify(data))

      if (data.result == false) {
        var res = data.message
        this.notification = false;
      }
      else {
        if (data.data == "NDF") {
          var res = data.message
          this.notification = false;
        }
        else {

          this.propertyviewscount = data.data;

          // alert( this.propertyviewscount )

          this.notification = true;
        }
      }
    })
  }

  getAddAgent() {
    this.nearlukservice.getDataForNotification(this.propertyId, this.userid).subscribe((data) => {

      // if (data.data.length > 0) {
      //   this.agentAdded = true;

      // }
      // else {
      //   this.agentAdded = false;

      // }
      if (data.result == false) {
        var res = data.message
        // this.agentAdded = true
      }
      else {
        if (data.data == "NDF") {
          var res = data.message
          // this.notification = false;
          this.agentAdded = false;
        }
        else {
          // this.propertyviewscount = data.data;
          // this.notification = true;
        }
      }
    })
  }

  
 

  moredetails1(id: number) {

    window.open('moredetails' + '/' + id)
  }
  moredetails() {
    if (sessionStorage.getItem('user') != null) {
      this.nearlukservice.getSectionid(sessionStorage.getItem('user')).subscribe((data) => {
        this.userid = data[0].userid;
      })
    }



    this.session_id = sessionStorage.getItem('user');

    this.nearlukservice.getMoreDetails(this.propertyId, this.session_id).subscribe((data) => {

      this.videoshow = data.video.result;
      this.novideoImg = data.video.noVideo

      if (data.result == false) {

        var res = data.message


      }
      else {
        if (data.data == "NDF") {

          var res = data.message

        }
        else {



          this.propertyviews(this.propertyId);

          this.proportyownerid = data.data[0].userid;
          this.propertydetails = data.data;
          this.propertyfa = data.data[0];

          this.favourites = data.favorite;

          this.propertylikes = data.likes;

          this.likestatus=data.likestatus.length;


          this.userComments = data.rating;
          if (this.userComments.length > 0) {
            this.rate = this.userComments[0].rating
          }
          var img = data.images
          this.dispalayimages = []

          img.forEach(file => {
            this.dispalayimages.push({ source: file, alt: 'Description for Image 1', title: '' })
          });

          this.propertylikes = data.likes;
          var facilityid = this.propertyfa.facilities_id;
          var facilityName = this.propertyfa.facilities;
          this.latitude = parseFloat(this.propertyfa.latitude);
          this.longitude = parseFloat(this.propertyfa.longitude);
          this.userComments = data.rating;

          if (this.userComments.length > 0) {
            this.rate = this.userComments[0].rating
          }
          if (facilityid != '') {

            this.array = this.propertydetails.facilities_id

            for (var i = 0; i < facilityid.length; i++) {
              for (var j = i; j <= i; j++) {
                this.facilitiesArray.push({ "fid": facilityid[i], 'fname': facilityName[i], "fimg": "http://localhost:3400/" + facilityName[i] + '.png' })
              }
            }

          }


          var amenityid = this.propertyfa.amenities_id;
          var amenityName = this.propertyfa.amenities;
          var amenityValue = this.propertyfa.amenities_value;
          var amenitiesValue = this.propertyfa.amenities_value;


          if (amenityid != null) {


            for (var i = 0; i < amenityid.length; i++) {
              for (var j = i; j <= i; j++) {

                let amObj: Aminity;
                amObj = new Aminity();
                amObj.id = amenityid[i];
                amObj.amName = amenitiesValue[i];

                this.amArray.push(amObj)

                this.count = 0
                this.amArray.forEach(element => {
                  if (element.id == amenityid[i]) {
                    this.count = this.count + 1;
                    if (this.count == 2) {
                      this.amArray.forEach(element2 => {
                        if (element2.id == amenityid[i]) {
                          let index = this.amArray.indexOf(element2)
                          // console.log(element)
                          this.amArray.splice(index, 1);
                        }
                      })
                      this.amArray.push(amObj)
                      this.count = 0;
                    }
                  }
                });
                // this.amenitiesArrayGet.push({ "aid": amenityid[i], 'avalue': amenitiesValue[i], 'aname': amenityName[i] })
                this.amenitiesArrayGet.push({ "aid": amenityid[i], 'avalue': amenitiesValue[i], 'aname': amenityName[i], "aimg": "http://localhost:3400/" + amenityName[i] + '.png' })
              }
            }
          }
          this.nearlukservice.getCityidbyPropertytype(this.propertydetails[0].propertytype, this.propertydetails[0].statename, this.propertydetails[0].cityname, this.userid, 1).subscribe((data) => {
            this.similarpropertys = data.data;
          })

          this.videoDisplay = 'http://localhost:3400/' + this.propertyId + '.mp4';
        }
      }
    });



  }



  getrecentViwes() {
    let limit = 1
    this.nearlukservice.Getrecentviewdpropertys(this.userid, limit).subscribe((data) => {
      this.recentviewdpropertys = data.data;

    })

  }


  propertyviews(property_view_id) {



    this.nearlukservice.getpropertyviews(property_view_id).subscribe((data) => {


      // alert(JSON.stringify(data))

      if (data.result == false) {
        var res = data.message
      }

      else {

        if (data.data == "NDF") {

          var res = data.message
          // this.propertyviewscount = data.data;
        }

        else {

          this.propertyviewscount = data.data;

          // alert(this.propertyviewscount)


          this.propertylength = this.propertyviewscount.length


        }
      }

    })
  }




  getBidding(propertyid: any, price: any, ownerid: any) {
    if (!this.userid) {
      this.toastr.error('Please login');
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
          this.router.navigate(['login'])
          localStorage.setItem('more', this.propertyId)

        }
      })
    }
    else {

      this.Bidd.ownerid = ownerid;
      this.baseprice = price;
      this.Bidd.propertyid = propertyid;
      this.bidding = true;

      this.nearlukservice.getBidding(propertyid).subscribe((data) => {
        this.bidprice = data.data;

      })
    }

  }



  GetUserDetails(userid: any) {
    this.nearlukservice.detailsforbiding(userid).subscribe((data) => {
      this.details = data.data;
      this.userdetailsbidding = true;
    })
  }




  btnprice(biddingprice: any) {
    if ((biddingprice.value == null) || (biddingprice.value == '')) {
      this.toastr.warning('Please provide bidding price');

    }

    else {
      this.Bidd.biddingprice = biddingprice.value;
      this.Bidd.tenantid = this.userid;

      if (parseInt(this.baseprice) >= parseInt(biddingprice.value)) {
        this.toastr.warning('Bid price should be greater than base price');

      }
      else {
        this.nearlukservice.priceSend(this.Bidd).subscribe((data) => {
          this.toastr.success('Bidded successfully');
          biddingprice.reset()
          this.getBidding(this.propertyId, this.baseprice, this.proportyownerid)

          biddingprice.value = '';

        })

      }
    }
  }

  checkedd(propertyid: any, chk: any) {
    var v1 = 0
    var v2 = 0
    var v3 = 0
    if (localStorage.getItem('compare1') == propertyid) {
      v1 = 1
      v2 = 1
      v3 = 1
    }
    else if (localStorage.getItem('compare2') == propertyid && v2 == 0) {
      v1 = 1
      v2 = 1
      v3 = 1
    }
    else if (localStorage.getItem('compare3') == propertyid && v3 == 0) {

      v1 = 1
      v2 = 1
      v3 = 1
    }
    if (localStorage.getItem('compare1') == null && v1 == 0) {
      this.toastr.success('Added to compare');

      localStorage.setItem('compare1', propertyid);
    }
    else if (localStorage.getItem('compare2') == null && v2 == 0) {
      this.toastr.success('Added to compare');

      localStorage.setItem('compare2', propertyid);
      v2 = 1
    }
    else if (localStorage.getItem('compare3') == null && v3 == 0) {
      this.toastr.success('Added to compare');

      localStorage.setItem('compare3', propertyid);
      v3 = 1
    }
    else if (localStorage.getItem('compare3') != null && localStorage.getItem('compare3') == propertyid) {
      chk.checked = false;
      localStorage.removeItem('compare3');
      this.toastr.success('Removed from compare');

    }
    else if (localStorage.getItem('compare1') != null && localStorage.getItem('compare1') == propertyid) {
      chk.checked = false;
      this.toastr.success('Removed from compare');

      localStorage.removeItem('compare1');
    }
    else if (localStorage.getItem('compare2') != null && localStorage.getItem('compare2') == propertyid) {
      chk.checked = false;
      this.toastr.success('Removed from compare');

      localStorage.removeItem('compare2');
    }
    else {

      chk.checked = false;
      this.toastr.error('Limit exceeded');

    }

  }




  GetSms() {
    this.nearlukservice.getSms(this.userid, this.propertyId).subscribe((data) => {
      //  alert(JSON.stringify(data))
    })

  }

  Loans() {
    this.nearlukservice.getLoans().subscribe((data) => {
      //  alert(JSON.stringify(data))
      //  console.log(JSON.stringify(data))

    })

  }


  Pakcers() {
    this.nearlukservice.getPakcers().subscribe((data) => {
      //  alert(JSON.stringify(data))
      //  console.log(JSON.stringify(data))
    })

  }








  ngOnInit() {
    this.propertyId = this.acr.snapshot.params.propertyid;

    this.moredetails();

    if (sessionStorage.getItem('user') != null) {
      this.nearlukservice.getSectionid(sessionStorage.getItem('user')).subscribe((data) => {
        this.userid = data[0].userid;
        this.roleid = data[0].roleid;
        this.GetSms();

        if (data[0].roleid == 2) {
          this.agents = true;
        }
        else if (data[0].roleid == 0) {

        }
        else {
          this.owner = true;
          // alert(this.owner)
        }
        this.GetComments();
        this.tenanatnotificationsfroagents();
        this.getAddAgent();
        this.getrecentViwes();
        this.Loans();
        this.Pakcers();
      });
    }
    else {
      this.userid = null;

    }

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
  }
}