import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NearlukService } from 'src/app/services/nearluk.service';
import { Profile } from 'src/app/model/Profile';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userData: any = {};
  profile: any;
  isTrue: boolean = true;
  userList: any;
  options: any = []
  url: any
  updateprofile: any
  optionscity: any = []
  optionsstate: any = []

  area: any = [];
  showSpinner: boolean;

  profiledel: boolean = false;

  maxDate = new Date();
  isButtonVisible = true;
  isButtonVisible1 = false;
  isButtonDeVisible: boolean;
  isButtonPending: boolean;

  constructor(private ns: NearlukService, private router: Router, private toastr: ToastrService) {
    this.profile = new Profile();
    this.showSpinner = true;


  }


  userbyUsersession() {

    this.ns.getUserbyUsersession(sessionStorage.getItem('user')).subscribe((data) => {
      if (data.data != 'NDF') {
        this.userData = data.data[0];
        this.url = data.profileimage[0];
        this.profiledel = data.profile;
        this.showSpinner = false;
        if (this.userData.verifymail == "Verified") {
          this.isButtonDeVisible = true;
          this.isButtonVisible = false;
        }
        if (this.userData.verifymail == "NotVerified") {
          this.isButtonVisible = true;
        }
        if (this.userData.verifymail == "Pending") {
          this.isButtonPending = true;
          this.isButtonVisible = false;
        }
        else {
        }
        sessionStorage.setItem('loimage', data.profileimage[0]);
      }
      else {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user')
        this.router.navigate(['login']);
      }
    })
  }



  getUserId() {
    this.isTrue = false;
    this.ns.getStates(250).subscribe((data) => {
      this.optionsstate = data.data;
    });
    this.ns.getCities(this.userData.cityid).subscribe((data) => {

      this.optionscity = data.data;
    });
    this.ns.getArea(this.userData.stateid).subscribe((data) => {
      this.area = data.data
    })
    this.profile.id = this.userData.id;
    this.profile.name = this.userData.username;
    this.profile.email = this.userData.email;
    this.profile.mobile = this.userData.mobile;
    this.profile.address = this.userData.address;
    this.profile.gender = this.userData.gender;
    this.profile.occupation = this.userData.occupation;
    this.profile.dob = this.userData.dob;
    this.profile.area = this.userData.areaid;
    this.profile.city = this.userData.stateid;
    this.profile.state = this.userData.cityid;
    this.profile.country = 250
    this.profile.rolename = this.userData.rolename;
    this.profile.discription = this.userData.discription;
    this.profile.verfiymail = this.userData.verifymail;
  }

  onDelete(a: any) {
    this.profiledel = false;
    this.ns.deleteprofileImages(a, this.userData.id).subscribe((data) => {
      this.url = data.image[0];
      sessionStorage.setItem('loimage', data.image[0]);
    })
  }

  updateuser() {
    this.showSpinner = true;
    this.isTrue = true;
    this.ns.updateUser(this.profile).subscribe((data) => {
      this.toastr.success('Profile updated successfully');
    })

    setTimeout(() => {
      this.showSpinner = false;
      this.userbyUsersession();
    }, 1000)
  }


  Verifymail() {
    this.ns.verifyemail(this.profile.email, this.profile.id).subscribe((data) => {
      this.toastr.success('Please login your email and verify it..!');
      this.userbyUsersession();
    })
    this.userbyUsersession();
  }



  fileSelect(event) { //upload Images
    this.profile.id = this.userData.id;

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (ev: any) => {
      this.profile.image = ev.target.result;
      this.profile.image = this.profile.image.replace('data:image/gif;base64,', '');
      this.profile.image = this.profile.image.replace('data:image/jpeg;base64,', '');
      this.profile.image = this.profile.image.replace('data:image/png;base64,', '');
      this.ns.putProfileImages(this.profile).subscribe((data) => {
        this.toastr.success('Image is uploaded')
      });
    }
  }




  getCities(id: any) {
    this.ns.getCities(id.value).subscribe((data) => {

      this.optionscity = data.data;
    });
  }



  getStates(id: any) {
    this.ns.getStates(id.value).subscribe((data) => {

      this.optionsstate = data.data;
    });
  }



  getAreas(city) {

    this.ns.getArea(city.value).subscribe((data) => {


      this.area = data.data

    })
  }


  ngDoCheck() {
    if(localStorage.getItem('user')==null){
      localStorage.removeItem('user')
      sessionStorage.removeItem('user')
      // this.router.navigate(['/home'])
      this.ngOnInit();
    
    }
        
      }


  // ngOnInit() {
  //   this.router.events.subscribe((evt) => {
  //     if (!(evt instanceof NavigationEnd)) {
  //       return;
  //     }
  //     window.scrollTo(0, 0)
  //   });
  //   if (sessionStorage.getItem('user') != null) {
  //     this.userbyUsersession();
  //     this.ns.getcountries().subscribe((data) => {
  //       this.options.push(data.data[0]);
  //     });
  //   }

  //   else {
  //     sessionStorage.removeItem('user')

  //     this.router.navigate(['login']);
  //   }
  // }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });

    
    if (localStorage.getItem('user') != null) {
      this.userbyUsersession();
      this.ns.getcountries().subscribe((data) => {
        this.options.push(data.data[0]);
      });
    }

    else {
      localStorage.removeItem('user');
      sessionStorage.removeItem('user')

      this.router.navigate(['login']);
    }
  }


}