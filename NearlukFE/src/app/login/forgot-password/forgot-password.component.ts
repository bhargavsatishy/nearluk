// import { Forgot } from './../../model/login';
// import { Component, OnInit } from '@angular/core';
// import { NearlukService } from 'src/app/services/nearluk.service';
// import { ToastrService } from 'ngx-toastr';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-forgot-password',
//   templateUrl: './forgot-password.component.html',
//   styleUrls: ['./forgot-password.component.css']
// })
// export class ForgotPasswordComponent implements OnInit {
//   forgot: Forgot;
//   display: boolean = false;

//   constructor(private ns: NearlukService, private toastr: ToastrService, private router: Router) {
//     this.forgot = new Forgot();

//   }
//   Forgotpwd(frm: any) {

//     if (this.forgot.email == null || this.forgot.email == undefined) {
//       this.toastr.error('Enter valid email Id');
//     }
//     else {

//       this.ns.fogotPwd(this.forgot).subscribe((data) => {

//         if (data.result == true) {
//           this.toastr.success(data.message);

//         }
//         else if (data.result == false) {
//           this.toastr.error(data.message);


//         }
//         else {

//         }
//         frm.reset()
//       })
//     }


//   }


//   cancle() {
//     this.router.navigate(['login'])

//   }
//   ngOnInit() {
//     this.display = true;
//   }


// }

import { Forgot } from './../../model/login';
import { Component, OnInit } from '@angular/core';
import { NearlukService } from 'src/app/services/nearluk.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  otpvalue: any;
  updatepassshow1: boolean;
  updatepassshow: boolean;
  userid: any;
  status: any;
  otp: any;
  forgot: Forgot;
  display: boolean = false;
  displayOtp: boolean;

  constructor(private ns: NearlukService, private toastr: ToastrService, private router: Router) {
    this.forgot = new Forgot();

  }


  updatepassword(upassword, upassshow1) {
    if (upassword.value == upassshow1.value) {
      this.ns.verifyupdate(this.otp, this.otpvalue, this.userid, upassword.value).subscribe((data) => {
        this.status = data.Status;
        this.router.navigate(['login'])
        //  alert(data.Status)
        //     if (data.Status == "Success") {
        //       this.otpvalue=otp.value;
        // this.updatepassshow=true;
        // this.updatepassshow1=true;
        //     }
        // else {
        //   this.toastr.error('INVALID OTP');
        //   // alert('INVALID OTP')
        // }
      })
    }
  }



  Forgotpwd(frm: any) {
    this.ns.getotpMobile(this.forgot.mobile).subscribe((data) => {
      // alert(JSON.stringify( data))
      //alert(data.data[0].uid)
      this.userid = data.data[0].uid
      //alert(this.userid)
      // alert(JSON.stringify(data.length))
      // if (data.length > 0) {
      //   this.mobileExist = true;
      // }
      // else {
      // this.nearlukservice.RegisterPost(this.reg).subscribe((data) => {
      //   alert("posted successfully....")
      //   this.router.navigate(['login'])
      // })
      // this.displayOtp = true;
      // this.mobile = this.register.mobile;
      // alert(JSON.stringify(data.result))
      if (data.result == true) {
        this.displayOtp = true;
        this.ns.sendotp(this.forgot.mobile).subscribe((data) => {
          // alert(JSON.stringify(data))
          this.otp = data.Details;
          // alert(this.otp)
          this.toastr.success("OTP has been sent to your mobile number");
        })
      }
      else {
        this.toastr.error("Invalid Mobile Number");
      }
      // }
    })
    // if (this.forgot.mobile == null || this.forgot.mobile == undefined) {
    //   this.toastr.error('Enter valid email Id');
    // }
    // else {
    //   this.ns.fogotPwd(this.forgot).subscribe((data) => {
    //     if (data.result == true) {
    //       this.toastr.success(data.message);
    //     }
    //     else if (data.result == false) {
    //       this.toastr.error(data.message);
    //     }
    //     else {
    //     }
    //     frm.reset()
    //   })
    // }
  }

  resentOtp(mobile: any) {
    //alert(mobile)
    this.ns.sendotp(mobile).subscribe((data) => {
      this.otp = data.Details;
    })
  }

  verifyOtp(otp: any) {
    // alert(this.otp)
    //alert(otp.value)
    this.ns.verify(this.otp, otp.value).subscribe((data) => {
      this.status = data.Status
      //  alert(data.Status)
      if (data.Status == "Success") {
        this.otpvalue = otp.value;
        this.updatepassshow = true;
        this.updatepassshow1 = true;
        this.toastr.success('OTP verified successfully..');
      }
      else {
        this.toastr.error('INVALID OTP');
        // alert('INVALID OTP')
      }
    })
  }


  cancle() {
    this.router.navigate(['login'])

  }
  ngOnInit() {
    this.display = true;
  }


}