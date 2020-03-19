var fs = require('fs')
var path = require('path')
var express = require('express')
var promise = require('bluebird')
var bodyparser = require('body-parser')
var option = {
    promiseLib: promise
};

var rimraf = require("rimraf");
var mail = require('../mailer')


var multer = require('multer');
// var upload = multer({ dest: 'uploads/' })

var propertyRouter = express();
var config = require('../apiconfig')
var conntstr = config.connectionString
const dba = require('../db');
const db = dba.db;
const pgp = db.$config.pgp
const { TwoFactor } = require('@twofactor/sdk');



propertyRouter.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", "Cache-Control,Pragma,Origin,Authorization,Content-Type,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "*");
    return next();
});

propertyRouter.use(bodyparser.json({
    limit: '300mb'
}));
propertyRouter.use(bodyparser.urlencoded({
    limit: '300mb',
    extended: true
}));





propertyRouter.get('/profile/Image/delete/:userid', (req, res, next) => {


    var userid = req.params.userid;
    var imgPath = "./Profile/" + userid;
    rimraf(imgPath, function () {
        res.status(200).send({
            result: true,
            image: ['http://localhost:3400/Profile/NoProfile/noprofile.png'],
            error: "NOERROR",
            message: "Deleted img succesfully"
        })

    });


})

{
    propertyRouter.post('/propertyTypes/Add/', (req, res, next) => {
        var propertyType = req.body.propertyType;
        db.any('select * from fn_addpropertyTypes ($1)', [propertyType]).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "PropertyType added Sucessfully"
                })
            } else {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found"
                })
            }
        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to Add PropertyType"
                })
            })
    })

} {
    propertyRouter.post('/Facility/Add/', (req, res, next) => {
        var facilityName = req.body.facilityName;
        db.any('select * from fn_addFacility($1)', [facilityName]).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "Facility added Sucessfully"
                })
            } else {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found"
                })
            }
        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to Add Facility"
                })
            })
    })
}

{
    propertyRouter.post('/FacilityMapping/Add/', (req, res, next) => {
        var propertyTypeId = req.body.propertyTypeId;
        var facilityId = req.body.facilityId;
        db.any('select * from fn_addFacilityMapping($1, $2)', [propertyTypeId, facilityId]).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "FacilityMapping added Sucessfully"
                })
            } else {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found"
                })
            }
        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to Add FacilityMapping"
                })
            })
    })

}

//PropertyDetails add 


{
    propertyRouter.post('/PropertyDetails/Add/', (req, res, next) => {

        var propertyTypeId = req.body.propertyTypeId;
        parseInt("1000")
        var userid = req.body.userid;
        var propertyName = req.body.propertyName;
        var facing = req.body.facing;
        var price = req.body.price;
        var description = req.body.description;
        var nearlukVerified = "N";
        var status = "Active";


        var dt = new Date();

        let month = dt.getMonth() + 1;

        let date = dt.getDate();
        let hour = dt.getHours();
        let Minutes = dt.getMinutes();
        if (month < 10) {
            month = "0" + month;
        };
        if (date < 10) {
            date = "0" + date;
        };
        if (hour < 10) {
            hour = "0" + hour;
        };
        if (Minutes < 10) {
            Minutes = "0" + Minutes;
        };
        if (month.length === 1) {
            month = "0" + month;
        }
        let posted_date = dt.getFullYear().toString().substr() + '/' + month + '/' + date + '   ' + hour + ':' + Minutes;
        var postedDate = posted_date;
        var propertyArea = req.body.propertyArea;
        var constructionStatus = req.body.constructionStatus;
        var securityDeposit = req.body.securityDeposit;
        var maintainanceCost = req.body.maintainanceCost;
        var rentalPeriod = req.body.rentalPeriod;
        var communityId = req.body.communityId;
        var propertyAmenity = req.body.amenitypost;
        var propertyfacility = req.body.facilitypost;
        var images = req.body.image;
        var video = req.body.videos;
        var addressProofType = req.body.addressProofType;
        var addressProofId = req.body.addressProofId;
        var address = req.body.address;
        var pincode = req.body.pincode;
        var landmarks = req.body.landmarks;
        var countryId = req.body.countryId;
        var stateId = req.body.stateId;
        var cityId = req.body.cityId;
        var areaId = req.body.areaId;
        var age = req.body.age;
        var available = req.body.available;
        var latitude = '' + req.body.latitude;
        var longitude = '' + req.body.longitude;
        var lat = latitude.substring(0, 7);
        var long = longitude.substring(0, 7);
        var iosamenity = req.body.iosamenity;
        var Preference = req.body.preference;


        db.any('select fn_addpropertydetails($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,$15,$16,$17,$18)', [userid, propertyTypeId, propertyName, facing, price, description, nearlukVerified, status, postedDate, propertyArea, constructionStatus, securityDeposit, maintainanceCost, rentalPeriod, communityId, available, age, Preference]).then((data) => {

            var propertyId = data[0].fn_addpropertydetails;
            db.any(' select * from fn_addpropertyaddress($1, $2, $3, $4, $5, $6, $7, $8, $9)', [propertyId, address, pincode, countryId, stateId, cityId, areaId, lat, long]).then((data) => {



            })



            var promise1 = new Promise(function (resolve, reject) {
                resolve('Success!');



                if (iosamenity != null) {



                    if (propertyAmenity != null) {

                        for (i = 0; i < propertyAmenity[0].amName.length; i++) {



                            db.any('select from fn_addAddPropertyAmenities($1,$2,$3)', [propertyId, propertyAmenity[0].id[i], propertyAmenity[0].amName[i]]).then((data) => { })

                        }
                    }

                } else {
                    for (var i = 0; i < propertyAmenity.length; i++) {


                        db.any('select from fn_addAddPropertyAmenities($1,$2,$3)', [propertyId, propertyAmenity[i].id, propertyAmenity[i].amName]).then((data) => { })





                    }
                }






                if (propertyfacility != null) {
                    for (var i = 0; i < propertyfacility.length; i++) {



                        db.any("select * from fn_addAddPropertyFacilities($1,$2)", [propertyId, propertyfacility[i]]).then((data) => { });

                    }
                }

                if (images.length != 0) {

                    var dir = "./Gallery/" + propertyId + "/"
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir)
                        var imgPath = "./Gallery/" + propertyId + "/Images";
                        fs.mkdirSync(imgPath);

                    }

                    var dt = new Date();

                    for (var i = 0; i < images.length; i++) {

                        fName = dt.getFullYear() + '_' + dt.getMonth() + '_' + dt.getDate() + '_' + dt.getHours() + '_' + dt.getMinutes() + '_' + dt.getMilliseconds() + i + ".png";
                        fNameW = path.join('./', 'Gallery/' + propertyId + '/Images/' + fName);

                        fs.writeFile(fNameW, images[i], 'base64', (err) => {
                            if (err)
                                ;
                            else
                                ;

                        })

                    }

                }



                if (video.length > 0 && video[0] != 'nil') {
                    fn = propertyId + '.mp4';
                    cfn = path.join('./', 'videos/' + fn)
                    fs.writeFile(cfn, video, 'base64', err => {
                        if (err) { } else { }
                    })
                }

            });

            promise1.then(function (value) {
                res.status(200).send({
                    result: false,
                    error: "noerror",
                    data: data,
                    message: "Property Added"
                })
            });





        }

        )
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to Add PropertyDetails"
                })
            })
    })

}



