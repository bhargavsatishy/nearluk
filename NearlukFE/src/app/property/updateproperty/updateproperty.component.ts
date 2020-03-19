import { editing } from './../../model/property';
import { Component, OnInit } from '@angular/core';
import { property } from 'src/app/model/property';
import { NearlukService } from '../../services/nearluk.service'
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
class Aminity {
  id: number;
  amName: string;

}
@Component({
  selector: 'app-updateproperty',
  templateUrl: './updateproperty.component.html',
  styleUrls: ['./updateproperty.component.css']
})
export class UpdatepropertyComponent implements OnInit {
  propertyDetailsforUpdate: property;
  propertyId: any;
  property: any;
  rentalPeriod: any;
  propertylocation: property;
  optionPropertyType: any;
  facilitiesGet: any;
  amenitiesGet: any;
  propertyTypeid: any;
  array: any = [];
  count: any;
  amenar: any[] = [];
  facilitiesGetUserSelected: any;
  facilitiesGetUsernotSelected: any;
  fileUpload: any;
  optionsdimensionsunits: any;
  optionCurrency: any;
  imagesdisplay : boolean;
  facilitiesArray: any[] = [];
  facilitiesGet3: any[] = [];
  amenitiesArray: any[] = [];

  amenitiesArrayGet: any[] = [];
  amenitiesUserNotSelected: any;
  amArray: any[] = [];
  // editimg: editimg;
  // img: images;
  uploadFiles: any[] = [];
  dispalayimages: any[];
  username: string;
  displayimages: any[]; userid: any;
  roleid: any;
  ;
  isUploadEnable: boolean;

  imagearray: any[] = [];

  editing: editing;

  constructor(private service: NearlukService, private acr: ActivatedRoute, private router: Router, private toastr: ToastrService) {
    this.property = new property();
    this.propertyDetailsforUpdate = new property();
    this.propertylocation = new property();
    this.editing = new editing();

    // this.editimg = new editimg();
    // this.img = new images();
  }
  checkBox(a: any) {

    this.array = this.array.concat(a)

    this.count = 0
    for (let i = 0; i <= this.array.length; i++) {

      if (this.array[i] == a) {


        this.count = this.count + 1;

        if (this.count == 2) {
          let index = this.array.indexOf(a)
          this.array.pop();
          this.array.splice(index, 1);
          this.count = 0
        }
      }
    }

  }




  onDelete(a: any) {
    var a1 = (a.split("/"))
    a1 = a1.reverse();
    this.editing.path = a1[0]
    this.editing.image = a

    swal({
      title: 'Are you agree to DELETE!',
      text: "",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#17a2b8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Agree'
    }).then((result) => {
      if (result.value) {

        this.service.deleteImages(a1[0], this.propertyId).subscribe((data) => {
          // console.log(data)
          if (data) {
            for (let i = 1; i < this.displayimages.length; i++) {
              if (this.displayimages[i].source == a) {
                this.displayimages.splice(i, 1);
                if (this.displayimages.length == 1) {
                  this.imagesdisplay = true
                }
              }
            }
          }
        })

      }
    })
  }



  amenity(id: number, a) {

    let amObj: Aminity;
    amObj = new Aminity();
    amObj.id = id;
    amObj.amName = a;

    this.amArray.push(amObj)

    this.count = 0
    this.amArray.forEach(element => {
      if (element.id == id) {
        this.count = this.count + 1;
        if (this.count == 2) {
          this.amArray.forEach(element2 => {
            if (element2.id == id) {
              let index = this.amArray.indexOf(element2)
              this.amArray.splice(index, 1);
            }
          })
          this.amArray.push(amObj)
          this.count = 0;
        }
      }
    });
    //alert(JSON.stringify(this.amArray))
  }

  updatePropertyDetails() {

    this.property.image = this.imagearray;
    this.propertyDetailsforUpdate.image = this.imagearray;
    this.propertyDetailsforUpdate.propertyId = this.propertyId
    this.service.deleteFacilitiesAndAmnities(this.propertyId).subscribe((data) => {
      if (this.amArray != null) {
        for (var i = 0; i < this.amArray.length; i++) {
          this.service.addAmenities(this.propertyId, this.amArray[i].id, this.amArray[i].amName).subscribe((data) => {
          });
        }
      }
      if (this.array.length != null) {
        for (var i = 0; i < this.array.length; i++) {
          // alert("faciliotioes" + JSON.stringify(this.array[i]))
          this.service.addFacilities(this.array[i], this.propertyId).subscribe((data) => {
          });
        }
      }
    })
    this.service.updateProperty(this.propertyDetailsforUpdate).subscribe((data) => {
      this.toastr.success('You have successfully updated your property details')
      this.router.navigate(['myproperty']);
    });
  }

