
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'
import { NearlukService } from 'src/app/services/nearluk.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changepassword: any;
  confirmpassword: any;
  oldpassword: any;
  sessionUserid: any;
  url: string = "";
  session: string;
  currentsession: string;
  display: boolean = false;
  oldpasswordData: any;
  passwordCheck: Boolean = true;
  message: Boolean = false;


  @ViewChild("changePasswordForm") form: any

  constructor(private router: Router, private ns: NearlukService, private toastr: ToastrService) {

  }
  changePassword() {

    if (this.changepassword == this.confirmpassword) {
      this.ns.changePassword(this.confirmpassword, this.session).subscribe((data) => {
        this.toastr.success('Password changed successfully');

        this.form.reset();

      })
    }
  }

  checkpassword(a: any, b: any) {
    // alert(a+b)
    if (a != b) {
      this.message = true;
    }
    else {
      this.message = false;
    }

  }

  cancle() {
    this.router.navigate(['profile'])
  }
  oldPassword(searchValue: any) {
    //alert('event is'+searchValue)
    this.ns.oldPasswordCheck().subscribe((data) => {
      this.oldpasswordData = data[0]
      //alert(JSON.stringify( this.oldpasswordData))
    })
  }




  updatePassword(chnPwd, pwConfirm) {
    // this.toastr.error('enter old password');
    //alert('in update' +this.passwordCheck)
    /*  alert('old pwd'+JSON.stringify(this.oldpasswordData)) */
    if (pwConfirm.value == chnPwd.value) {
      // alert("OK")

    }
    else {
      // alert("please ")
      this.toastr.error('Password Mismatched');

    }
    if (this.oldpasswordData.password == this.oldpassword) {
      this.passwordCheck = true;
      //alert('this.passwordCheck' + this.passwordCheck)

    }
    else {
      this.passwordCheck = false;
      //alert('please enter data')
      this.toastr.error('Enter Old Password Correctly');
    }
    if (this.changepassword == this.confirmpassword) {
      this.ns.updatePassword(this.confirmpassword, this.currentsession, this.oldpassword).subscribe((data) => {
        if (data.result == true) {
          this.toastr.success('Password change successfully');

        }
        this.form.reset();
      })
    }

  }



  ngOnInit() {
    this.display = true;

    this.session = this.router.url.substring(this.router.url.lastIndexOf("/") + 1)

    this.currentsession = sessionStorage.getItem('user')
  }

}