{
    propertyRouter.post('/PropertyAmenities/Add/', (req, res, next) => {
        var propertyAmenity = req.body.propertyAmenity;
        db.any('select * from fn_addPropertyAmenities values($2)', [propertyAmenity]).then((data) => {

            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "PropertyAmenties  added Sucessfully"
                })
            } else {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found"
                })
            }
        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to Add PropertyAmenties"
                })


            })
    })

} {

    propertyRouter.post('/AddPropertyAmenities/Add/', (req, res, next) => {
        var propertyId = req.body.propertyId;
        var propertyAmenityId = req.body.propertyAmenityId;
        var amenityValue = req.body.amenityValue;
        db.any(' select * from fn_addAddPropertyAmenities ($1, $2, $3)', [propertyId, propertyAmenityId, amenityValue]).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "PropertyAmenties  added Sucessfully"
                })
            } else {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found"
                })
            }
        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to Add PropertyAmenties"
                })
            })
    })
} {
    propertyRouter.post('/AmenityMapping/Add/', (req, res, next) => {
        var propertyImenityId = req.body.propertyImenityId;
        var propertyTypeId = req.body.propertyTypeId;
        db.any(' select * from fn_addAmenityMapping  values($1, $2)', [propertyImenityId, propertyTypeId]).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "Amentity mapping Sucessfully"
                })
            } else {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found"
                })
            }
        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to Add Amentity Mapping"
                })
            })
    })


}

{

    propertyRouter.post('/PropertyAddress /Add/', (req, res, next) => {
        var propertyId = req.body.propertyId;
        var addressProofType = req.body.addressProofType;
        var addressProofId = req.body.addressProofId;
        var address = req.body.address;
        var pincode = req.body.pincode;
        var landmarks = req.body.landmarks;
        var countryId = req.body.countryId;
        var stateId = req.body.stateId;
        var cityId = req.body.cityId;
        var areaId = req.body.areaId;
        db.any(' select * from fn_addPropertyAddress ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [propertyId, addressProofType, addressProofId, address, pincode, landmarks, countryId, stateId, cityId, areaId]).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "propertyAddress Addded Sucessfully"
                })
            } else {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found"
                })
            }
        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to Add propertyAddress"
                })
            })
    })
} {
    propertyRouter.post('/AddPropertyFacilities/Add/', (req, res, next) => {
        var propertyId = req.body.propertyId;
        var facilityId = req.body.facilityId;
        db.any('select * from fn_addAddPropertyFacilities($1, $2)', [propertyId, facilityId]).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: " AddPropertyFacilities Added Successfully"
                })
            } else {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data AddPropertyFacilities"
                })
            }
        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to Add AddPropertyFacilities"
                })
            })
    })
} {
    propertyRouter.post('/PropertyLikes/Add/', (req, res, next) => {
        var propertyId = req.body.propertyId;
        var userId = req.body.userId;
        var likesStatus = req.body.likesStatus;
        db.any('select * from fn_addPropertyLikes($1, $2, $3)', [propertyId, userId, likesStatus]).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: " PropertyLikes Added Successfully"
                })
            } else {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data PropertyLikes"
                })
            }
        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to Add PropertyLikes"
                })
            })
    })
} {
    propertyRouter.post('/GatedCommunity/Add/', (req, res, next) => {
        var communityName = req.body.communityName;
        var communityDescription = req.body.communityDescription;
        db.any('select * from fn_addGatedCommunity ($1, $2)', [communityName, communityDescription]).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: " GatedCommunity Added Successfully"
                })
            } else {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data GatedCommunity"
                })
            }
        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to Add GatedCommunity"
                })
            })
    })
} {
    propertyRouter.post('/PropertyViews/Add/', (req, res, next) => {
        var propertyId = req.body.propertyId;
        var userId = req.body.userId;
        var date = req.body.date;
        db.any('select * from fn_addPropertyViews($1, $2, $3);', [propertyId, userId, date]).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: " PropertyViews Added Successfully"
                })
            } else {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data PropertyViews"
                })
            }
        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to Add PropertyViews"
                })
            })
    })
}










//getimages
{
    propertyRouter.get('/images/:id', (req, res, next) => {
        var pid = req.params.id
        myPath = path.join('./', 'Gallery/' + pid + '/Images/');
        var arr = [];
        fs.readdir(myPath, (err, files) => {
            if (files) {
                files.forEach(file => {
                    let a = 'http://localhost:3400/' + pid + '/Images/' + file
                    arr.push(a)
                });
                res.send(arr)
            }

        })
    })
}

//get more details



