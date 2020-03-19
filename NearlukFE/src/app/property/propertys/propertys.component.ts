import { Router } from '@angular/router';
import { property } from './../../model/property';
import { Component, OnInit, NgZone } from '@angular/core';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { NearlukService } from 'src/app/services/nearluk.service';
import { Validators, FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { GMapsService } from 'src/app/services/gmaps.service';
import { MapsAPILoader } from '@agm/core';
import { postmap } from 'src/app/model/propertymap';
import swal from 'sweetalert2';
import { ImageCompressService,ResizeOptions,ImageUtilityService, IImage } from 'ng2-image-compress';

class Aminity {
  id: number;
  amName: string;
}
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
declare var google: any;

@Component({
  selector: 'app-propertys',
  templateUrl: './propertys.component.html',
  styleUrls: ['./propertys.component.css']
})
export class PropertysComponent implements OnInit {
  showaddbutton: boolean = true;
  userid: any;



  property: property;
  lat: number = 20.5937;
  lng: number = 78.9629;
  markers: marker[];
  optionPropertyType: any;
  amenitiesGet: any[];
  facilitiesGet: any;
  facilitiesarray: any = [];
  facilitiescount: number;
  amArray: any = [];
  amcount: number;
  count: number;
  uploadFiles: any[] = [];
  isUploadEnable: boolean;
  video: any;
  uploadedFiles: any[] = [];
  displayvideo: boolean;
  propertyvideo: any;
  addbutton: boolean=false;

  preferences:any=[];
  options: any;
  states: any = [];
  cities: any = [];
  area: any = [];
  country: any;
  state: any;
  city: any;
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourFormGroup: FormGroup;
  roleid: any;
  showbutton: boolean;
  minDate: Date;

  maxDate: Date;
  agemonth: boolean = false;
  age: any;
  postmap: postmap;

  selectedImage: any;
  processedImages: any = [];
  showTitle: boolean = false;
  event: any;




  constructor(private nearlukservice: NearlukService, public router: Router, private _formBuilder: FormBuilder, private toastr: ToastrService, private gservice: GMapsService, private __loader: MapsAPILoader, private __zone: NgZone) {

    this.property = new property();
    this.postmap = new postmap();
  }


  bthchange(year: any, month: any) {
    if (year === '12+') {
      this.age == true;
      this.property.age = year
    }
    else {
      if (year === 'Years') {
        year = 0;
        var age = year + '.' + month
        this.property.age = age
      }
      else {
        var age = year + '.' + month
        this.property.age = age
      }

    }

  }


  changepreference(propertyTypeId){


    this.preferences=null;
        this.nearlukservice.GetFeaturesByPropertyType(propertyTypeId.value).subscribe((data)=>{
    
    
    
     
    
          if(data.result==true){
            this.preferences=data.data
          }
    
        })
    // alert( propertyTypeId.value)
    // if(propertyTypeId.value==3){
    //   this.property.preference='BanquetHalls';
    // }
    // else if(propertyTypeId.value==10){
    //   this.property.preference='OfficeSpace';
    // }
    
    // else if(propertyTypeId.value==2||propertyTypeId.value==8||propertyTypeId.value==21){
    //   this.property.preference;
    // }
    // else{
    //   this.property.preference='AnyOther';
    // }
      }


  btnhide(values) {

    var year = values.value
    if (values.value == '12+') {
      this.agemonth = true
      this.property.age = year

    }

    else {
      this.agemonth = false
    }
  }



addProperty() {
  this.showaddbutton=false;
  this.toastr.info('Please wait Images are  Uploading..')


  this.onUpload();
   
  
  }
  


  validateFile(event, file) {

    for (let index = 0; index < event.files.length; index++) {


      if (event.files[index].type == 'video/mp4') {

        this.isUploadEnable = true;

      }
      else {
        this.isUploadEnable = false;

        this.isUploadEnable = true;
        file.remove(event, index);
        this.toastr.error('Please upload .mp4 video only')
      }
    }

  }




  handleAddressChange(address: Address) {


    this.property.latitude = address.geometry.location.lat();
    this.property.longitude = address.geometry.location.lng();


    this.lat = this.property.latitude
    this.lng = this.property.longitude
    let addr = JSON.stringify(address.formatted_address)

    let ad = JSON.parse(addr)
    let cntry = ad.split(/[\s,]+/)
    let country = cntry[cntry.length - 1];

    let geocoder = new google.maps.Geocoder();
    let latlngData = JSON.stringify(address.geometry.location)
    let latValue = JSON.parse(latlngData).lat;
    let lngValue = JSON.parse(latlngData).lng

    this.markers = [{ lat: latValue, lng: lngValue, label: 'A', draggable: true }]


    let latlng = { lat: this.lat, lng: this.lng };
    geocoder.geocode({ 'location': latlng }, (results, status) => {

      let add = results[0].formatted_address;


      var str_array = add.split(',');
      str_array.reverse();
      var str = str_array[1];
      this.postmap.statename = str.replace(/[0-9]/g, '');
      this.postmap.zipcode = str.replace(/[a-z,A-Z]/g, '');
      this.postmap.countryname = str_array[0];
      this.postmap.cityname = str_array[2];
      this.postmap.areaname = str_array[3];




      this.property.pincode = this.postmap.zipcode


      if (str_array.length.length == 3) {
        this.postmap.areaname = this.postmap.cityname
      }
      if (str_array.length.length == 2) {
        this.postmap.areaname = this.postmap.statename
        this.postmap.areaname = this.postmap.cityname
      }
      if (this.postmap.areaname == 'Unnamed Road' || this.postmap.areaname == undefined) {
        this.postmap.areaname = this.postmap.cityname
      }

      if (this.postmap.cityname == 'Unnamed Road' || this.postmap.cityname == undefined) {
        this.postmap.areaname = this.postmap.statename
        this.postmap.cityname = this.postmap.statename
      }

      this.toastr.info('Drag the marker to your location')
      // this.nearlukservice.getaddressidsusingname(this.postmap).subscribe((data) => {

      //   this.property.countryId = data[0].country_id
      //   this.property.stateId = data[0].state_id
      //   this.property.cityId = data[0].city_id
      //   this.property.areaId = data[0].area_id

      //   this.toastr.info('Drag the marker to your location')

      // })


    });

  }

  markerDragEnd(m: marker, $event: any) { //Google Map Marker Dragging code


    let a = $event
    this.property.latitude = $event.coords.lat
    this.property.longitude = $event.coords.lng


    // this.gservice.getLatLanofproperty(this.property.latitude, this.property.longitude)
    let geocoder = new google.maps.Geocoder();
    let latlng = { lat: this.property.latitude, lng: this.property.longitude };
    geocoder.geocode({ 'location': latlng }, (results, status) => {

      let add = results[0].formatted_address;


      var str_array = add.split(',');
      str_array.reverse();
      // console.log(str_array[2]);
      var str = str_array[1];
      // var result = str.split(" ");
      // var statename = result[1]
      // this.country = str_array[0];
      // this.state = statename;
      // this.city = str_array[2];
      // this.area = str_array[3];




      this.postmap.statename = str.replace(/[0-9]/g, '');

      this.postmap.zipcode = str.replace(/[a-z,A-Z]/g, '');

      this.postmap.countryname = str_array[0];
      this.postmap.cityname = str_array[2];
      this.postmap.areaname = str_array[3];



      this.property.pincode = this.postmap.zipcode
      if (str_array.length.length == 3) {
        this.postmap.areaname = this.postmap.cityname
      }
      if (str_array.length.length == 2) {
        this.postmap.areaname = this.postmap.statename
        this.postmap.areaname = this.postmap.cityname
      }
      if (this.postmap.areaname == 'Unnamed Road' || this.postmap.areaname == undefined) {
        this.postmap.areaname = this.postmap.cityname
      }

      if (this.postmap.cityname == 'Unnamed Road' || this.postmap.cityname == undefined) {
        this.postmap.areaname = this.postmap.statename
        this.postmap.cityname = this.postmap.statename
      }


      // this.nearlukservice.getaddressidsusingname(this.postmap).subscribe((data) => {


      //   this.property.countryId = data[0].country_id
      //   this.property.stateId = data[0].state_id
      //   this.property.cityId = data[0].city_id
      //   this.property.areaId = data[0].area_id


      // })


    });



  }


  checkBox(a: any) {    // storing facilities in an facilitiesarray
    this.facilitiesarray = this.facilitiesarray.concat(a)
    this.facilitiescount = 0
    for (let i = 0; i <= this.facilitiesarray.length; i++) {

      if (this.facilitiesarray[i] == a) {
        this.facilitiescount = this.facilitiescount + 1;

        if (this.facilitiescount == 2) {
          let index = this.facilitiesarray.indexOf(a)
          this.facilitiesarray.pop();
          this.facilitiesarray.splice(index, 1);
          this.facilitiescount = 0
        }
      }
    }
  }



  amenity(id: number, a) {   // Storing Aminities in an Array
    let amObj: Aminity;
    amObj = new Aminity();
    amObj.id = id;
    amObj.amName = a.value;


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
  }



  getAmentiesfacilities(propertytypeid) {
    this.amenitiesGet = [];
    this.nearlukservice.getAmenties(propertytypeid.value).subscribe((data) => {
      if (data.result == false) {
        var res = data.message
      }
      else {
        if (data.data == "NDF") {
          var res = data.message
        }
        else {



          this.amenitiesGet = data.data;
        }
      }
    });



    this.facilitiesGet = [];
    this.nearlukservice.getFacilities(propertytypeid.value).subscribe((data) => {

      if (data.result == false) {
        var res = data.message

      }
      else {
        if (data.data == "NDF") {
          var res = data.message
        }
        else {



          data.data.forEach(element => {
            let obj: any = { "fid": element.id, "fname": element.facilityname, "fimg": "http://localhost:3400/" + element.facilityname + '.png' }
            this.facilitiesGet.push(obj);

          });
        }
      }
    })
  }
  imagearray: any[] = [];


  onvideoUpload(event) {

    for (let file of event.files) {

      this.uploadedFiles.push(file);
      let fr = new FileReader()
      fr.readAsDataURL(this.uploadedFiles[0]);
      fr.onload = (evnt: any) => {
        this.propertyvideo = fr.result;
        var formatt = this.propertyvideo.split(';', 1);
        if (formatt == 'data:video/mp4') {
          this.displayvideo = true;
          this.propertyvideo = this.propertyvideo.replace("data:video/mp4;base64,", "")
          this.propertyvideo = this.propertyvideo.replace("data:image/jpeg;base64,", "")
          this.propertyvideo = this.propertyvideo.replace("data:video/x-ms-wmv;base64,", "")

          this.property.videos = this.propertyvideo;
        }
        else {
          this.uploadFiles.pop();

        }

      }
    }
  }


  // onUpload(event) {     //upload Images

  //   for (let file of event.files) {
  //     this.uploadFiles.push(file);
  //   }
  //   for (let i = 0; i < this.uploadFiles.length; i++) {
  //     this.property.image = this.uploadFiles[i];

  //     var reader = new FileReader();
  //     reader.readAsDataURL(this.uploadFiles[i]);   // read file as data url
  //     reader.onload = (ev: any) => {                 // called once readAsDataURL is completed
  //       this.property.image = ev.target.result;
  //       var formatt = this.property.image.split(';', 1);

  //       if (formatt == 'data:image/png;base64' || 'data:image/gif;base64' || 'data:image/jpeg;base64' || 'data:image/jpg;base64') {

  //         this.property.image = this.property.image.replace('data:image/gif;base64,', '')
  //         this.property.image = this.property.image.replace('data:image/jpeg;base64,', '')
  //         this.property.image = this.property.image.replace('data:image/jpg;base64,', '')
  //         this.property.image = this.property.image.replace('data:image/ico;base64,', '')
  //         this.property.image = this.property.image.replace('data:image/svg;base64,', '')
  //         this.property.image = this.property.image.replace('data:image/png;base64,', '')

  //         this.imagearray.push(this.property.image);
  //       }
  //       else {
  //         this.uploadedFiles.pop();
  //         alert("please send only png")

  //       }

  //     }
  //   }

  //   this.showbutton = true;

  // }

  imageFile(event, file) {

    this.isUploadEnable = true;
    this.showaddbutton = false;


    for (let index = 0; index < event.files.length; index++) {


      if (event.files[index].type == '.png||.jpg||.jpeg') {

        this.isUploadEnable = true;
        this.showaddbutton = false;
      }
      else {
        this.isUploadEnable = false;
        this.isUploadEnable = true;

        this.showaddbutton = true;
        file.remove(event, index);
      }
    }

  }



  // onUpload(event) {     //upload Images

  //   for (let file of event.files) {
  //     this.uploadFiles.push(file);
  //     this.isUploadEnable = true;

  //   }
  //   for (let i = 0; i < this.uploadFiles.length; i++) {
  //     this.property.image = this.uploadFiles[i];

  //     this.isUploadEnable = false;
  //     this.showbutton = true;

  //     var reader = new FileReader();
  //     reader.readAsDataURL(this.uploadFiles[i]);   // read file as data url
  //     reader.onload = (ev: any) => {                 // called once readAsDataURL is completed
  //       this.property.image = ev.target.result;
  //       var formatt = this.property.image.split(';', 1);

  //       if (formatt == 'data:image/png;base64' || 'data:image/gif;base64' || 'data:image/jpeg;base64' || 'data:image/jpg;base64') {

  //         this.property.image = this.property.image.replace('data:image/gif;base64,', '')
  //         this.property.image = this.property.image.replace('data:image/jpeg;base64,', '')
  //         this.property.image = this.property.image.replace('data:image/jpg;base64,', '')
  //         this.property.image = this.property.image.replace('data:image/ico;base64,', '')
  //         this.property.image = this.property.image.replace('data:image/svg;base64,', '')
  //         this.property.image = this.property.image.replace('data:image/png;base64,', '')

  //         this.imagearray.push(this.property.image);
  //         this.toastr.success('Images are uploaded')
  //       }
  //       else {
  //         this.uploadedFiles.pop();
  //         this.toastr.error('please send only png')

  //       }

  //     }
  //   }
  //   this.showaddbutton = false;
  // }


  onUpload1(event){
    this.event=event
   
   
     }
     onUpload() {     //upload Images
   
      //  console.log(this.event.files)
   
      
       let images: Array<IImage> = [];
   if(this.event.files.length>0){
     ImageCompressService.filesToCompressedImageSource(this.event.files).then(observableImages => {
       observableImages.subscribe((image) => {
         images.push(image);
       }, (error) => {
         console.log("Error while converting");
       }, () => {
         console.log("E converting");
        
                 this.processedImages = images; 
                //  console.log(images)
                 
   
                 for(var i=0;i<this.processedImages.length;i++){
                  //  console.log(this.processedImages[i].compressedImage.imageDataUrl)
   
                   this.property.image=this.processedImages[i].compressedImage.imageDataUrl
   
                   var formatt = this.property.image.split(';', 1);
   
                   if (formatt == 'data:image/png;base64' || 'data:image/gif;base64' || 'data:image/jpeg;base64' || 'data:image/jpg;base64') {
           
                     this.property.image = this.property.image.replace('data:image/gif;base64,', '')
                     this.property.image = this.property.image.replace('data:image/jpeg;base64,', '')
                     this.property.image = this.property.image.replace('data:image/jpg;base64,', '')
                     this.property.image = this.property.image.replace('data:image/ico;base64,', '')
                     this.property.image = this.property.image.replace('data:image/svg;base64,', '')
                     this.property.image = this.property.image.replace('data:image/png;base64,', '')
           
           
                  
     
           
           
           this.imagearray.push(this.property.image)
   
   
   
           if(this.event.files.length==this.imagearray.length){
            this.toastr.success('Images are uploaded')
   
             this.addbutton=true
   
             this.showaddbutton = false;
             this.isUploadEnable = true;
           
             this.property.userid = this.userid;
             this.property.facilitypost = this.facilitiesarray;
             this.property.amenitypost = this.amArray;
             this.property.image = this.imagearray;
           if(this.userid!=undefined){
           
           
           this.nearlukservice.getaddressidsusingname(this.postmap).subscribe((data) => {
           
           
             this.property.countryId = data[0].country_id
             this.property.stateId = data[0].state_id
             this.property.cityId = data[0].city_id
             this.property.areaId = data[0].area_id
           
           
             // item.v_value.replace('.', '')}}
           
           
           
             // alert(this.property.preference)
             this.nearlukservice.PostProperty(this.property).subscribe(() => {
               this.toastr.success('Successfully posted your property..');
               this.router.navigate(['myproperty']);
             })
           
           })
           
           
           
           }
           else{
           
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
           
           }
           
   
           }
   
   
           
                   
                   }
                   else {
                     this.uploadedFiles.pop();
                     this.toastr.error('please send only png')
           
                   }
                 
                 }
                 this.showTitle = true;          
       });
     });
   }
   else{
     this.toastr.error('Upload Pics')
   }
      
   
   //     for (let file of event.files) {
   //       this.uploadFiles.push(file);
   //       this.isUploadEnable = true;
   
   //     }
   //     for (let i = 0; i < this.uploadFiles.length; i++) {
   //       this.property.image = this.uploadFiles[i];
   
   //       this.isUploadEnable = false;
   //       this.showbutton = true;
   
   //       var reader = new FileReader();
   //       reader.readAsDataURL(this.uploadFiles[i]);   // read file as data url
   //       reader.onload = (ev: any) => {                 // called once readAsDataURL is completed
   //         this.property.image = ev.target.result;
   //         var formatt = this.property.image.split(';', 1);
   
   //         if (formatt == 'data:image/png;base64' || 'data:image/gif;base64' || 'data:image/jpeg;base64' || 'data:image/jpg;base64') {
   
   //           this.property.image = this.property.image.replace('data:image/gif;base64,', '')
   //           this.property.image = this.property.image.replace('data:image/jpeg;base64,', '')
   //           this.property.image = this.property.image.replace('data:image/jpg;base64,', '')
   //           this.property.image = this.property.image.replace('data:image/ico;base64,', '')
   //           this.property.image = this.property.image.replace('data:image/svg;base64,', '')
   //           this.property.image = this.property.image.replace('data:image/png;base64,', '')
   
   // this.options
   // var shiva
   //           // ImageCompressService.compressImage(this.property.image,this.options,shiva).then(observableImages => {
   //           //   observableImages.subscribe((image) => {
   //           //     this.imagearray.push(this.property.image);
         
                
         
            
               
   //           //     // this.imagearray.push(image);
   //           //   }, (error) => {
   //           //     console.log("Error while converting");
   //           //   }, () => {
   //           //             // this.processedImages = images;      
   //           //             this.showTitle = true;          
   //           //   });
   //           // });
   
          
   //           this.toastr.success('Images are uploaded')
   
   
   
   //           // ImageCompressService.IImageListToCompressedImageSource(this.property.image).then(imagesResult => {
   //           //   this.processedImages = imagesResult;
   
   //           //   console.log(this.processedImages)
   //           //  // alert(JSON.stringify(this.processedImages[0].compressedImage.imageDataUrl))
   //           //   // this.img = 1;
   //           //   // this.AddPropertysmodel.images=this.processedImages[0].compressedImage.imageDataUrl
   //           // })
   //         }
   //         else {
   //           this.uploadedFiles.pop();
   //           this.toastr.error('please send only png')
   
   //         }
   
   //       }
   //     }
       this.showaddbutton = false;
     }


     ngDoCheck() {
      if(localStorage.getItem('user')==null){
        localStorage.removeItem('user')
        sessionStorage.removeItem('user')
         this.router.navigate(['/login'])
     
      
      }
          
        }

  ngOnInit() {
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let nextMonth = (month === 11) ? 0 : month + 2;
    let nextYear = (nextMonth === 0) ? year : year;
    this.minDate = new Date();
    this.maxDate = new Date();
    this.maxDate.setMonth(nextMonth);
    this.maxDate.setFullYear(nextYear);
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });
    this.fourFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });


    if (sessionStorage.getItem('user') != null) {
      this.nearlukservice.getSectionid(sessionStorage.getItem('user')).subscribe((data) => {


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



    this.nearlukservice.getPropertyType().subscribe((data) => {//Get Property Type Dropdown
      if (data.result == false) {
        var res = data.message

      }
      else {
        if (data.data == "NDF") {
          var res = data.message
        }
        else {

          this.optionPropertyType = data.data;

        }
      }
    });

    this.nearlukservice.getcountries().subscribe((data) => {
      this.options = data.data

    })

  }


  getStates(country) {
    this.nearlukservice.getStates(country.value).subscribe((data) => {
      this.states = data.data
    })
  }
  getCities(state) {
    this.nearlukservice.getCities(state.value).subscribe((data) => {
      this.cities = data.data
    })
  }
  getAreas(city) {

    this.nearlukservice.getArea(city.value).subscribe((data) => {

      if (data.data != 'NDF') {

        this.area = data.data
      }
    })
  }

}