  // onUpload(event) {
  //   for (let file of event.files) {
  //     this.uploadFiles.push(file);
  //   }
  //   for (let i = 0; i < this.uploadFiles.length; i++) {
  //     this.property.image = this.uploadFiles[i];
  //     var reader = new FileReader();
  //     reader.readAsDataURL(this.uploadFiles[i]);
  //     reader.onload = (ev: any) => {
  //       this.property.image = ev.target.result;
  //       this.property.image = this.property.image.replace('data:image/gif;base64,', '')
  //       this.property.image = this.property.image.replace('data:image/jpeg;base64,', '')
  //       this.property.image = this.property.image.replace('data:image/png;base64,', '')
  //       this.imagearray.push(this.property.image);
  //     }
  //   }
  // }

  onUpload(event) {
    for (let file of event.files) {
      this.uploadFiles.push(file);
      this.isUploadEnable = false;
    }
    for (let i = 0; i < this.uploadFiles.length; i++) {
      this.isUploadEnable = false;

      this.property.image = this.uploadFiles[i];
      var reader = new FileReader();
      reader.readAsDataURL(this.uploadFiles[i]);
      reader.onload = (ev: any) => {
        this.property.image = ev.target.result;
        this.property.image = this.property.image.replace('data:image/gif;base64,', '')
        this.property.image = this.property.image.replace('data:image/jpeg;base64,', '')
        this.property.image = this.property.image.replace('data:image/png;base64,', '')
        this.imagearray.push(this.property.image);
        this.toastr.success('Images are uploaded')
      }
    }
  }

  imageFile(event, file) {

    for (let index = 0; index < event.files.length; index++) {


      if (event.files[index].type == '.png||.jpg||.jpeg') {

        this.isUploadEnable = true;

      }
      else {
        this.isUploadEnable = false;
        this.isUploadEnable = true;
        file.remove(event, index);
      }
    }

  }






  ngOnInit() {
    this.propertyId = this.acr.snapshot.params.id;
    // alert(this.propertyId)



    if (sessionStorage.getItem('user') != null) {
      this.service.getSectionid(sessionStorage.getItem('user')).subscribe((data) => {


        if (data.length > 0) {
          this.userid = data[0].userid;
          this.roleid = data[0].roleid;
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
    this.service.getPropertyDetailsForUpdate(this.propertyId).subscribe((data) => {

      this.service.GetImages(this.propertyId).subscribe((data) => {
        if(data.length>1){
          this.imagesdisplay =false
        }
        this.displayimages = []
        data.forEach(file => {
          this.displayimages.push({ source: file, alt: 'Description for Image 1', title: '' })
        });
      })




      this.property = data.data[0]
      //alert(JSON.stringify(this.property))
      this.propertyDetailsforUpdate.propertyName = data.data[0].propertyname;
      this.propertyDetailsforUpdate.price = data.data[0].price;
      this.propertyDetailsforUpdate.description = data.data[0].description;
      this.propertyDetailsforUpdate.propertyArea = data.data[0].propertyarea;
      this.propertyDetailsforUpdate.landmarks = data.data[0].landmarks;
      this.propertyDetailsforUpdate.constructionStatus = data.data[0].constructionStatus;
      this.propertyDetailsforUpdate.securityDeposit = data.data[0].securitydeposit;
      this.propertyDetailsforUpdate.maintainanceCost = data.data[0].maintainancecost;
      this.propertyDetailsforUpdate.rentalPeriod = data.data[0].rentalperiod;

      var facilityid = this.property.facilities_id;
      var facilityName = this.property.facilities;
      if (facilityid != '') {

        this.array = this.property.facilities_id
        for (var i = 0; i < facilityid.length; i++) {
          for (var j = i; j <= i; j++) {
            this.facilitiesArray.push({ "fid": facilityid[i], 'fname': facilityName[i], "fimg": "http://localhost:3400/" + facilityName[i] + '.png' })
          }
        }

      }


      var amenityid = this.property.amenities_id;
      var amenityName = this.property.amenities;
      // var amenityValue = this.property.amenities_value;
      var amenitiesValue = this.property.amenities_value;
      this.service.getFacilitiesUserNotSelect(this.propertyId).subscribe((data) => {

        //alert(JSON.stringify(data))
        data.data.forEach(element => {
          let obj: any = { "fid": element.fid, "fname": element.facilityname, "fimg": "http://localhost:3400/" + element.facilityname + '.png' }
          this.facilitiesGet3.push(obj);
          //  alert(JSON.stringify(this.facilitiesGet3))
        });
      })


      this.service.getAmenitiesUserNotSelect(this.propertyId).subscribe((data) => {
        // alert(JSON.stringify(data))
        this.amenitiesUserNotSelected = data.data;
        //alert(JSON.stringify(this.amenitiesUserNotSelected))
      });



      // amenar



      for (var i = 0; i < amenityid.length; i++) {
        this.amenar.push({ "amenid": amenityid[i], "amenname": amenityName[i], "amenvalue": amenitiesValue[i] })
        let amObj: Aminity;
        amObj = new Aminity();
        amObj.id = this.amenar[i].amenid;
        amObj.amName = this.amenar[i].amenvalue;

        this.amArray.push(amObj)
      }


    })

  }
}