{

    propertyRouter.get("/getmoredetails/:propertyId/:session_id", (req, res, next) => { //get property_facility_mapping by joining on facility based on property_type_id
        var propertyId = req.params.propertyId;
        var arr = [];

        var aid = [];


        var video;
        if (req.params.session_id == 'null') {
            var sessionId = null;
        } else {
            var sessionId = req.params.session_id;
        }


        db.any("select * from fn_getmoredetails($1,$2)", [propertyId, sessionId]).then((data) => {


            // console.log(data)
            var imgcount = [];


            db.any("select count(*) from propertylikes where propertyid=$1 and likesstatus=1", [req.params.propertyId]).then((data2) => {

                if (sessionId != null) {

                    db.any('select ul.userid,r.verifymail from userlogin as ul left join registration as r on r.id = ul.userid where session = $1', sessionId).then((sessiondata) => {

                        if (sessiondata.length > 0) {
                            db.any("select * from rating where propertyid=$1 and userid=$2", [propertyId, sessiondata[0].userid]).then((datarating) => {




                                db.any("select * from propertylikes where propertyid=$1 and likesstatus=1 and userid=$2", [propertyId, sessiondata[0].userid]).then((datalikestatus) => {



                                    db.any("select * from fn_getfav($1,$2)", [sessiondata[0].userid, propertyId]).then((datafav) => {
                                        var fav;
                                        if (datafav.length > 0) {
                                            fav = true;
                                        } else {

                                            fav = false;

                                        }

                                        myPath = path.join('./', 'Gallery/' + propertyId + '/Images/');
                                        var arr = [];
                                        fs.readdir(myPath, (err, files) => {


                                            if (files) {
                                                files.forEach(file => {
                                                    let a = 'http://localhost:3400/' + propertyId + '/Images/' + file
                                                    arr.push(a)



                                                    if (files.length == arr.length) {


                                                        var dir = "./videos/" + propertyId + ".mp4"

                                                        video = "http://localhost:3400/" + propertyId + ".mp4"

                                                        if (sessiondata[0].userid != data[0].userid) {

                                                            mail.notification(data[0].userid, 'Notification', 'Nnformation ', sessiondata[0].userid);
                                                        }

                                                        res.status(200).send({
                                                            result: true,
                                                            error: "NOERROR",
                                                            data: data,
                                                            likes: data2[0].count,
                                                            favorite: fav,
                                                            images: arr,

                                                            likestatus: datalikestatus,
                                                            video: {
                                                                result: fs.existsSync(dir),
                                                                path: "http://localhost:3400/" + propertyId + ".mp4",
                                                                noVideo: "http://localhost:3400/videos/noVideo/novideo.png"
                                                            },

                                                            rating: datarating,
                                                            message: "getmoredetails get succesfully"
                                                        })
                                                    }
                                                });

                                            }

                                        })





                                    })

                                })



                            })
                        } else {
                            myPath = path.join('./', 'Gallery/' + propertyId + '/Images/');
                            var arr = [];
                            fs.readdir(myPath, (err, files) => {
                                if (files) {
                                    files.forEach(file => {
                                        let a = 'http://localhost:3400/' + propertyId + '/Images/' + file
                                        arr.push(a)



                                        if (files.length == arr.length) {
                                            var dir = "./videos/" + propertyId + ".mp4"
                                            res.status(200).send({
                                                result: true,
                                                error: "NOERROR",
                                                data: data,
                                                likes: data2[0].count,
                                                favorite: false,
                                                images: arr,
                                                likestatus: [],
                                                video: {
                                                    result: fs.existsSync(dir),
                                                    path: "http://localhost:3400/" + propertyId + ".mp4",

                                                    noVideo: "http://localhost:3400/videos/noVideo/novideo.png"

                                                },
                                                rating: [],
                                                message: "getmoredetails get succesfully"
                                            })
                                        }
                                    });

                                }

                            })
                        }


                    })
                } else {
                    myPath = path.join('./', 'Gallery/' + propertyId + '/Images/');
                    var arr = [];
                    fs.readdir(myPath, (err, files) => {
                        if (files) {
                            files.forEach(file => {
                                let a = 'http://localhost:3400/' + propertyId + '/Images/' + file
                                arr.push(a)



                                if (files.length == arr.length) {
                                    var dir = "./videos/" + propertyId + ".mp4"

                                    res.status(200).send({
                                        result: true,
                                        error: "NOERROR",
                                        data: data,
                                        likes: data2[0].count,
                                        favorite: false,
                                        images: arr,
                                        likestatus: [],
                                        video: {
                                            result: fs.existsSync(dir),
                                            path: "http://localhost:3400/" + propertyId + ".mp4",
                                            noVideo: "http://localhost:3400/videos/noVideo/novideo.png"

                                        },
                                        rating: [],
                                        message: "getmoredetails get succesfully"
                                    })
                                }
                            });

                        }

                    })
                }



            })
        })

            .catch(error => {

                res.status(404).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "unable to view  getmoredetails"
                })

            })




    })
}







// Get property Types




{
    propertyRouter.get("/getPropertyTypes", (req, res, next) => { //get all property types
        db.any("select * from fn_property_types_select()").then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: " Propertytypes Get Successfully"
                })
            } else {

                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found for getPropertyTypes"
                })
            }

        })

            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to getpropertytypes"
                })
            })
    })
}


{
    propertyRouter.get("/GetAll/GetFeaturedProperties/:name/:userid/:limit", (req, res, next) => {

        var name = req.params.name;

        var limit = (req.params.limit) * 10

        var propertyArray = []

        var userid = req.params.userid;


        if (userid == 'undefined' || userid == undefined || userid == null || userid == 'null') {


            db.any('select * from fn_getfeaturedproperties($1,$2)', [name, limit]).then((data) => {
                db.any("insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:tenant','ITR','INFO','View of Getallproperties Table successfull','tenant',true)").then((log) => {

                    if (data.length > 0) {

                        data.forEach(prop => {
                            myPath = path.join('./', 'Gallery/' + prop.id + '/Images/');
                            fs.readdir(myPath, (err, files) => {

                                if (files == undefined) {


                                    prop['img'] = "http://localhost:3400/no_image.gif"

                                    propertyArray.push(prop)

                                }
                                else {

                                    var latLng = {}
                                    latLng['lat'] = parseFloat(prop.latitude)
                                    latLng['lng'] = parseFloat(prop.longitude)
                                    prop['destination'] = latLng

                                    prop['img'] = "http://localhost:3400/" + prop.id + "/Images/" + files[0]
                                    propertyArray.push(prop)

                                }
                                if (data.length == propertyArray.length) {
                                    res.status(200).send({
                                        result: true,
                                        error: "NOERROR",
                                        data: propertyArray,
                                        message: "Get all property details succesfully"
                                    })
                                }
                            })

                        })

                    }
                    else {
                        res.status(200).send(data);
                    }
                })
            })

                .catch(error => {
                    db.any("insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:Institute','ITR','ERR','View of Getallproperties Table successfull','tenant',False)").then((log) => {

                        res.status(200).send({
                            message: " Unable to View Properties"
                        });
                    });
                })
        }
        else {
            db.any('select * from fn_getfeaturedpropertiesbyuserid($1,$2,$3)', [name, userid, limit]).then((data) => {

                db.any("insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:tenant','ITR','INFO','View of Getallproperties Table successfull','tenant',true)").then((log) => {



                    if (data.length > 0) {
                        data.forEach(prop => {
                            myPath = path.join('./', 'Gallery/' + prop.id + '/Images/');
                            fs.readdir(myPath, (err, files) => {

                                if (files == undefined) {


                                    prop['img'] = "http://localhost:3400/no_image.gif"

                                    propertyArray.push(prop)

                                }
                                else {

                                    var latLng = {}
                                    latLng['lat'] = parseFloat(prop.latitude)
                                    latLng['lng'] = parseFloat(prop.longitude)
                                    prop['destination'] = latLng

                                    prop['img'] = "http://localhost:3400/" + prop.id + "/Images/" + files[0]
                                    propertyArray.push(prop)

                                }
                                if (data.length == propertyArray.length) {
                                    res.status(200).send({
                                        result: true,
                                        error: "NOERROR",
                                        data: propertyArray,
                                        message: "Get all property details succesfully"
                                    })
                                }
                            })

                        })

                    }
                    else {
                        res.status(200).send(data);
                    }
                })
            })
                .catch(error => {
                    db.any("insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:Institute','ITR','ERR','View of Getallproperties Table successfull','tenant',False)").then((log) => {

                        res.status(200).send({
                            message: " Unable to View Properties"
                        });
                    });
                })
        }


    })


}


{
    propertyRouter.get("/GetFeaturedProperties", (req, res, next) => {     //get all property types

        db.any(`select count(preference),preference   from propertydetails pd
        where preference in('Bachelors','Families','Gated Community','OfficeSpaces','Banquet halls','Hostels PG','Sharing Spaces') and status='Active'
       group by pd.preference`).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "Get GetFeturedProperties"
                })
            }
            else {

                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found for GetFeturedProperties"
                })
            }


        })

            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to GetFeturedProperties"
                })
            })
    })
}






