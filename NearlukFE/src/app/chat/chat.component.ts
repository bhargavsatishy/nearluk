import { Component, OnInit, HostListener, ElementRef, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { NearlukService } from '../services/nearluk.service';
import { Router, ActivatedRoute } from '@angular/router';


import { Observable, interval, timer, Subscription, observable } from 'rxjs';
import { AppComponent } from '../app.component';



@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})

export class ChatComponent implements OnInit {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @HostListener('window:beforeunload', ['$event'])


  public panel: ElementRef<any>;
  userroom: any[] = [];
  propertyid: any;
  chatfresh: any;
  userimg: any;
  userdisplayname: any;
  olduser: any;
  pageYOffset: any;
  cnsid: any;
  @HostListener('window:beforeunload')
  canDeactivate() {




  }

  user: String;
  room: String;
  messageText: String;
  messageArray: Array<{ user: String, message: String, username: string }> = [];

  messageArray1: Array<{ user: String, message: String, username: string }> = [];
  userid: any;
  userid1: any;
  userid2: any;
  roleid: any;

  subscription: Subscription;
  chatmapp: any;
  chatmapp1: any = [];

  chatmapp2: any = [];


  chatmapp3: any = [];
  username: any;

  userstatus: any;
  oldroom: any;


  constructor(private _chatService: NearlukService, public router: Router, private acr: ActivatedRoute, private app: AppComponent) {



    const source = interval(300000);

    this.subscription = source.subscribe(val => this.checkuseronline());


    this._chatService.newUserJoined().subscribe((data) => {
      // this.messageArray.push(data);



      if (data.message != undefined) {
        this.userstatus = 'online'
      } else {
        this.userstatus = 'offline'
      }
    });


    this._chatService.newuserjoinedonlinestatus().subscribe((data) => {



      if (data.user == this.userid2) {
        this.userstatus = "online"
      }


    })

    this._chatService.userleftoffline().subscribe((data) => {




      if (data.user == this.userid2) {
        this.userstatus = "offline"
      }




    });



    this._chatService.newMessageReceivedForNotificationinchat()
      .subscribe((datanoti) => {



        var ccount = 0

        var ncount = false




        if (this.chatmapp1.length == 0) {


          setTimeout(() => {
            this.getchatmap(0);
          }, 4000);


        }



        else {



          this.chatmapp2 = this.chatmapp1

          for (var i = 0; i < this.chatmapp1[0].length; i++) {
            ccount = ccount + 1



            if (this.chatmapp1[0][i].cmsid == datanoti[0].cmsid) {




              var ncount = true
              this.chatmapp2 = this.chatmapp1[0][i]


              this.chatmapp1[0].splice(i, 1)





              if (datanoti[0].cmsid != this.room) {


                this.chatmapp2.ncount = +this.chatmapp2.ncount + 1
              }

              else {


                this.chatmapp2.ncount = this.chatmapp2.ncount
              }










              this.chatmapp1[0].unshift(this.chatmapp2)





            }

            if (this.chatmapp1.length == ccount && ncount == false) {




              setTimeout(() => {
                this.chatmapp1 = [];
                this.getchatusers();
              }, 4000);

            }


          }




        }



      });


    this._chatService.checkuserstatus()
      .subscribe((data) => {





        if (data.message != undefined) {
          this.userstatus = 'online'
        } else {
          this.userstatus = 'offline'
        }
      });




    this._chatService.userLeftRoom()
      .subscribe((data) => {





      });


    this._chatService.newMessageReceived()


      .subscribe((data) => {



        // this.userstatus = 'online'
        this.messageArray.push(data)

      });



  }

  beforeunloadHandler(event) {


    this.app.LogoutClick();
    this._chatService.leaveRoom({ user: this.userid, room: this.oldroom });

    this._chatService.leaveRoomforchat({ user: this.userid });
  }
  ngOnDestroy() {
    this._chatService.leaveRoom({ user: this.userid, room: this.oldroom });

    this._chatService.leaveRoomforchat({ user: this.userid });
    this.subscription.unsubscribe();
  


  }

  join() {

    this.oldroom
    this.userid1 = this.userid


    this._chatService.joinRoom({ user: this.userid, room: this.room, user2: this.userid2 });





  }


  joinuserforchat() {




    this._chatService.joinRoomForNotificationforchat(({ user: this.userid }


    ));


  }
  checkuseronline() {



    if (this.userid2 != null) {
      this._chatService.checkuseronlineornot({


        user1: this.userid, user2: this.userid2, olduser: this.olduser
      });

    }
  }
  leave() {
    this._chatService.leaveRoom({ user: this.userid, room: this.oldroom, olduser: this.olduser });
  }

