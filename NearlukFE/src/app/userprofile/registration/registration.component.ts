import { NearlukService } from 'src/app/services/nearluk.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { registration } from 'src/app/model/Registration';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  resendotpbutton: boolean;
  interval;
  timeLeft: number;
  // timeLeftr: number;

  timeer: boolean;
  countryname(arg0: any): any {
    throw new Error("Method not implemented.");
  }
  reg(arg0: any): any {
    throw new Error("Method not implemented.");
  }
  status: any;
  otp: any;
  // isd: any;
  // con: string;
  // location: string;
  register: registration;
  display: boolean;
  mobile: any;
  mobileExist: boolean;
  userExist: boolean;
  displayOtp: boolean;

  constructor(private nearlukservice: NearlukService, private router: Router, private toastr: ToastrService) {
    this.register = new registration();
  }

  cncl() {  //for cancel button
    this.display = false;
    this.router.navigate(['home'])

  }

  ngDoCheck() {
    if(localStorage.getItem('user')==null){
      localStorage.removeItem('user')
      sessionStorage.removeItem('user')
      // this.router.navigate(['/home'])
      this.ngOnInit();
    
    }else{
      this.router.navigate(['/home'])
    }
        
      }

  // ngOnInit() {
  //   this.display = true;
  //   this.nearlukservice.GetDropDownisds(sessionStorage.getItem('country')).subscribe((data) => {
  //     this.register.isd_code = data.data[0].isd_code
  //   })
  // }
  ngOnInit() {

    if (localStorage.getItem('user')) {
      this.router.navigate(['/home'])
    }
    else {
      this.display = true;
      this.nearlukservice.GetDropDownisds(sessionStorage.getItem('country')).subscribe((data) => {
        this.register.isd_code = data.data[0].isd_code
      })
    }
  
  }
  signUpClick(myFrm: any, cpassword: any) {
    this.otpclick(this.register.Password, cpassword);
  }


  makeUserFalse() {
    this.userExist = false;
  }
  makeMobileFalse() {
    this.mobileExist = false;
  }
  otpclick(password: any, cpassword: any) {

    if (password != cpassword.value) {
      this.toastr.error("Password Mismatched...!");
    }
    else {
      this.nearlukservice.getotpMobile(this.register.mobile).subscribe((data) => {

        if (data.result == true) {
          this.toastr.error("Mobile number already exists");
        }
        else {
          this.displayOtp = true;
          this.mobile = this.register.mobile;
          this.nearlukservice.sendotp(this.mobile).subscribe((data) => {
            this.otp = data.Details;
            this.toastr.success("OTP has been sent to your mobile number");
          })
          this.startTimer();
          this.timeer = false
        }
      })
    }
  }

  startTimer() {
    this.timeLeft = 45;

    clearInterval(this.interval)
    this.interval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft == 0) {
        clearInterval(this.interval)
        this.timeer = true
        this.resendotpbutton = true
      }
    }, 1000)
  }

  resentOtp(mobile: any) {
    this.resendotpbutton = false
    this.nearlukservice.sendotp(mobile).subscribe((data) => {
      this.otp = data.Details;

      this.toastr.success("OTP has been sent to your mobile number");
    })
    this.startTimer();
    this.timeer = false
  }



  verifyOtp(otp: any, cpassword: any) {

    if (cpassword.value != this.register.Password) {
      this.toastr.error("Password Mismatched...!");
    }
    else {
      this.nearlukservice.verify(this.otp, otp.value).subscribe((data) => {
        this.status = data.Status
        if (data.Status == "Success") {
          this.nearlukservice.RegisterPost(this.register).subscribe((data) => {
            this.toastr.success("Verified successfully....");
            this.router.navigate(['login'])
          })
        }
        else {
          this.toastr.error('INVALID OTP');
        }
      })
    }
  }

  ngAfterViewInit() {
    this.display = true;
  }

}