// get propertyamenities by propertytypeid
{
    propertyRouter.get("/getPropertyAmenitiesByPropertyTypeId/:propertyTypeId", (req, res, next) => { //get propertytype_amenity_mapping by joining property_amenities based on property_type_id


        var propertyTypeId = req.params.propertyTypeId;
        // var db = pgr(conntstr);
        db.any("SELECT * FROM fn_getamenitysbypropertytype($1)", propertyTypeId).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "getPropertyAmenitiesByPropertyTypeId get succesfully"

                })
            } else {

                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found for getPropertyAmenitiesByPropertyTypeId"
                })

            }

        })
            .catch(error => {

                db.any("insert into domainlogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:  nearluk','ITR','ERR','unable to view  getPropertyAmenitiesByPropertyTypeId','nearluk',FALSE)").then((log) => {
                    res.status(404).send({
                        result: false,
                        error: error.message,
                        data: "ERROR",
                        message: "unable to view  getPropertyAmenitiesByPropertyTypeId"
                    })

                })
            })
    })
}
// get property facilitis by propertytypeid
{


    propertyRouter.get("/getPropertyFacilitiesByPropertyTypeId/:propertyTypeId", (req, res, next) => { //get property_facility_mapping by joining on facility based on property_type_id
        var propertyTypeId = req.params.propertyTypeId;
        // var db = pgr(conntstr);
        db.any("select * from fn_getfacilitiesbypropertytype($1)", propertyTypeId).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "getPropertyFacilitiesByPropertyTypeId get succesfully"
                })
            } else {

                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found for getPropertyFacilitiesByPropertyTypeId"
                })
            }

        })

            .catch(error => {

                res.status(404).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "unable to view  getPropertyFacilitiesByPropertyTypeId"
                })

            })

    })
}


{
    propertyRouter.get("/getProperty/:userid/:limit", (req, res, next) => { //get propertytype_amenity_mapping by joining property_amenities based on property_type_id

        var propertyArray = []
        var userid = req.params.userid;
        var limit = (req.params.limit) * 10;

        // var db = pgr(conntstr);
        db.any("SELECT * FROM fn_getmyproperty1($1,$2)", [userid, limit]).then((data) => {


            db.any("insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:tenant','ITR','INFO','View of Getallproperties Table successfull','tenant',true)").then((log) => {



                if (data.length > 0) {
                    data.forEach(prop => {
                        myPath = path.join('./', 'Gallery/' + prop.id + '/Images/');
                        fs.readdir(myPath, (err, files) => {

                            if (files == undefined) {


                                prop['img'] = "http://localhost:3400/no_image.gif"

                                propertyArray.push(prop)

                            } else {

                                var latLng = {}
                                latLng['lat'] = parseFloat(prop.latitude)
                                latLng['lng'] = parseFloat(prop.longitude)
                                prop['destination'] = latLng

                                prop['img'] = "http://localhost:3400/" + prop.id + "/Images/" + files[0]
                                propertyArray.push(prop)

                            }
                            if (data.length == propertyArray.length) {
                                res.status(200).send({
                                    result: true,
                                    error: "NOERROR",
                                    data: propertyArray,
                                    message: "Get all property details succesfully"
                                })
                            }
                        })

                    })

                } else {
                    res.status(200).send(data);
                }
            })
        })
            .catch(error => {
                db.any("insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:Institute','ITR','ERR','View of Getallproperties Table successfull','tenant',False)").then((log) => {

                    res.status(200).send({
                        message: " Unable to View Properties"
                    });
                });
            })
    })


}



{
    propertyRouter.get("/getPropertynew/:userid/:limit", (req, res, next) => { //get propertytype_amenity_mapping by joining property_amenities based on property_type_id

        var propertyArray = []
        var userid = req.params.userid;
        var limit = 8;
        var offset = (req.params.limit) * 8

        // var db = pgr(conntstr);
        db.any("SELECT * FROM fn_getmyproperty1new($1,$2,$3)", [userid, limit, offset]).then((data) => {


            db.any("insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:tenant','ITR','INFO','View of Getallproperties Table successfull','tenant',true)").then((log) => {



                if (data.length > 0) {
                    data.forEach(prop => {
                        myPath = path.join('./', 'Gallery/' + prop.id + '/Images/');
                        fs.readdir(myPath, (err, files) => {

                            if (files == undefined) {


                                prop['img'] = "http://localhost:3400/no_image.gif"

                                propertyArray.push(prop)

                            } else {

                                var latLng = {}
                                latLng['lat'] = parseFloat(prop.latitude)
                                latLng['lng'] = parseFloat(prop.longitude)
                                prop['destination'] = latLng

                                prop['img'] = "http://localhost:3400/" + prop.id + "/Images/" + files[0]
                                propertyArray.push(prop)

                            }
                            if (data.length == propertyArray.length) {
                                res.status(200).send({
                                    result: true,
                                    error: "NOERROR",
                                    data: propertyArray,
                                    message: "Get all property details succesfully"
                                })
                            }
                        })

                    })

                } else {
                    res.status(200).send(data);
                }
            })
        })
            .catch(error => {
                db.any("insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:Institute','ITR','ERR','View of Getallproperties Table successfull','tenant',False)").then((log) => {

                    res.status(200).send({
                        message: " Unable to View Properties"
                    });
                });
            })
    })


}

{
    propertyRouter.get('/property/getcountry', (req, res, next) => {

        db.any("select * from fn_getallcountries()").then((data) => {

            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "get country works"
                })
            } else {

                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found country"
                })
            }

        })

            .catch(error => {

                res.status(404).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "unable to view  country"
                })

            })
    })


}

{
    propertyRouter.get('/getstates/:id', (req, res, next) => {
        var id = req.params.id

        db.any("select * from fn_getallstatesbycountry($1)", [id]).then((data) => {

            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "get country works"
                })
            } else {

                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found country"
                })
            }

        })

            .catch(error => {

                res.status(404).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "unable to view  country"
                })

            })
    })

}


{
    propertyRouter.get('/getarea/:id', (req, res, next) => {
        var id = req.params.id

        db.any("select * from fn_getallareasbycity($1)", [id]).then((data) => {

            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "get country works"
                })
            } else {

                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found country"
                })
            }

        })

            .catch(error => {

                res.status(404).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "unable to view  country"
                })

            })
    })

}