  sendMessage(mess: any) {

    // this.scrollToBottom(); 


    var chatrun = true
    for (var i = 0; i <= this.chatmapp1[0].length; i++) {



      if (chatrun == true) {



        if (this.chatmapp1[0][i].cmsid == this.room) {

          chatrun = false;

          this.chatmapp2 = this.chatmapp1[0][i]


          this.chatmapp1[0].splice(i, 1)



          this.chatmapp1[0].unshift(this.chatmapp2)



        }
      }




    }


    this._chatService.sendMessage({ user: this.userid, room: this.room, message: this.messageText, user2: this.userid2, fromUsername: this.username, cmsid: this.room });


    this.messageText = null

  


  }


  deletechatnoti(userid: any, cmsid: any) {



    this._chatService.deletechatnoti(userid, cmsid).subscribe((data) => {


    })
  }

  chatopen(user1: any, user2: any, ncount: any, propertyid: any, cmsid: any) {


    this.messageArray = [];
    if (this.userid == user1) {

      this.userid2 = user2;

      this.olduser = user2

      this.checkuseronline();
      this.leave();
    } else {
      this.userid2 = user1;
      this.olduser = user1
      this.checkuseronline();
      this.leave();
    }


    this._chatService.chatMapp(user1, user2, propertyid, sessionStorage.getItem('user')).subscribe((datann) => {




      this.oldroom = datann.room;

      this.room = datann.room;


      for (var i = 0; i < datann.data.length; i++) { this.messageArray.push(datann.data[i]); }


      if (this.chatmapp1.length > 0) {
        for (var i = 0; i < this.chatmapp1[0].length; i++) {



          if (this.chatmapp1[0][i].cmsid == this.room) {


            this.chatmapp1[0][i].ncount = null


            this.userimg = this.chatmapp1[0][i].img


            if (this.chatmapp1[0][i].user1name == this.username) {


              this.userdisplayname = this.chatmapp1[0][i].user2name
            }
            else {
              this.userdisplayname = this.chatmapp1[0][i].user1name
            }

          }


        }
      }



      this.join();

    })




      this.deletechatnoti(this.userid, cmsid);

    


  }

  displayimg(img: any, name: any) {



    this.userimg = img
    this.userdisplayname = name
  }

  getchatmap(value: any) {

 
    if (value == 1) {



      this.chatopen(this.userid, this.userid2, 0, this.propertyid, 0);
      this._chatService.getChatMapp(sessionStorage.getItem('user')).subscribe((data11) => {




        this.chatmapp1[0].push(data11.data);





        this.joinuserforchat();



        setTimeout(() => {

          for (var i = 0; i < this.chatmapp1.length; i++) {



            if (this.chatmapp1[0][i].cmsid == this.room) {


              this.deletechatnoti(this.userid, this.chatmapp1[0][i].cmsid);


              this.chatmapp1[0][i].ncount = null




            }


          }
        }, 2000);



      })
    } else {
      this._chatService.getChatMapp(sessionStorage.getItem('user')).subscribe((data11) => {



        this.joinuserforchat();



        if (data11.data != "NDF") {
          this.chatmapp1.push(data11.data);
        }

      })
    }

  }



  chatfreshopen() {


    this._chatService.chatMapp(this.userid, this.userid2, this.propertyid, sessionStorage.getItem('user')).subscribe((datann) => {

      this.oldroom = datann.room;

      this.room = datann.room;

      this.getchatusers1();

      for (var i = 0; i < datann.data.length; i++) { this.messageArray.push(datann.data[i]); }
      this.joinuserforchat();
      this.join();
    })
  }


  getchatusers1() {
    this._chatService.getChatMapp(sessionStorage.getItem('user')).subscribe((data11) => {



      this.chatmapp1.push(data11.data);
      this.joinuserforchat();

      for (var i = 0; i < this.chatmapp1[0].length; i++) {




        if (this.chatmapp1[0][i].cmsid == this.room) {


          this.deletechatnoti(this.userid, this.chatmapp1[0][i].cmsid);

          this.chatmapp1[0][i].ncount = null


          this.userimg = this.chatmapp1[0][i].img


          if (this.chatmapp1[0][i].user1name == this.username) {


            this.userdisplayname = this.chatmapp1[0][i].user2name
          }
          else {
            this.userdisplayname = this.chatmapp1[0][i].user1name
          }

        }





      }
    })
  }

  getchatusers() {
    this._chatService.getChatMapp(sessionStorage.getItem('user')).subscribe((data11) => {



      this.chatmapp1.push(data11.data);
      this.joinuserforchat();
    })
  }


  ngOnInit() {
    if (sessionStorage.getItem('user') != null) {
      this._chatService.getUserbyUsersession(sessionStorage.getItem('user')).subscribe((data) => {
        this.userid = data.data[0].id;
        this.username = data.data[0].username;
        this.userid2 = this.acr.snapshot.params.userid;
        this.propertyid = this.acr.snapshot.params.propertid;
        if (this.userid2 != null && this.propertyid != null) {

          this.chatfreshopen();



        }

        else {
          this.getchatusers();

        }
      });
    }





    else {
      localStorage.removeItem('user');
      sessionStorage.removeItem('user')

      this.router.navigate(['login']);
    }
  }


  }