{
    propertyRouter.get('/getmorepropertys/:property_type/:statename/:cityname/:userid/:page', (req, res, next) => {
        var propertyArray = [];
        var page = (req.params.page) * 10
        var proptype = req.params.property_type;
        var statename = req.params.statename.trim();
        var cityname = req.params.cityname.trim();
        var userId = req.params.userid;
        if ((statename == "undefined" || statename == undefined) && (cityname == "undefined" || cityname == undefined)) {
            if (userId == 'undefined' || userId == undefined || userId == null || userId == 'null') {
                db.any('select * from fn_viewAllwithoutLocation($1,$2)', [proptype, page]).then((data) => {
                    if (data.length > 0) {
                        data.forEach(prop => {
                            myPath = path.join('./', 'Gallery/' + prop.propertyid + '/Images/');
                            fs.readdir(myPath, (err, files) => {

                                if (files == undefined) {

                                    prop['img'] = "http://localhost:3400/no_image.gif"

                                    propertyArray.push(prop)

                                } else {

                                    prop['img'] = "http://localhost:3400/" + prop.propertyid + "/Images/" + files[0]
                                    propertyArray.push(prop)

                                }
                                if (data.length == propertyArray.length) {
                                    res.status(200).send({
                                        result: true,
                                        error: "NOERROR",
                                        data: propertyArray,
                                        message: "Get all property details succesfully"
                                    })
                                }
                            })

                        })

                    }

                })
                    .catch(error => {
                        res.status(404).send({
                            result: false,
                            error: error.message,
                            data: "ERROR",
                            message: "unable to view country"
                        })

                    })
            }


            else {
                db.any('select * from fn_viewallwithoutlocationuserid($1,$2,$3)', [proptype, userId, page]).then((data) => {
                    if (data.length > 0) {
                        data.forEach(prop => {
                            myPath = path.join('./', 'Gallery/' + prop.propertyid + '/Images/');
                            fs.readdir(myPath, (err, files) => {

                                if (files == undefined) {

                                    prop['img'] = "http://localhost:3400/no_image.gif"

                                    propertyArray.push(prop)

                                } else {

                                    prop['img'] = "http://localhost:3400/" + prop.propertyid + "/Images/" + files[0]
                                    propertyArray.push(prop)

                                }
                                if (data.length == propertyArray.length) {
                                    res.status(200).send({
                                        result: true,
                                        error: "NOERROR",
                                        data: propertyArray,
                                        message: "Get all property details succesfully"
                                    })
                                }
                            })

                        })

                    }

                })
                    .catch(error => {
                        res.status(404).send({
                            result: false,
                            error: error.message,
                            data: "ERROR",
                            message: "unable to view country"
                        })

                    })
            }
        }

        else if ((statename != undefined || statename != "undefined") && (cityname != undefined || cityname != "undefined")) {
            db.any("select * from fn_getCityId($1,$2,$3)", [proptype, statename, cityname]).then((data) => {
                if (data.length > 0) {
                    var cityid = data[0].city_id
                    if (userId == 'undefined' || userId == undefined || userId == null || userId == 'null') {
                        db.any('select * from fn_getPropertynameByCityId1($1,$2,$3)', [cityid, proptype, page]).then((data) => {
                            if (data.length > 0) {
                                data.forEach(prop => {
                                    myPath = path.join('./', 'Gallery/' + prop.propertyid + '/Images/');
                                    fs.readdir(myPath, (err, files) => {

                                        if (files == undefined) {

                                            prop['img'] = "http://localhost:3400/no_image.gif"

                                            propertyArray.push(prop)

                                        } else {

                                            prop['img'] = "http://localhost:3400/" + prop.propertyid + "/Images/" + files[0]
                                            propertyArray.push(prop)

                                        }
                                        if (data.length == propertyArray.length) {
                                            res.status(200).send({
                                                result: true,
                                                error: "NOERROR",
                                                data: propertyArray,
                                                message: "Get all property details succesfully"
                                            })
                                        }
                                    })

                                })

                            }

                        })
                    }
                    else {
                        db.any('select * from fn_getpropertynamebycityiduserid1($1,$2,$3,$4)', [cityid, proptype, userId, page]).then((data) => {
                            if (data.length > 0) {
                                data.forEach(prop => {
                                    myPath = path.join('./', 'Gallery/' + prop.propertyid + '/Images/');
                                    fs.readdir(myPath, (err, files) => {

                                        if (files == undefined) {

                                            prop['img'] = "http://localhost:3400/no_image.gif"

                                            propertyArray.push(prop)

                                        } else {

                                            prop['img'] = "http://localhost:3400/" + prop.propertyid + "/Images/" + files[0]
                                            propertyArray.push(prop)

                                        }
                                        if (data.length == propertyArray.length) {
                                            res.status(200).send({
                                                result: true,
                                                error: "NOERROR",
                                                data: propertyArray,
                                                message: "Get all property details succesfully"
                                            })
                                        }
                                    })

                                })

                            }

                        })
                    }


                }
                else {
                    res.status(200).send({
                        result: false,
                        error: "NOERROR",
                        data: "NDF",
                        message: "No Data Found country"
                    })
                }

            })


                .catch(error => {
                    res.status(404).send({
                        result: false,
                        error: error.message,
                        data: "ERROR",
                        message: "unable to view country"
                    })

                })
        }





    })

}



{
    propertyRouter.get('/getmorepropertysnew/:property_type/:statename/:cityname/:userid/:page', (req, res, next) => {
        var propertyArray = [];
        var offset = (req.params.page) * 8
        var page = 8;
        var proptype = req.params.property_type;
        var statename = req.params.statename.trim();
        var cityname = req.params.cityname.trim();
        var userId = req.params.userid;
        if ((statename == "undefined" || statename == undefined) && (cityname == "undefined" || cityname == undefined)) {
            if (userId == 'undefined' || userId == undefined || userId == null || userId == 'null') {
                db.any('select * from fn_viewAllwithoutLocationnew($1,$2,$3)', [proptype, page, offset]).then((data) => {
                    if (data.length > 0) {
                        data.forEach(prop => {
                            myPath = path.join('./', 'Gallery/' + prop.propertyid + '/Images/');
                            fs.readdir(myPath, (err, files) => {

                                if (files == undefined) {

                                    prop['img'] = "http://localhost:3400/no_image.gif"

                                    propertyArray.push(prop)

                                } else {

                                    prop['img'] = "http://localhost:3400/" + prop.propertyid + "/Images/" + files[0]
                                    propertyArray.push(prop)

                                }
                                if (data.length == propertyArray.length) {
                                    res.status(200).send({
                                        result: true,
                                        error: "NOERROR",
                                        data: propertyArray,
                                        message: "Get all property details succesfully"
                                    })
                                }
                            })

                        })

                    }

                })
                    .catch(error => {
                        res.status(404).send({
                            result: false,
                            error: error.message,
                            data: "ERROR",
                            message: "unable to view country"
                        })

                    })
            }


            else {
                db.any('select * from fn_viewallwithoutlocationuseridnew($1,$2,$3,$4)', [proptype, userId, page, offset]).then((data) => {
                    if (data.length > 0) {
                        data.forEach(prop => {
                            myPath = path.join('./', 'Gallery/' + prop.propertyid + '/Images/');
                            fs.readdir(myPath, (err, files) => {

                                if (files == undefined) {

                                    prop['img'] = "http://localhost:3400/no_image.gif"

                                    propertyArray.push(prop)

                                } else {

                                    prop['img'] = "http://localhost:3400/" + prop.propertyid + "/Images/" + files[0]
                                    propertyArray.push(prop)

                                }
                                if (data.length == propertyArray.length) {
                                    res.status(200).send({
                                        result: true,
                                        error: "NOERROR",
                                        data: propertyArray,
                                        message: "Get all property details succesfully"
                                    })
                                }
                            })

                        })

                    }

                })
                    .catch(error => {
                        res.status(404).send({
                            result: false,
                            error: error.message,
                            data: "ERROR",
                            message: "unable to view country"
                        })

                    })
            }
        }

        else if ((statename != undefined || statename != "undefined") && (cityname != undefined || cityname != "undefined")) {
            db.any("select * from fn_getCityId($1,$2,$3)", [proptype, statename, cityname]).then((data) => {
                if (data.length > 0) {
                    var cityid = data[0].city_id
                    if (userId == 'undefined' || userId == undefined || userId == null || userId == 'null') {
                        db.any('select * from fn_getPropertynameByCityId1new($1,$2,$3,$4)', [cityid, proptype, page, offset]).then((data) => {
                            if (data.length > 0) {
                                data.forEach(prop => {
                                    myPath = path.join('./', 'Gallery/' + prop.propertyid + '/Images/');
                                    fs.readdir(myPath, (err, files) => {

                                        if (files == undefined) {

                                            prop['img'] = "http://localhost:3400/no_image.gif"

                                            propertyArray.push(prop)

                                        } else {

                                            prop['img'] = "http://localhost:3400/" + prop.propertyid + "/Images/" + files[0]
                                            propertyArray.push(prop)

                                        }
                                        if (data.length == propertyArray.length) {
                                            res.status(200).send({
                                                result: true,
                                                error: "NOERROR",
                                                data: propertyArray,
                                                message: "Get all property details succesfully"
                                            })
                                        }
                                    })

                                })

                            }

                        })
                    }
                    else {
                        db.any('select * from fn_getpropertynamebycityiduserid1new($1,$2,$3,$4,$5)', [cityid, proptype, userId, page, offset]).then((data) => {
                            if (data.length > 0) {
                                data.forEach(prop => {
                                    myPath = path.join('./', 'Gallery/' + prop.propertyid + '/Images/');
                                    fs.readdir(myPath, (err, files) => {

                                        if (files == undefined) {

                                            prop['img'] = "http://localhost:3400/no_image.gif"

                                            propertyArray.push(prop)

                                        } else {

                                            prop['img'] = "http://localhost:3400/" + prop.propertyid + "/Images/" + files[0]
                                            propertyArray.push(prop)

                                        }
                                        if (data.length == propertyArray.length) {
                                            res.status(200).send({
                                                result: true,
                                                error: "NOERROR",
                                                data: propertyArray,
                                                message: "Get all property details succesfully"
                                            })
                                        }
                                    })

                                })

                            }

                        })
                    }


                }
                else {
                    res.status(200).send({
                        result: false,
                        error: "NOERROR",
                        data: "NDF",
                        message: "No Data Found country"
                    })
                }

            })


                .catch(error => {
                    res.status(404).send({
                        result: false,
                        error: error.message,
                        data: "ERROR",
                        message: "unable to view country"
                    })

                })
        }





    })

}




{
    propertyRouter.get('/getcities/:id', (req, res, next) => {
        var id = req.params.id

        db.any("select * from fn_getallcitysbystate($1)", [id]).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "get country works"
                })
            } else {

                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found country"
                })
            }

        })

            .catch(error => {

                res.status(404).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "unable to view  country"
                })

            })
    })
}

{
    propertyRouter.post('/forum', (req, res, next) => {
        var propertyid = req.body.propertyid;
        var userid = req.body.userid;
        var rating = req.body.rating;
        var comments = req.body.comments;
        var dt = new Date();
        let month = dt.getMonth() + 1;

        let date = dt.getDate();
        let hour = dt.getHours();
        let Minutes = dt.getMinutes();
        if (month <= 10) {
            month = "0" + month;
        };
        if (date <= 10) {
            date = "0" + date;
        };
        if (hour <= 10) {
            hour = "0" + hour;
        };
        if (Minutes <= 10) {
            Minutes = "0" + Minutes;
        };

        if (month.length === 1) {
            month = "0" + month;
        }

        let comment_date = dt.getFullYear().toString().substr() + '/' + month + '/' + date + '   ' + hour + ':' + Minutes;


        db.any("select * from fn_addrating($1,$2,$3,$4)", [propertyid, rating, userid, comments]).then((data) => {
            res.send({
                message: " inserted...."
            })
        })
    })
}


{
    propertyRouter.get('/getcomments/:propertyid', (req, res, next) => {
        propertyid = req.params.propertyid;
        var propertyArray = []


        db.any("select * from fn_getallcomments($1)", [propertyid]).then((data) => {
            db.any("insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:tenant','ITR','INFO','View of Getallproperties Table successfull','tenant',true)").then((log) => {


                if (data.length > 0) {
                    data.forEach(prop => {

                        myPath = path.join('./', 'Profile/' + prop.userid + '/');
                        fs.readdir(myPath, (err, files) => {

                            if (files == undefined) {


                                prop['img'] = "http://localhost:3400/Profile/NoProfile/noprofile.png"

                                propertyArray.push(prop)

                            } else {

                                prop['img'] = "http://localhost:3400/" + prop.userid + "/" + files[0]
                                propertyArray.push(prop)

                            }
                            if (data.length == propertyArray.length) {

                                res.status(200).send({
                                    result: true,
                                    error: "NOERROR",
                                    data: propertyArray,
                                    message: "Get Review succesfully"
                                })
                            }
                        })

                    })

                } else {
                    res.status(200).send(data);
                }
            })
        })
            .catch(error => {
                db.any("insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:Institute','ITR','ERR','View of Getallproperties Table successfull','tenant',False)").then((log) => {
                    res.status(200).send({
                        message: " Unable to View Owner Detyails"
                    });
                });
            })
    })
}


{
    propertyRouter.get('/getcommentbyid/:propertyid/:userid', (req, res, next) => {
        propertyid = req.params.propertyid;
        userid = req.params.userid;

        db.any("select * from rating where propertyid=$1 and userid=$2", [propertyid, userid]).then((data) => {
            res.send(data)
        })

    })

}


{
    propertyRouter.get("/getPropertyDetailsforUpdate/:property_id", (req, res, next) => {


        //get property_facility_mapping by joining on facility based on property_type_id
        var property_id = req.params.property_id;

        db.any("select t1.*,t2.*,t3.* from(select oap.userid, oap.id, oap.propertyname,oap.facing,oap.price,oap.propertytypeid, oap.maintainancecost,oap.rentalperiod,oap.securitydeposit,oap.description,oap.nearlukverified, oap.status,oap.posteddate,oap.propertyarea,oap.constructionstatus, oap.rentalperiod,pt.propertytype,array_to_json(array_agg(f.facilityname)) as facilities,array_to_json(array_agg(f.id)) as facilities_id from propertydetails oap left outer join PropertyTypes pt on oap.propertytypeid = pt.id left outer join addpropertyfacilities ppf on ppf.propertyid=oap.id  left outer join facility f on f.id=ppf.facilityid group by  oap.id,pt.propertytype)as t1 left outer join (select oap.id,array_to_json(array_agg(pam.propertyamenity)) as amenities, (array_agg(pam.id)) as amenities_id,(array_agg(ppm.amenityvalue)) as  amenities_value from propertydetails oap left outer join addPropertyAmenities ppm on ppm.propertyid=oap.id join propertyamenities pam on pam.id=ppm.propertyamenityid group by oap.id) as t2 on t1.id=t2.id left outer join (select distinct pa.*,c.cityname,co.countryname, s.statename,a.areaname from propertyaddress pa left outer join city c on c.id=pa.cityid  left outer join country co on co.id=pa.countryid left outer join state s on s.id=pa.stateid left outer join area a on a.id=pa.areaid)as t3 on t3.propertyid=t1.id  where t1.id=$1", property_id).then((data) => {

            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "getPropertyDetailsforUpdate  Sucessfully"
                })
            } else {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found"
                })
            }
        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to get getPropertyDetailsforUpdate"
                })
            })

    });
} {
    propertyRouter.get("/getPropertyFacilitiesByPropertyIdUsernotselected/:propertyId", (req, res, next) => { //get property_facility_mapping by joining on facility based on property_type_id
        var propertyId = req.params.propertyId;

        db.any(" select * from fn_getFacilitiesnotselectbyowner($1)", propertyId).then((data) => {

            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "getPropertyFacilitiesByPropertyIdUsernotselected  Sucessfully"
                })
            } else {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found"
                })
            }
        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to get getPropertyFacilitiesByPropertyIdUsernotselected"
                })
            })

    });
} {
    propertyRouter.get("/getPropertyAmenitiesByPropertyIdUsernotselected/:propertyId", (req, res, next) => { //get property_facility_mapping by joining on facility based on property_type_id
        var propertyId = req.params.propertyId;

        db.any(" select * from fn_getAminitiesnotselectbyowner($1)", propertyId).then((data) => {

            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "getPropertyAmenitiesByPropertyIdUsernotselected  Sucessfully"
                })
            } else {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found"
                })
            }
        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to get getPropertyAmenitiesByPropertyIdUsernotselected"
                })
            })


    });
}







{
    propertyRouter.get('/deleteImage/:image/:property_id', (req, res, next) => {


        var image = req.params.image;
        var property_id = req.params.property_id;



        var imgPath = "./Gallery/" + property_id + "/Images/" + image;

        fs.unlinkSync(imgPath);
        res.status(200).send({
            result: true,
            error: "NOERROR",
            message: "Deleted img succesfully"
        })
    })
}




{
    propertyRouter.delete('/deleteFacilitiesAndAmnities/:property_id', (req, res, next) => {
        var property_id = req.params.property_id;

        db.any('select fn_post_property_amenities_facilities_delete($1)', [property_id]).then((data) => {

            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "deleteFacilitiesAndAmnities works"
                })
            } else {

                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found deleteFacilitiesAndAmnities"
                })
            }

        })

            .catch(error => {

                res.status(404).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "unable to view  deleteFacilitiesAndAmnities"
                })

            })



    })




} {
    propertyRouter.post('/amenitiesPost/:propertyId/:amenityId/:amenityValue', function (req, res) { //insert into post_property_amenities
        var property_id = req.params.propertyId;
        var amenityId = req.params.amenityId;
        var amenityvalue = req.params.amenityValue;



        db.any("select fn_post_property_amenities_insert($1,$2,$3)", [property_id, amenityId, amenityvalue]).then((data) => {

        });


        res.send();



    });
} {
    propertyRouter.post('/facilitiesPost/:propertyId/:facilities', function (req, res) {

        var property_id = req.params.propertyId;

        var facilities = req.params.facilities;




        db.any("select fn_post_property_facilities_insert($1,$2)", [property_id, facilities]).then((data) => {
            res.send()
        });



    });
}


{
    propertyRouter.put('/updateProperty/:propertyId', (req, res, next) => {
        var property_id = req.params.propertyId;
        var price = req.body.price;
        var security_deposit = req.body.securityDeposit;
        var maintenance = req.body.maintainanceCost;
        var description = req.body.description;
        var rental_period = req.body.rentalPeriod;
        var propertyImage = req.body.image;
        var dir = "./Gallery/" + property_id + "/"
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
            var imgPath = "./Gallery/" + property_id + "/Images";
            fs.mkdirSync(imgPath);
        }
        var dt = new Date();
        for (var i = 0; i < propertyImage.length; i++) {
            fName = dt.getFullYear() + '_' + dt.getMonth() + '_' + dt.getDate() + '_' + dt.getHours() + '_' + dt.getMinutes() + '_' + dt.getMilliseconds() + i + ".png";
            fNameW = path.join('./', 'Gallery/' + property_id + '/Images/' + fName);
            fs.writeFile(fNameW, propertyImage[i], 'base64', (err) => {
                if (err) {
                    console.log('Unable to write ..')
                    console.log(err.message);
                } else
                    console.log('Saved the image');
            })
        }
        db.any('select fn_property_details_update($1,$2,$3,$4,$5,$6)', [price, security_deposit, maintenance, description, rental_period, property_id]).then((data) => {
            res.send(data)
        })

    });
} {
    propertyRouter.put('/deleteMyProperty/:property_id', (req, res, next) => {
        var property_id = req.params.property_id;

        db.any("update propertydetails set status='Deactive' where id=$1 returning id  pid", property_id).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "deleteMyProperty works"
                })
            } else {

                res.status(200).send({
                    result: false,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found deleteMyProperty"
                })
            }

        })

            .catch(error => {

                res.status(404).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "unable to view  deleteMyProperty"
                })

            })
    })
}


{

    propertyRouter.post('/propertystatus/:property_id/:status', (req, res, next) => { //update tenant_notifications
        var property_id = req.params.property_id;
        var status = req.params.status;


        var dt = new Date();

        let month = dt.getMonth() + 1;
        if (month.length === 1) {
            month = "0" + month;
        }
        let update_date = dt.getFullYear().toString().substr() + '/' + month + '/' + dt.getDate() + '   ' + dt.getHours() + ':' + dt.getMinutes();



        db.any("select  from fn_update_property_status($1,$2,$3)    ", [property_id, status, update_date]).then((data) => {


            res.send(data);
        });



    })
}


{

    propertyRouter.get("/getpropertyviews/:propertyId", (req, res, next) => {
        var propertyId = req.params.propertyId;
        db.any("select * from fn_get_property_views1($1)", propertyId).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "getpropertyviews  get succesfully"
                })
            } else {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found for getpropertyviews"
                })
            }

        })
            .catch(error => {
                res.status(404).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "unable to view  getpropertyviews"
                })
            })
    })
}






{
    propertyRouter.get('/propertydetailsbyarea/:lat/:long/:propertytype/:city', (req, res) => {
        // var db = pgr(conntstr);
        var propertyArray = [];

        var latitude = req.params.lat;
        var longitude = req.params.long;
        var propertyType = req.params.propertytype;
        var city = req.params.city;
        db.any(`select * from  
    (select c.cityname,ar.areaname,ar.id,pa.*,pd.*,pt.*,(2 * 3961 * asin
    (sqrt((sin(radians((pa.latitude - $1)/ 2))) ^
     2 +cos(radians($1)) * cos(radians(pa.latitude)) *
    (sin(radians( (pa.longitude - $2)/ 2)))^ 2)))  
    as distance from propertyaddress pa left join propertydetails pd
     on pa.propertyid=pd.id left join 
     propertytypes pt on 
    pt.id=pd.propertytypeid left join city c on c.id=pa.cityid left join area ar on ar.id=pa.areaid where pd.propertytypeid=$3 and c.cityname=$4)
    as tb1 order by tb1.distance`, [latitude, longitude, propertyType, city]).then(data => {

            db.any("insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:tenant','ITR','INFO','View of Getallproperties Table successfull','tenant',true)").then((log) => {



                if (data.length > 0) {
                    data.forEach(prop => {
                        myPath = path.join('./', 'Gallery/' + prop.id + '/Images/');
                        fs.readdir(myPath, (err, files) => {

                            if (files == undefined) {


                                prop['img'] = "http://localhost:3400/no_image.gif"

                                propertyArray.push(prop)

                            } else {

                                var latLng = {}
                                latLng['lat'] = parseFloat(prop.latitude)
                                latLng['lng'] = parseFloat(prop.longitude)
                                prop['destination'] = latLng

                                prop['img'] = "http://localhost:3400/" + prop.id + "/Images/" + files[0]
                                propertyArray.push(prop)


                            }
                            if (data.length == propertyArray.length) {


                                res.status(200).send({
                                    result: true,
                                    error: "NOERROR",
                                    data: propertyArray,
                                    message: "Get all property details succesfully"
                                })
                            }
                        })

                    })

                } else {
                    res.status(200).send(data);
                }
            })
        })
            .catch(error => {
                db.any("insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:Institute','ITR','ERR','View of Getallproperties Table successfull','tenant',False)").then((log) => {
                    res.status(200).send({
                        message: " Unable to View Properties"
                    });
                });
            })
    })


}








{
    propertyRouter.post('/propertymapadd/Add/', (req, res, next) => {


        var countryname = req.body.countryname.trim();
        var statename = req.body.statename.trim();
        var cityname = req.body.cityname.trim();
        var areaname = req.body.areaname.trim();
        var zipcode = req.body.zipcode.trim();

        var countrid;
        var stateid;
        var cityid;
        var areaid;


        db.any('select * from fn_getcountrymapforpost($1)', [countryname]).then((data) => {


            if (data.length > 0) {

                countrid = data[0].countryid
                db.any('select * from fn_getstatemapforpost($1,$2)', [statename, countrid]).then((data1) => {


                    if (data1.length > 0) {
                        stateid = data1[0].stateid
                        db.any('select * from fn_getcitymapforpost($1,$2)', [cityname, stateid]).then((data2) => {


                            if (data2.length > 0) {

                                cityid = data2[0].cityid
                                db.any('select * from fn_getareamapforpost($1,$2)', [areaname, cityid]).then((data3) => {


                                    if (data3.length > 0) {
                                        areaid = data3[0].areaid
                                        console.log([{

                                            'country_id': countrid,
                                            'state_id': stateid,
                                            'city_id': cityid,
                                            'area_id': areaid,
                                        }])
                                        res.send([{

                                            'country_id': countrid,
                                            'state_id': stateid,
                                            'city_id': cityid,
                                            'area_id': areaid,
                                        }])



                                    } else {

                                        db.any('select * from  fn_insertarea($1,$2,$3,$4,$5)', [countrid, stateid, cityid, areaname, zipcode]).then((data7) => {
                                            res.send(data7)


                                        })
                                    }

                                })
                            } else {
                                db.any('select * from  fn_insertcityarea($1,$2,$3,$4,$5)', [countrid, stateid, cityname, areaname, zipcode]).then((data6) => {
                                    res.send(data6)

                                })

                            }
                        })


                    } else {


                        db.any('select * from  fn_insertstatecityarea($1,$2,$3,$4,$5)', [countrid, statename, cityname, areaname, zipcode]).then((data5) => {
                            res.send(data5)
                        })
                    }



                })

            } else {

                db.any('select * from  fn_insertcountrystatecityarea($1,$2,$3,$4,$5)', [countryname, statename, cityname, areaname, zipcode]).then((data4) => {
                    res.send(data4)

                })


            }

        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to Add PropertyType"
                })
            })
    })

}



{
    propertyRouter.get("/getviewedproperties/:userid/:page", (req, res, next) => {

        var userid = req.params.userid;
        var page = 10;
        var propertyArray = []
        db.any("select * from fn_getrecentviewedproperties1($1,$2)", [userid, page]).then((data) => {
            if (data.length > 0) {
                data.forEach(prop => {
                    myPath = path.join('./', 'Gallery/' + prop.propertyid + '/Images/');
                    fs.readdir(myPath, (err, files) => {

                        if (files == undefined) {


                            prop['img'] = "http://localhost:3400/no_image.gif"

                            propertyArray.push(prop)

                        }
                        else {
                            prop['img'] = "http://localhost:3400/" + prop.propertyid + "/Images/" + files[0]
                            propertyArray.push(prop)

                        }
                        if (data.length == propertyArray.length) {
                            res.status(200).send({
                                result: true,
                                error: "NOERROR",
                                data: propertyArray,
                                message: "Get all property details succesfully"
                            })
                        }
                    })

                })

            }
            else {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "no properties available"
                });

            }

        })
            .catch(error => {
                res.status(200).send({
                    message: " Unable to View Properties"
                });
            })
    })


}



// Sms sending to owner (2 factor)


const propertyUserSms = async (mobile, propertyName, usermobile, username, propertyid, ownername) => {

    var propertyid = propertyid.toString();
    var username = username.toUpperCase();
    var ownername = ownername.toUpperCase();

    const apiInstance = new TwoFactor('334edb33-90c7-11e9-ade6-0200cd936042');
    try {
        const response = await apiInstance.Transactional.sendMessage({
            to: mobile,
            from: 'NEARUK',
            //  templateName: 'open',
            templateType: apiInstance.Transactional.TemplateTypes.dynamic,
            templateName: 'Property viewed',
            var1: propertyName,
            var2: usermobile,
            var3: username,
            var4: propertyid,
            var5: ownername
        });
    } catch (error) {
        console.log('Error: ', error);
    }
};


// get SMS to owner

{
    propertyRouter.get('/getSms/:id/:propertyid', (req, res, next) => {
        var userid = req.params.id
        var propertyid = req.params.propertyid;
        var username;
        var usermobile;
        db.any("select * from registration where id=$1", [userid]).then((data) => {
            //  console.log(data)
            this.username = data[0].name;
            this.usermobile = data[0].mobile;

            db.any("select r.id,r.name,p.propertyname,r.email,r.mobile,p.id as propertyid from registration r join propertydetails p on r.id=p.userid where p.id=$1", [propertyid]).then((data1) => {
                //  console.log(data1)
                if (data1.length > 0) {
                    var mobile = data1[0].mobile;
                    var propertyName = data1[0].propertyname;
                    var ownername = data1[0].name;
                    var propertyid = data1[0].propertyid;



                    if (userid != data1[0].id) {
                        // propertyUserSms(mobile, propertyName, this.usermobile, this.username, propertyid, ownername)
                    }


                    res.status(200).send({
                        result: true,
                        error: "NOERROR",
                        data: data,
                        message: " SMS Get Successfully"
                    })
                }
                else {
                    res.status(200).send({
                        result: true,
                        error: "NOERROR",
                        data: "NDF",
                        message: "No Data Found for SMS"
                    })
                }
            })
        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to get SMS"
                })
            })
    })
}


module.exports = propertyRouter;