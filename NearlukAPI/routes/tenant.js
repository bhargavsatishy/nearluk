var fs = require('fs')
var path = require('path')
var express = require('express')
var promise = require('bluebird')
var bodyparser = require('body-parser')
var option = {
    promiseLib: promise
};

var tenantRouter = express();
var config = require('../apiconfig')
var conntstr = config.connectionString
const dba = require('../db');
const db = dba.db;
const pgp = db.$config.pgp

tenantRouter.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", "Cache-Control,Pragma,Origin,Authorization,Content-Type,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "*");
    return next();
});

tenantRouter.use(bodyparser.json({ limit: '30mb' }));
tenantRouter.use(bodyparser.urlencoded({ limit: '30mb', extended: true }));






{
    tenantRouter.get('/propertyAutoComplete/:value', (req, res, next) => {
        var pro = req.params.value;
        var propertyArray = [];

        db.any('select * from fn_getPropertyautofill($1)', pro).then((data) => {
            data.forEach(element => {
                propertyArray.push(element.propertyname)


            })
            res.send(propertyArray)
        })
    })
}








{
    tenantRouter.get('/averagebyarea/:propertytypeid/:areaid', (req, res) => {
        var propertytype = req.params.propertytypeid;
        var area = req.params.areaid;

        var value1 = 0
        var value2 = 0
        var value3 = 0
        var valuechack1 = []
        var valuechack2 = []
        var rentalperiod = [{ time: 'hour', number: 720 }, { time: 'day', number: 30 }, { time: 'week', number: 4 }, { time: 'month', number: 1 }, { time: 'year', number: 12 }]
        var finalvalue = [];


        db.any(`(select rentalperiod,(avg(price)/avg(propertyarea))as avgprice from propertydetails pd join propertyaddress pa on pd.id=pa.propertyid where rentalperiod=$1 and pa.areaid=$7 and pd.propertytypeid=$6 group by pd.rentalperiod)union(select rentalperiod,(avg(price)/avg(propertyarea))as avgprice from propertydetails pd join propertyaddress pa on pd.id=pa.propertyid where rentalperiod=$2 and pa.areaid=$7 and pd.propertytypeid=$6 group by pd.rentalperiod)union(select rentalperiod,(avg(price)/avg(propertyarea))as avgprice from propertydetails pd join propertyaddress pa on pd.id=pa.propertyid where rentalperiod=$3 and pa.areaid=$7 and pd.propertytypeid=$6 group by pd.rentalperiod)union(select rentalperiod,(avg(price)/avg(propertyarea))as avgprice from propertydetails pd join propertyaddress pa on pd.id=pa.propertyid where rentalperiod=$4 and pa.areaid=$7 and pd.propertytypeid=$6 group by pd.rentalperiod)union(select rentalperiod,(avg(price)/avg(propertyarea))as avgprice from propertydetails pd join propertyaddress pa on pd.id=pa.propertyid where rentalperiod=$5 and pa.areaid=$7 and pd.propertytypeid=$6 group by pd.rentalperiod)`, [rentalperiod[0].time, rentalperiod[1].time, rentalperiod[2].time, rentalperiod[3].time, rentalperiod[4].time, propertytype, area]).then((data) => {

            if (data.length > 0) {


                for (i = 0; i < data.length; i++) {
                    for (j = 0; j < rentalperiod.length; j++) {
                        if (data[i].rentalperiod == rentalperiod[j].time)
                            if (data[i].rentalperiod == 'year' && rentalperiod[j].time == 'year') {
                                value1 = data[i].avgprice / rentalperiod[j].number

                                finalvalue.push(value1)
                            }
                            else {
                                value1 = data[i].avgprice * rentalperiod[j].number
                                finalvalue.push(value1)
                            }
                    }
                    if (finalvalue.length == data.length) {
                        for (m = 0; m < finalvalue.length; m++) {

                            valuechack1.push(1)
                            value1 = finalvalue[m]
                            value3 = value2 + value1;
                            value2 = value3
                            if (finalvalue.length == valuechack1.length) {

                                value3 = value3 / data.length
                                value3 = Number((value3).toFixed(1));
                                res.status(200).send({
                                    result: true,
                                    error: "NOERROR",
                                    data: value3,
                                    message: "Get averagebyarea succesfully"
                                })
                            }
                        }
                    }
                }
            }
            else {
                res.status(200).send({
                    result: false,
                    error: "NOERROR",
                    data: 'NDF',
                    message: "Get averagebyarea succesfully but no data"
                })
            }
        })
    })
}
//get

//===================================Getallproperties=========================================================

// {
//     tenantRouter.get('/GetAllProperties/:cityname/:statename', (req, res, next) => {





//         var cityName = req.params.cityname.trim();
//         var stateName = req.params.statename.trim();



//         var propertyArray = []


//         images = []


//         var faci = []







//         db.any("select * from fn_getcityid_bycitandstatename($1,$2)", [cityName, stateName]).then((data) => {



//             if (data.length == 1) {



//                 var cityid = parseInt(data[0].cityid);

//                 db.any("SELECT pd.propertyTypeid, COUNT(*),pt.propertytype FROM propertydetails pd join propertytypes pt on pt.id=pd.propertytypeid join propertyaddress pa on pd.id=pa.propertyid where pa.cityid=$1 and pd.status='Active' GROUP BY pd.propertyTypeid,pt.propertytype  ORDER BY   count desc limit 6", cityid).then((data1) => {




//                     if (data1.length > 0) {
//                         for (i = 0; i < data1.length; i++) {



//                             db.any("(select (select propertytype from propertytypes where id=$1) as type,( SELECT array_to_json(array_agg(row_to_json(data))) FROM (select * from vw_homeget where propertytypeid=$1 and status='Active' and cityid=$2 order by id desc limit 3) data))", [data1[i].propertytypeid, cityid]).then((data2) => {



//                                 var type = data2[0].type
//                                 var pdata = data2[0].array_to_json



//                                 propertyArray.push({ 'type': type, "pdata": pdata })







//                                 if (propertyArray.length == data1.length) {








//                                     var propertyidarray = [];
//                                     for (var i = 0; i < propertyArray.length; i++) {


//                                         for (var j = 0; j < propertyArray[i].pdata.length; j++) {





//                                             propertyidarray.push(propertyArray[i].pdata[j].id)


//                                         }

//                                     }

//                                     var images = [];
//                                     propertyidarray.forEach(prop => {



//                                         myPath = path.join('./', 'Gallery/' + prop + '/Images/');
//                                         fs.readdir(myPath, (err, files) => {

//                                             if (files == undefined) {


//                                                 prop['img'] = "http://localhost:3400/no_image.gif"

//                                                 images.push(prop)

//                                             }
//                                             else {

//                                                 var latLng = {}
//                                                 latLng['lat'] = parseFloat(prop.latitude)
//                                                 latLng['lng'] = parseFloat(prop.longitude)
//                                                 prop['destination'] = latLng


//                                                 img = "http://localhost:3400/" + prop + "/Images/" + files[0]

//                                                 images.push({ "id": prop, "img": img })




//                                                 if (images.length == propertyidarray.length) {



//                                                     for (c = 0; c < propertyidarray.length; c++) {

//                                                         db.any(`select * from vw_homefacilities hf left outer join vw_homeamenities ha on hf.id=ha.aid where id=$1`, [propertyidarray[c]]).then(fadata => {


//                                                             for (var i = 0; i < propertyArray.length; i++) {


//                                                                 for (var j = 0; j < propertyArray[i].pdata.length; j++) {




//                                                                     if (fadata[0].id == propertyArray[i].pdata[j].id) {

//                                                                         faci.push(1)



//                                                                         propertyArray[i].pdata[j]['facilitiesamenities'] = { fadata }


//                                                                         propertyidarray


//                                                                         if (propertyidarray.length == faci.length) {
//                                                                             res.status(200).send({
//                                                                                 result: true,
//                                                                                 error: "NOERROR",
//                                                                                 data: propertyArray,
//                                                                                 img: images,
//                                                                                 message: "Get all property details succesfully"
//                                                                             })
//                                                                         }

//                                                                     }



//                                                                 }

//                                                             }




//                                                         })
//                                                     }






//                                                 }

//                                             }

//                                         })

//                                     })






//                                 }

//                             })
//                         }

//                     }

//                     else {
//                         res.status(200).send({
//                             result: true,
//                             error: "NOERROR",
//                             data: 'NDF',
//                             message: "Get all property details succesfully"
//                         })
//                     }




//                 })
//             }

//             else {

//                 console.log("citynotpresent")
//                 db.any("SELECT pd.propertyTypeid, COUNT(*),pt.propertytype FROM propertydetails pd join propertytypes pt on pt.id=pd.propertytypeid join propertyaddress pa on pd.id=pa.propertyid where  pd.status='Active' GROUP BY pd.propertyTypeid,pt.propertytype  ORDER BY   count desc limit 6").then((data1) => {

//                     for (i = 0; i < data1.length; i++) {



//                         db.any("(select (select propertytype from propertytypes where id=$1) as type,( SELECT array_to_json(array_agg(row_to_json(data))) FROM (select * from vw_homeget where propertytypeid=$1 and status='Active' order by id desc limit 3) data))", [data1[i].propertytypeid]).then((data2) => {
//                             var type = data2[0].type
//                             var pdata = data2[0].array_to_json


//                             propertyArray.push({ 'type': type, "pdata": pdata })

//                             if (propertyArray.length == data1.length) {
//                                 var propertyidarray = [];
//                                 for (var i = 0; i < propertyArray.length; i++) {
//                                     for (var j = 0; j < propertyArray[i].pdata.length; j++) {
//                                         propertyidarray.push(propertyArray[i].pdata[j].id)


//                                     }

//                                 }
//                                 var images = [];
//                                 propertyidarray.forEach(prop => {



//                                     myPath = path.join('./', 'Gallery/' + prop + '/Images/');
//                                     fs.readdir(myPath, (err, files) => {

//                                         if (files == undefined) {


//                                             prop['img'] = "http://localhost:3400/no_image.gif"

//                                             images.push(prop)

//                                         }
//                                         else {

//                                             var latLng = {}
//                                             latLng['lat'] = parseFloat(prop.latitude)
//                                             latLng['lng'] = parseFloat(prop.longitude)
//                                             prop['destination'] = latLng


//                                             img = "http://localhost:3400/" + prop + "/Images/" + files[0]

//                                             images.push({ "id": prop, "img": img })


//                                             if (images.length == propertyidarray.length) {



//                                                 for (c = 0; c < propertyidarray.length; c++) {

//                                                     db.any(`select * from vw_homefacilities hf left outer join vw_homeamenities ha on hf.id=ha.aid where id=$1`, [propertyidarray[c]]).then(fadata => {

//                                                         for (var i = 0; i < propertyArray.length; i++) {


//                                                             for (var j = 0; j < propertyArray[i].pdata.length; j++) {




//                                                                 if (fadata[0].id == propertyArray[i].pdata[j].id) {

//                                                                     faci.push(1)



//                                                                     propertyArray[i].pdata[j]['facilitiesamenities'] = { fadata }

//                                                                     propertyidarray


//                                                                     if (propertyidarray.length == faci.length) {
//                                                                         res.status(200).send({
//                                                                             result: true,
//                                                                             error: "NOERROR",
//                                                                             data: propertyArray,
//                                                                             img: images,
//                                                                             message: "Get all property details succesfully"
//                                                                         })
//                                                                     }

//                                                                 }



//                                                             }

//                                                         }




//                                                     })
//                                                 }






//                                             }

//                                         }

//                                     })

//                                 })
//                             }

//                         })
//                     }




//                 })
//             }
//         })






//     })


// }



{
    tenantRouter.get('/GetAllProperties/:cityname/:statename/:userid', (req, res, next) => {
        var cityName = req.params.cityname.trim();
        var stateName = req.params.statename.trim();
        var userId = req.params.userid;
        var propertyArray = []
        images = []
        var faci = []
        db.any("select * from fn_getcityid_bycitandstatename($1,$2)", [cityName, stateName]).then((data) => {

            if (data.length == 1) {
                var cityid = parseInt(data[0].cityid);

                db.any("SELECT pd.propertyTypeid, COUNT(*),pt.propertytype FROM propertydetails pd join propertytypes pt on pt.id=pd.propertytypeid join propertyaddress pa on pd.id=pa.propertyid where pa.cityid=$1 and pd.status='Active' GROUP BY pd.propertyTypeid,pt.propertytype  ORDER BY   count desc limit 6", cityid).then((data1) => {
                    if (data1.length > 0) {
                        for (i = 0; i < data1.length; i++) {

                            if (userId == 'undefined' || userId == undefined || userId == null || userId == 'null') {
                                db.any("(select (select propertytype from propertytypes where id=$1) as type,( SELECT array_to_json(array_agg(row_to_json(data))) FROM (select * from vw_homeget where propertytypeid=$1 and status='Active' and cityid=$2 order by id desc limit 3) data))", [data1[i].propertytypeid, cityid, userId]).then((data2) => {



                                    var type = data2[0].type
                                    var pdata = data2[0].array_to_json

                                    propertyArray.push({ 'type': type, "pdata": pdata })

                                    if (propertyArray.length == data1.length) {

                                        var propertyidarray = [];
                                        for (var i = 0; i < propertyArray.length; i++) {
                                            for (var j = 0; j < propertyArray[i].pdata.length; j++) {
                                                propertyidarray.push(propertyArray[i].pdata[j].id)

                                            }

                                        }

                                        var images = [];
                                        propertyidarray.forEach(prop => {

                                            myPath = path.join('./', 'Gallery/' + prop + '/Images/');
                                            fs.readdir(myPath, (err, files) => {

                                                if (files == undefined) {


                                                    prop['img'] = "http://localhost:3400/no_image.gif"

                                                    images.push(prop)

                                                }
                                                else {

                                                    var latLng = {}
                                                    latLng['lat'] = parseFloat(prop.latitude)
                                                    latLng['lng'] = parseFloat(prop.longitude)
                                                    prop['destination'] = latLng


                                                    img = "http://localhost:3400/" + prop + "/Images/" + files[0]

                                                    images.push({ "id": prop, "img": img })




                                                    if (images.length == propertyidarray.length) {



                                                        for (c = 0; c < propertyidarray.length; c++) {

                                                            db.any(`select * from vw_homefacilities hf left outer join vw_homeamenities ha on hf.id=ha.aid where id=$1`, [propertyidarray[c]]).then(fadata => {


                                                                for (var i = 0; i < propertyArray.length; i++) {


                                                                    for (var j = 0; j < propertyArray[i].pdata.length; j++) {




                                                                        if (fadata[0].id == propertyArray[i].pdata[j].id) {

                                                                            faci.push(1)



                                                                            propertyArray[i].pdata[j]['facilitiesamenities'] = { fadata }


                                                                            propertyidarray


                                                                            if (propertyidarray.length == faci.length) {
                                                                                res.status(200).send({
                                                                                    result: true,
                                                                                    error: "NOERROR",
                                                                                    data: propertyArray,
                                                                                    img: images,
                                                                                    message: "Get all property details succesfully"
                                                                                })
                                                                            }

                                                                        }



                                                                    }

                                                                }

                                                            })
                                                        }


                                                    }

                                                }

                                            })

                                        })

                                    }

                                })
                            }
                            else {
                                db.any("(select (select propertytype from propertytypes where id=$1) as type,( SELECT array_to_json(array_agg(row_to_json(data))) FROM (select * from vw_homeget home left outer join(select (propertyid) as userviewd,contactviewed from propertyviews pv where pv.userid=$3) as v1 on v1.userviewd=home.id where propertytypeid=$1 and status='Active' and cityid=$2 order by id desc limit 3)data)) ", [data1[i].propertytypeid, cityid, userId]).then((data2) => {
                                    var type = data2[0].type
                                    var pdata = data2[0].array_to_json
                                    propertyArray.push({ 'type': type, "pdata": pdata })
                                    if (propertyArray.length == data1.length) {
                                        var propertyidarray = [];
                                        for (var i = 0; i < propertyArray.length; i++) {
                                            for (var j = 0; j < propertyArray[i].pdata.length; j++) {
                                                propertyidarray.push(propertyArray[i].pdata[j].id)
                                            }
                                        }

                                        var images = [];
                                        propertyidarray.forEach(prop => {

                                            myPath = path.join('./', 'Gallery/' + prop + '/Images/');

                                            fs.readdir(myPath, (err, files) => {

                                                if (files == undefined) {

                                                    prop['img'] = "http://localhost:3400/no_image.gif"
                                                    images.push(prop)
                                                }
                                                else {
                                                    var latLng = {}
                                                    latLng['lat'] = parseFloat(prop.latitude)
                                                    latLng['lng'] = parseFloat(prop.longitude)
                                                    prop['destination'] = latLng

                                                    // prop['img'] = "http://localhost:3400/" + prop + "/Images/" + files[0]

                                                    img = "http://localhost:3400/" + prop + "/Images/" + files[0]

                                                    images.push({ "id": prop, "img": img })

                                                    if (images.length == propertyidarray.length) {

                                                        for (c = 0; c < propertyidarray.length; c++) {

                                                            db.any(`select * from vw_homefacilities hf left outer join vw_homeamenities ha on hf.id=ha.aid where id=$1`, [propertyidarray[c]]).then(fadata => {


                                                                for (var i = 0; i < propertyArray.length; i++) {


                                                                    for (var j = 0; j < propertyArray[i].pdata.length; j++) {




                                                                        if (fadata[0].id == propertyArray[i].pdata[j].id) {

                                                                            faci.push(1)



                                                                            propertyArray[i].pdata[j]['facilitiesamenities'] = { fadata }


                                                                            propertyidarray
                                                                            if (propertyidarray.length == faci.length) {
                                                                                res.status(200).send({
                                                                                    result: true,
                                                                                    error: "NOERROR",
                                                                                    data: propertyArray,
                                                                                    img: images,
                                                                                    message: "Get all property details succesfully"
                                                                                })
                                                                            }

                                                                        }



                                                                    }

                                                                }

                                                            })
                                                        }


                                                    }

                                                }

                                            })

                                        })


                                    }

                                })
                            }

                        }

                    }

                    else {
                        res.status(200).send({
                            result: true,
                            error: "NOERROR",
                            data: 'NDF',
                            message: "Get all property details succesfully"
                        })
                    }


                })
            }

            else {

                // console.log("citynotpresent")
                db.any("SELECT pd.propertyTypeid, COUNT(*),pt.propertytype FROM propertydetails pd join propertytypes pt on pt.id=pd.propertytypeid join propertyaddress pa on pd.id=pa.propertyid where  pd.status='Active' GROUP BY pd.propertyTypeid,pt.propertytype  ORDER BY   count desc limit 6").then((data1) => {

                    for (i = 0; i < data1.length; i++) {



                        db.any("(select (select propertytype from propertytypes where id=$1) as type,( SELECT array_to_json(array_agg(row_to_json(data))) FROM (select * from vw_homeget where propertytypeid=$1 and status='Active' order by id desc limit 3) data))", [data1[i].propertytypeid]).then((data2) => {
                            var type = data2[0].type
                            var pdata = data2[0].array_to_json


                            propertyArray.push({ 'type': type, "pdata": pdata })

                            if (propertyArray.length == data1.length) {
                                var propertyidarray = [];
                                for (var i = 0; i < propertyArray.length; i++) {
                                    for (var j = 0; j < propertyArray[i].pdata.length; j++) {
                                        propertyidarray.push(propertyArray[i].pdata[j].id)


                                    }

                                }
                                var images = [];
                                propertyidarray.forEach(prop => {

                                    myPath = path.join('./', 'Gallery/' + prop + '/Images/');
                                    fs.readdir(myPath, (err, files) => {

                                        if (files == undefined) {


                                            prop['img'] = "http://localhost:3400/no_image.gif"

                                            images.push(prop)

                                        }
                                        else {

                                            var latLng = {}
                                            latLng['lat'] = parseFloat(prop.latitude)
                                            latLng['lng'] = parseFloat(prop.longitude)
                                            prop['destination'] = latLng

                                            // prop['img'] = "http://localhost:3400/" + prop + "/Images/" + files[0]

                                            img = "http://localhost:3400/" + prop + "/Images/" + files[0]

                                            images.push({ "id": prop, "img": img })


                                            if (images.length == propertyidarray.length) {



                                                for (c = 0; c < propertyidarray.length; c++) {

                                                    db.any(`select * from vw_homefacilities hf left outer join vw_homeamenities ha on hf.id=ha.aid where id=$1`, [propertyidarray[c]]).then(fadata => {

                                                        for (var i = 0; i < propertyArray.length; i++) {


                                                            for (var j = 0; j < propertyArray[i].pdata.length; j++) {




                                                                if (fadata[0].id == propertyArray[i].pdata[j].id) {

                                                                    faci.push(1)



                                                                    propertyArray[i].pdata[j]['facilitiesamenities'] = { fadata }

                                                                    propertyidarray


                                                                    if (propertyidarray.length == faci.length) {
                                                                        res.status(200).send({
                                                                            result: true,
                                                                            error: "NOERROR",
                                                                            data: propertyArray,
                                                                            img: images,
                                                                            message: "Get all property details succesfully"
                                                                        })
                                                                    }

                                                                }



                                                            }

                                                        }

                                                    })
                                                }

                                            }

                                        }

                                    })

                                })
                            }

                        })
                    }


                })
            }
        })

    })

}


//get favourites


{
    tenantRouter.get('/getFavourites/:userid/:limit', (req, res, next) => {
        var propertyArray = []
        var userid = req.params.userid
        var limit = (req.params.limit) * 10;

        db.any("select * from fn_getmyfavourites($1,$2)", [userid, limit]).then((data) => {
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
    })

}


{
    tenantRouter.get('/getFavouritesnew/:userid/:limit', (req, res, next) => {
        var propertyArray = []
        var userid = req.params.userid
        var limit = 8;
        var offset = (req.params.limit) * 8
        db.any("select * from fn_getmyfavouritesnew($1,$2,$3)", [userid, limit, offset]).then((data) => {
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
    })

}




{
    tenantRouter.get('/getSection/:sectionid', (req, res, next) => {
        var sectionid = req.params.sectionid
        db.any("select * from fn_viewuserid($1)", [sectionid]).then((data) => {
            res.send(data);
        })

            .catch(error => {

                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: " Unable to View usernamre"
                });
            });
    })
}



//get bidding
{
    tenantRouter.get('/Bidding/bidding/:propertyid', (req, res, next) => {
        var propertyid = req.params.propertyid;

        db.any('select * from fn_get_biddingprice($1)', [propertyid]).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: " Bidding get Successfully"
                })
            } else {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Bidding"
                })
            }
        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to get Bidding"
                })
            })
    })
}

//user details get biiding
{
    tenantRouter.get('/Bidding/id/:id', (req, res, next) => {
        var id = req.params.id;
        db.any(' select * from fn_tenant_registration_select($1) ', [id]).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "Bidded Details get Successfully"
                })
            } else {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data for Bidded Details"
                })
            }
        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to get Bidded Details"
                })
            })
    })
}



{
    tenantRouter.get('/ownersInfo/id/:id/:userid', (req, res) => {

        var propertyArray = []

        var id = req.params.id;
        var userid = req.params.userid;
        db.any('select * from fn_getownersinfo_byproperty1($1)', [id]).then((data) => {

            db.any('select * from fn_updatecontactview($1,$2)', [id, userid]).then((data) => {



            })

            db.any("insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:tenant','ITR','INFO','View of Getallproperties Table successfull','tenant',true)").then((log) => {



                if (data.length > 0) {
                    data.forEach(prop => {
                        myPath = path.join('./', 'Profile/' + prop.id + '/');
                        fs.readdir(myPath, (err, files) => {

                            if (files == undefined) {


                                prop['img'] = "http://localhost:3400/no_image.gif"

                                propertyArray.push(prop)

                            }
                            else {

                                prop['img'] = "http://localhost:3400/" + prop.id + "/" + files[0]
                                propertyArray.push(prop)

                            }
                            if (data.length == propertyArray.length) {
                                res.status(200).send({
                                    result: true,
                                    error: "NOERROR",
                                    data: propertyArray,
                                    message: "Get Owner Details succesfully"
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
                        message: " Unable to View Owner Detyails"
                    });
                });
            })
    })


}





//===================================post=========================================================



//addfav

{
    tenantRouter.post('/addFavouritePost/:propertyid/:userid', (req, res, next) => {
        var userId = req.params.userid;
        var propertyId = req.params.propertyid;
        db.any('select * from fn_addfavourites ($1, $2)', [userId, propertyId]).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: " Favourites Added Successfully"
                })
            } else {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Favourites"
                })
            }
        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to Add Favourites"
                })
            })
    })
}







{
    tenantRouter.post('/Tenant/Notifications/Add', (req, res, next) => {
        var propertyId = req.body.propertyId;
        var fromUserId = req.body.fromUserId;
        var toUserId = req.body.toUserId;
        var message = req.body.message;
        var notifyDate = req.body.notifyDate;
        var notificationType = req.body.notificationType;
        var status = req.body.status;
        db.any('select * from fn_addTenantNotifications($1, $2, $3, $4, $5, $6, $7);', [propertyId, fromUserId, toUserId, message, notifyDate, notificationType, status]).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: " Tenant Notifications Added Successfully"
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
                    message: "Unable to Add Tenant Notifications"
                })
            })
    });
}


{
    tenantRouter.post('/Rating/Add/', (req, res, next) => {
        var propertyId = req.body.propertyId;
        var rating = req.body.rating;
        var userId = req.body.userId;
        var comment = req.body.comment;
        db.any('select * from fn_addRating($1, $2, $3, $4)', [propertyId, rating, userId, comment]).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: " Rating Added Successfully"
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
                    message: "Unable to Add Rating"
                })
            })
    })
}

{
    tenantRouter.post('/Favourites/Add/', (req, res, next) => {
        var userId = req.body.userId;
        var propertyId = req.body.propertyId;
        db.any('select * from fn_addFavourites ($1, $2)', [userId, propertyId]).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: " Favourites Added Successfully"
                })
            } else {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Favourites"
                })
            }
        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to Add Favourites"
                })
            })
    })
}

{
    tenantRouter.post('/Bidding/Add/', (req, res, next) => {
        var userId = req.body.userId;
        var propertyId = req.body.propertyId;
        var biddingPrice = req.body.biddingPrice;
        var biddingDate = req.body.biddingDate;
        db.any('select * from fn_addBidding($1, $2, $3, $4)', [userId, propertyId, biddingPrice, biddingDate]).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: " Bidding Added Successfully"
                })
            } else {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Bidding"
                })
            }
        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to Add Bidding"
                })
            })
    })
}


//bidding//



tenantRouter.post('/Bidding/send', (req, res, next) => {
    var propertyid = req.body.propertyid;
    var biddingprice = req.body.biddingprice;
    var tenantid = req.body.tenantid;
    var ownerid = req.body.ownerid;
    var notification_type = 'biding';
    var status = 'unseen';

    var dt = new Date()
    let month = dt.getMonth() + 1;
    var biddingdate = dt.getFullYear() + '_' + month + '_' + dt.getDate();
    db.any("select fn_bidding_insert($1,$2,$3,$4)", [tenantid, propertyid, biddingprice, biddingdate]).then((data) => {


        if (data.length > 0) {

            res.status(200).send({
                result: true,
                error: "NOERROR",
                data: data,
                message: " Bidding posted Successfully"
            })
        }
        else {
            res.status(200).send({
                result: true,
                error: "NOERROR",
                data: "NDF",
                message: "No Data Bidding"
            })
        }
    })
        .catch(error => {
            res.status(200).send({
                result: false,
                error: error.message,
                data: "ERROR",
                message: "Unable to post Bidding"
            })
        })
})





//delete 



//remove fav
{
    {
        tenantRouter.delete('/removeFavouritePost/:propertyid/:userid', (req, res, next) => {
            var userId = req.params.userid;
            var propertyId = req.params.propertyid;
            db.any("delete from favourites where propertyid=$1 and userid=$2 returning id  propertyid", [propertyId, userId]).then((data) => {

                if (data.length > 0) {
                    res.status(200).send({
                        result: true,
                        error: "NOERROR",
                        data: data,
                        message: " Favourites remove Successfully"
                    })
                } else {
                    res.status(200).send({
                        result: true,
                        error: "NOERROR",
                        data: "NDF",
                        message: "already removed favourite"
                    })
                }
            })
                .catch(error => {
                    res.status(200).send({
                        result: false,
                        error: error.message,
                        data: "ERROR",
                        message: "Unable to remove Favourites"
                    })
                })
        })
    }
}


{
    tenantRouter.post('/likes/:propertyid/:userid', (req, res, next) => {         // post bidding data
        var property_id = req.params.propertyid;
        var userid = req.params.userid;

        db.any('select * from fn_addpropertylikes($1,$2,$3)', [property_id, userid, null]).then((data) => {
            if (data[0].fn_addpropertylikes == 'updated 1 sucessfully') {
                // console.log('liked')
                res.send({
                    result: true,
                    message: "You liked the property"
                });
            }
            else {
                // console.log('disliked')
                res.send({
                    result: false,
                    message: "You disliked the property"
                });
            }

        });
    })
}



{
    tenantRouter.get('/getalllikes/:propertyid', (req, res, next) => {

        db.any("select count(*) from propertylikes where propertyid=$1 and likesstatus=1", [req.params.propertyid]).then((data) => {
            res.send(data);
        })

            .catch(error => {

                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: " Unable to get property likes"
                });
            });
    })
}


//city auto 


{

    tenantRouter.get('/cityAutoComplete/:value', (req, res, next) => {//***** */
        var ctyArray = [];
        var value = req.params.value;

        db.any("select * from fn_getcityautofill2($1)", value).then((data) => {


            db.any("insert into domainlogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:  tenant','ITR','INFO','Get cityAutoComplete successfully','tenant',TRUE)").then((log) => {
                if (data.length > 0) {
                    // data.forEach(element => {
                    //     ctyArray.push(element.usercityname.trim(" "))
                    // })
                    res.status(200).send({
                        result: true,
                        error: "NOERROR",
                        data: data,
                        message: "Get cityAutoComplete succesfully"
                    })

                }

                // else if (data = []) {
                //     db.any("select * from fn_getareaname($1)", value).then((data) => {
                //         if (data.length > 0) {
                //             data.forEach(element => {
                //                 ctyArray.push(element.userareaname.trim(" "))
                //             })

                //             res.status(200).send({
                //                 result: true,
                //                 error: "NOERROR",
                //                 data: ctyArray,
                //                 message: "Get cityAutoComplete succesfully"
                //             })
                //         }
                //     })
                // }
                else {

                    res.status(200).send({
                        result: true,
                        error: "NOERROR",
                        data: "NDF",
                        message: "No Data Found for cityAutoComplete"
                    })
                }
            })


        })

            .catch(error => {

                db.any("insert into domainlogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:  tenant','ITR','ERR','unable to Get cityAutoComplete','tenant',FALSE)").then((log) => {
                    res.status(404).send({
                        result: false,
                        error: error.message,
                        data: "ERROR",
                        message: "unable to Get cityAutoComplete"
                    })
                })


            })

    })

}



{

    tenantRouter.get('/areaAutoComplete/:value', (req, res, next) => {//***** */
        var ctyArray = [];
        var value = req.params.value;
        db.any("select * from fn_getareaautofill2($1)", value).then((data) => {


            db.any("insert into domainlogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:  tenant','ITR','INFO','Get cityAutoComplete successfully','tenant',TRUE)").then((log) => {
                if (data.length > 0) {
                    // data.forEach(element => {
                    //     ctyArray.push(element.usercityname.trim(" "))
                    // })
                    res.status(200).send({
                        result: true,
                        error: "NOERROR",
                        data: data,
                        message: "Get areaAutoComplete succesfully"
                    })

                }

                // else if (data = []) {
                //     db.any("select * from fn_getareaname($1)", value).then((data) => {
                //         if (data.length > 0) {
                //             data.forEach(element => {
                //                 ctyArray.push(element.userareaname.trim(" "))
                //             })

                //             res.status(200).send({
                //                 result: true,
                //                 error: "NOERROR",
                //                 data: ctyArray,
                //                 message: "Get cityAutoComplete succesfully"
                //             })
                //         }
                //     })
                // }
                else {

                    res.status(200).send({
                        result: true,
                        error: "NOERROR",
                        data: "NDF",
                        message: "No Data Found for areaAutoComplete"
                    })
                }
            })


        })

            .catch(error => {

                db.any("insert into domainlogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:  tenant','ITR','ERR','unable to Get cityAutoComplete','tenant',FALSE)").then((log) => {
                    res.status(404).send({
                        result: false,
                        error: error.message,
                        data: "ERROR",
                        message: "unable to Get areaAutoComplete"
                    })
                })


            })

    })

}



{


    tenantRouter.get('/getCompare/:pid1/:pid2/:pid3', (req, res, next) => {//***** */

        var pid1 = req.params.pid1;
        var pid2 = req.params.pid2;
        var pid3 = req.params.pid3;

        var propertyArray = []

        if (pid3 == 'null' || pid3 == undefined) { pid3 = null }
        if (pid1 == 'null' || pid1 == undefined) { pid1 = null }

        if (pid2 == 'null' || pid2 == undefined) { pid2 = null }

        db.any("select * from vw_moredetails where vw_moredetails.id in($1,$2,$3)", [pid1, pid2, pid3]).then((data) => {
            db.any("insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:tenant','ITR','INFO','View of Getallproperties Table successfull','tenant',true)").then((log) => {



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
                                    message: "Get compare details succesfully"
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
                        message: " Unable to View  compare Properties"
                    });
                });
            })
    })


}



/////filters search


{
    tenantRouter.post('/filters/search/:page', (req, res, next) => {//***** */
        var propertyType = req.body.propertyTypeId;
        var facing = req.body.facing;
        var minprice = req.body.minprice;
        var maxprice = req.body.maxprice;
        var verify = req.body.veification;
        var rating = req.body.rating;
        var cityname = req.body.cityName;
        var userid = req.body.userId;
        var result = cityname.split(",");
        cityName = result[0]
        stateName = result[1]

        db.any("select * from fn_getcityid_bycitandstatename($1,$2)", [cityName, stateName]).then((data) => {

            var cityid = parseInt(data[0].cityid);

            var k = (req.params.page) * 10

            if (propertyType == undefined) {
                propertyType = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
            }
            if (facing == undefined) {
                facing = ['East', 'North', 'South', 'West', 'South East', 'South West', 'North East', 'North West']
            }

            if (minprice == undefined) {
                minprice = 0
            }
            if (maxprice == undefined) {
                maxprice = 1000000000
            }
            if (verify == undefined) {

                verify = ['N', 'V']
            }


            facingarray = facing

            propertyarray = propertyType

            var pt = `{` + (propertyType) + `}`;
            var fc = `{` + (facing) + `}`;

            var p1 = [propertyType];


            var verf1 = `{` + (verify) + `}`;
            var f1 = [facing];

            if (rating != undefined) {
                if (userid == 'undefined' || userid == undefined || userid == null || userid == 'null') {
                    db.any("select * from fn_filterswithratinguserid1($1,$2,$3,$4,$5,$6,$7,$8)", [cityid, pt, fc, minprice, maxprice, verf1, k, rating]).then((data) => {
                        var propertyArray = []
                        data.forEach(prop => {
                            myPath = path.join('./', 'Gallery/' + prop.propertyid + '/Images/');

                            fs.readdir(myPath, (err, files) => {
                                if (files == undefined) {
                                    prop['img'] = "http://localhost:3400/no_image.gif";
                                    propertyArray.push(prop)
                                }
                                else {
                                    prop['img'] = "http://localhost:3400/" + prop.propertyid + "/Images/" + files[0]
                                    propertyArray.push(prop)
                                }
                                if (data.length == propertyArray.length) {
                                    res.send(propertyArray)
                                }

                            })

                        })
                        if (data.length == 0) {
                            res.send(data);
                        }

                    })
                }
                else {
                    db.any("select * from fn_filterswithratingpagination1($1,$2,$3,$4,$5,$6,$7,$8,$9)", [cityid, pt, fc, minprice, maxprice, verf1, k, rating, userid]).then((data) => {

                        var propertyArray = []

                        data.forEach(prop => {
                            myPath = path.join('./', 'Gallery/' + prop.propertyid + '/Images/');

                            fs.readdir(myPath, (err, files) => {
                                if (files == undefined) {
                                    prop['img'] = "http://localhost:3400/no_image.gif";
                                    propertyArray.push(prop)
                                }
                                else {
                                    prop['img'] = "http://localhost:3400/" + prop.propertyid + "/Images/" + files[0]
                                    propertyArray.push(prop)
                                }
                                if (data.length == propertyArray.length) {
                                    res.send(propertyArray)
                                }
                            })
                        })

                        if (data.length == 0) {
                            res.send(data);
                        }

                    })
                }

            }
            else {

                if (userid == 'undefined' || userid == undefined || userid == null || userid == 'null') {
                    db.any("select * from fn_filterswithoutratinguserid1($1,$2,$3,$4,$5,$6,$7)", [cityid, pt, fc, minprice, maxprice, verf1, k]).then((data) => {

                        var propertyArray = []
                        data.forEach(prop => {
                            myPath = path.join('./', 'Gallery/' + prop.propertyid + '/Images/');

                            fs.readdir(myPath, (err, files) => {
                                prop['img'] = "http://localhost:3400/no_image.gif"
                                if (files == undefined) {
                                    propertyArray.push(prop)
                                }
                                else {
                                    prop['img'] = "http://localhost:3400/" + prop.propertyid + "/Images/" + files[0]
                                    propertyArray.push(prop)
                                }
                                if (data.length == propertyArray.length) {
                                    res.send(propertyArray)
                                }

                            })



                        })


                        if (data.length == 0) {
                            res.send(data);
                        }

                    })
                }
                else {

                    db.any("select * from fn_filterswithoutratingpagination1($1,$2,$3,$4,$5,$6,$7,$8)", [cityid, pt, fc, minprice, maxprice, verf1, k, userid]).then((data) => {

                        var propertyArray = []
                        data.forEach(prop => {
                            myPath = path.join('./', 'Gallery/' + prop.propertyid + '/Images/');

                            fs.readdir(myPath, (err, files) => {
                                prop['img'] = "http://localhost:3400/no_image.gif"
                                if (files == undefined) {
                                    propertyArray.push(prop)
                                }
                                else {
                                    prop['img'] = "http://localhost:3400/" + prop.propertyid + "/Images/" + files[0]
                                    propertyArray.push(prop)
                                }
                                if (data.length == propertyArray.length) {
                                    res.send(propertyArray)
                                }

                            })



                        })


                        if (data.length == 0) {
                            res.send(data);
                        }

                    })
                }

            }




        })


            .catch(error => {
                db.any("insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:Institute','ITR','ERR','Filter Get error','tenant',False)").then((log) => {
                    res.status(200).send({
                        message: " Unable to View filterget"
                    });
                });
            })

    })
}




//search for all


{
    tenantRouter.get('/search/all/:valuename', (req, res, next) => {

        var propertyname = req.params.valuename;
        var propertyArray = []

        db.any("select pd.posteddate,pt.propertytype,pd.propertyname,pd.id,pd.facing,pd.rentalperiod,pd.nearlukverified,pd.price,pd.propertytypeid,pd.description,pa.address,pa.pincode,c.countryname,s.statename,ci.cityname,a.areaname FROM  propertydetails pd join propertyaddress pa on pd.id=pa.propertyid join propertytypes pt on pt.id=pd.propertytypeid join country c on c.id=pa.countryid join state s on s.id=pa.stateid join city ci on ci.id=pa.cityid join area a on a.id=pa.areaid where (pd.propertyname ILIKE  '%' || $1 || '%' or pt.propertytype ILIKE '%'||$1||'%'  or pd.description ILIKE '%'||$1||'%'  or pa.address ILIKE '%'||$1||'%' or pa.pincode ILIKE '%'||$1||'%' or c.countryname ILIKE '%'||$1||'%' or s.statename ILIKE '%'||$1||'%' or  ci.cityname ILIKE '%'||$1||'%' or a.areaname ILIKE '%'||$1||'%') and status='Active'", [propertyname]).then((data) => {
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

                                prop['img'] = "http://localhost:3400/" + prop.id + "/Images/" + files[0]
                                propertyArray.push(prop)

                            }
                            if (data.length == propertyArray.length) {
                                res.status(200).send({
                                    result: true,
                                    error: "NOERROR",
                                    data: propertyArray,
                                    message: "Get search properties succesfully"
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
                        message: " Unable to View  search Properties"
                    });
                });
            })
    })
}



{
    tenantRouter.post('/TenantNotifications/Add/', (req, res, next) => {


        var propertyId = req.body.propertyid;
        var fromUserId = req.body.fromuserid;
        var toUserId = req.body.touserid;
        var message = 'accept';
        var notificationType = 'accept';
        var status = 'unseen';
        var dt = new Date();

        let month = dt.getMonth() + 1;

        let date = dt.getDate();
        let hour = dt.getHours();
        let Minutes = dt.getMinutes();
        if (month < 10) { month = "0" + month; };
        if (date < 10) { date = "0" + date; };
        if (hour < 10) { hour = "0" + hour; };
        if (Minutes < 10) { Minutes = "0" + Minutes; };

        if (month.length === 1) { month = "0" + month; }
        let posted_date = dt.getFullYear().toString().substr() + '/' + month + '/' + date + '   ' + hour + ':' + Minutes;
        var notifyDate = posted_date;


        var agentuserid = req.body.agentuserid;

        db.any('select * from fn_tenantnotificationsadd($1, $2, $3, $4, $5, $6, $7)', [propertyId, fromUserId, toUserId, message, notifyDate, notificationType, status]).then((data) => {

            var statusss = 'P'


            db.any('select fn_owneraddagentinsert($1,$2,$3)', [propertyId, agentuserid, statusss]).then((data) => {


                var notification_id = req.body.notificationId;
                var status = req.body.status;
                db.any("select fn_tenantnotificationsupdate($1,$2)", [status, notification_id]).then(data => {

                    if (data.length > 0) {
                        res.status(200).send({
                            result: true,
                            error: "NOERROR",
                            data: data,
                            message: " TenantNotifications Added Successfully"
                        })
                    } else {
                        res.status(200).send({
                            result: true,
                            error: "NOERROR",
                            data: "NDF",
                            message: "No Data TenantNotifications"
                        })
                    }
                })

            })
        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to Add TenantNotifications"
                })
            })
    })
}



// put



tenantRouter.put('/notificationseen/', (req, res) => {

    var id = req.body;


    for (let index = 0; index < id.length; index++) {

        db.any("select fn_updatenotificationseen($1)", [id[index]]).then(() => {
        })
    }
    res.send({ 'message': 'updated' })
})



//my bidded properties
{
    tenantRouter.get('/BiddingGetByuserid/:userid/:page', (req, res, next) => {

        var userid = req.params.userid;
        var page = (req.params.page) * 10;
        var propertyArray = []
        db.any("select pd.id,pd.propertyname,pd.posteddate,pt.propertytype,ci.cityname,pd.price,bp.biddingprices,pd.propertyarea from propertydetails pd join (select userid,propertyid,array_to_json(array_agg(biddingprice)) as biddingprices from bidding where userid=$1 group by userid,propertyid) bp on bp.propertyid=pd.id left outer join propertyaddress pa on pa.propertyid=pd.id left join country c on c.id=pa.countryid left join state s on s.id=pa.stateid left join city ci on ci.id=pa.cityid left join area a on a.id=pa.areaid left join propertytypes pt on pt.id=pd.propertytypeid where pd.status='Active' limit $2", [userid, page]).then((data) => {

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
    })


}


{
    tenantRouter.get('/BiddingGetByuseridnew/:userid/:page', (req, res, next) => {

        var userid = req.params.userid;
        var propertyArray = [];
        var page = 8;
        var offset = (req.params.page) * 8;

        db.any("select pd.id,pd.propertyname,pd.posteddate,pt.propertytype,ci.cityname,pd.price,bp.biddingprices,pd.propertyarea from propertydetails pd join (select userid,propertyid,array_to_json(array_agg(biddingprice)) as biddingprices from bidding where userid=$1 group by userid,propertyid) bp on bp.propertyid=pd.id left outer join propertyaddress pa on pa.propertyid=pd.id left join country c on c.id=pa.countryid left join state s on s.id=pa.stateid left join city ci on ci.id=pa.cityid left join area a on a.id=pa.areaid left join propertytypes pt on pt.id=pd.propertytypeid where pd.status='Active' order by id desc limit $2 offset $3", [userid, page, offset]).then((data) => {


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
    })


}





{

    tenantRouter.post('/getLatLng/:limit', (req, res, next) => {
        var propertyArray = []
        var lat = req.body.lat
        var long = req.body.long
        var limit = 10;
        var offset = (req.params.limit - 1) * 10


        var propertytypeid = req.body.propertyTypeId;


        if (req.body.propertyTypeId == undefined) {
            propertytypeid = `{` + ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]) + `}`;
        }
        else {
            propertytypeid = `{` + (propertytypeid) + `}`;

        }


        var userId = req.body.userid
        var radius = req.body.radius;

        var minprice = req.body.minprice;
        var maxprice = req.body.maxprice;

        if (radius == undefined) {
            radius = 10;
        }
        if (minprice == undefined || minprice == null || minprice == 'null' || minprice == 'undefined' || minprice == '') {

            minprice = 0;
        }

        if (maxprice == undefined || maxprice == null || maxprice == 'null' || maxprice == 'undefined' || maxprice == '') {

            maxprice = 100000000;
        }

        if (userId == 'undefined' || userId == undefined || userId == null || userId == 'null') {

            db.any(`select *  from  (select a.*,ar.*, o.*,pt.*,(2 * 3961 * asin(sqrt((sin(radians((o.latitude - $1)
            / 2))) ^ 2 +cos(radians($1)) * cos(radians(o.latitude)) *(sin(radians( (o.longitude - $2)/ 2)))^
            2)))  as distance from propertyaddress o join propertydetails 
            a on o.propertyid=a.id join area ar on ar.id=o.areaid
            join propertytypes pt on pt.id=a.propertytypeid and status='Active') 
            as tb1 where tb1.distance<$5 and tb1.propertytypeid=ANY($4::int[]) and tb1.price
            between $6 and $7 order by tb1.distance, propertyid desc limit $3 offset $8`, [lat, long, limit, propertytypeid, radius, minprice, maxprice, offset]).then((data) => {



                db.any("insert into domainlogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:  tenant','ITR','INFO','Get LatLng successfully','tenant',TRUE)").then((log) => {
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
                                        offset: offset,
                                        message: "Get LatLng succesfully"
                                    })
                                }
                            })

                        })
                    } else {

                        res.status(200).send({
                            result: true,
                            error: "NOERROR",
                            data: [],
                            message: "No Data Found for LatLng",
                            offset: offset
                        })
                    }
                })
            })

                .catch(error => {

                    db.any("insert into domainlogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:  tenant','ITR','ERR','unable to Get LatLng','tenant',FALSE)").then((log) => {
                        res.status(404).send({
                            result: false,
                            error: error.message,
                            data: "ERROR",
                            message: "unable to Get LatLng"
                        })
                    })


                })
        }
        else {

            db.any(`select * from  (select a.*,ar.areaname,ar.zipcode, o.address,o.pincode,o.latitude,o.longitude,pt.propertytype,o.propertyid,
                (2 * 3961 * asin(sqrt((sin(radians((o.latitude - $1)/ 2))) ^ 2 +cos(radians($1))
                * cos(radians(o.latitude)) *(sin(radians( (o.longitude -$2)/ 2)))^
                2)))  as distance from propertyaddress o join propertydetails a on o.propertyid=a.id join area ar
                on ar.id=o.areaid 
                join propertytypes pt on pt.id=a.propertytypeid and status='Active') as tb1
                left outer join (select (pv.propertyid) as userviewd,pv.contactviewed,pv.userid 
                from propertyviews pv where pv.userid=$3) as v1 on v1.userviewd=tb1.id 
                where tb1.distance<$6 and tb1.price  between $7 and $8 
                and tb1.propertytypeid=ANY($4::int[]) order by tb1.distance  limit $5 offset $9`, [lat, long, userId, propertytypeid, limit, radius, minprice, maxprice, offset]).then((data) => {
                db.any("insert into domainlogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:  tenant','ITR','INFO','Get LatLng successfully','tenant',TRUE)").then((log) => {
                    if (data.length > 0) {
                        data.forEach(prop => {
                            myPath = path.join('./', 'Gallery/' + prop.id + '/Images/');

                            fs.readdir(myPath, (err, files) => {
                                if (files == undefined) {
                                    prop['img'] = "http://localhost:3400/no_image.gif"
                                    propertyArray.push(prop)
                                } else {
                                    prop['img'] = "http://localhost:3400/" + prop.id + "/Images/" + files[0]
                                    propertyArray.push(prop)

                                }
                                if (data.length == propertyArray.length) {

                                    res.status(200).send({
                                        result: true,
                                        error: "NOERROR",
                                        data: propertyArray,
                                        offset: offset,
                                        message: "Get LatLng succesfully"
                                    })
                                }
                            })

                        })
                    } else {

                        res.status(200).send({
                            result: true,
                            error: "NOERROR",
                            data: [],
                            message: "No Data Found for LatLng",
                            offset: offset
                        })
                    }
                })
            })

                .catch(error => {

                    db.any("insert into domainlogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:  tenant','ITR','ERR','unable to Get LatLng','tenant',FALSE)").then((log) => {
                        res.status(404).send({
                            result: false,
                            error: error.message,
                            data: "ERROR",
                            message: "unable to Get LatLng"
                        })
                    })


                })
        }



    })

}



tenantRouter.get('/getpropertybyareaorcity/:area/:city', (req, res) => {
    // var db = pgr(conntstr);
    var area = req.params.area;

    var area1 = area.trim();

    var city = req.params.city;

    var city1 = city.trim();


    db.any('select * from fn_propertybyareaorcity($1,$2)', [city1, area1]).then(data => {
        db.any("insert into domainlogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:  tenant','ITR','INFO','Get propertybyareaorcity successfully','tenant',TRUE)").then((log) => {

            if (data.length > 0) {

                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "Get propertybyareaorcity succesfully"
                })
            }
            else {

                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found for propertybyareaorcity"
                })
            }
        })

    })
        .catch(error => {

            db.any("insert into domainlogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:  tenant','ITR','ERR','unable to Get propertybyareaorcity','tenant',FALSE)").then((log) => {
                res.status(404).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "unable to Get propertybyareaorcity"
                })
            })


        })

})


{
    tenantRouter.post('/Contactpost/', (req, res, next) => {
        var name = req.body.name;
        var email = req.body.email;
        var message = req.body.message;
        var status = 'A';
        var dt = new Date();
        let month = dt.getMonth() + 1;
        let date = dt.getFullYear() + '-' + month + '-' + dt.getDate();
        try {
            db.any('select fn_contactus_insert ($1,$2,$3,$4,$5)', [name, email, message, status, date]).then(data => {
                db.any("insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:  Tenant','ITR','INFO','posted Contact successful','  Tenant',True)").then((log) => {

                    res.status(200).send({
                        result: true,
                        error: "NOERROR",
                        data: data,
                        message: "posted Contact successful"
                    })
                })
            })
        }

        catch (error) {
            db.any("insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:  Tenant','ITR','ERR','unable to post Contact','  Tenant',False)").then((log) => {
                res.status(404).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "unable to post Contact"
                })
            })
        }

    })

}




///getPropertyDetail/forMap
{

    tenantRouter.get('/getPropertyDetail/forMap/:propertyId', (req, res) => {
        var propertyId = req.params.propertyId;
        var propertyArray = []


        db.any('select * from fn_propertydetailsmap($1)', propertyId).then(data => {


            if (data.length > 0) {
                data.forEach(prop => {
                    myPath = path.join('./', 'Gallery/' + propertyId + '/Images/');

                    fs.readdir(myPath, (err, files) => {

                        if (files == undefined) {


                            prop['img'] = "http://localhost:3400/no_image.gif"

                            propertyArray.push(prop)

                        }
                        else {

                            prop['img'] = "http://localhost:3400/" + propertyId + "/Images/" + files[0]
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
            .catch(error => {

                db.any("insert into domainlogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:  tenant','ITR','ERR','unable to Get propertybyareaorcity','tenant',FALSE)").then((log) => {
                    res.status(404).send({
                        result: false,
                        error: error.message,
                        data: "ERROR",
                        message: "unable to Get propertybyareaorcity"
                    })
                })


            })

    })


}


{
    tenantRouter.get('/getallfavs/:userid/:propertyid', (req, res, next) => {
        var userid = req.params.userid;
        var property_id = req.params.propertyid;
        db.any("select * from fn_getfav($1,$2)", [userid, property_id]).then((data) => {


            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: " get favourites Successfully"
                })
            }
            else {
                res.status(200).send({
                    result: false,
                    error: "NOERROR",
                    data: "NDF",
                    message: " no favourites found"
                })
            }

        })


            .catch(error => {

                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: " Unable to get favourites"
                });
            });
    })
}




{


    //insert data into enquiry_form
    {
        tenantRouter.post('/enquiryForm/Post', (req, res, next) => {
            var userid = req.body.userid;
            var propertytypeid = req.body.propertytypeid;
            var minprice = req.body.minprice;
            var maxprice = req.body.maxprice;
            var facing = req.body.facing;
            var country = req.body.countryname;
            var state = req.body.statename;
            var city = req.body.cityname;
            var area = req.body.areaname;

            db.any("select fn_enquiryformInsert($1,$2,$3,$4,$5,$6,$7,$8,$9)", [userid, propertytypeid, minprice, maxprice, facing, country, state, city, area]).then((data) => {
                if (data.length > 0) {
                    res.status(200).send({
                        result: true,
                        error: "NOERROR",
                        data: data,
                        message: " EnqueryForm Added Successfully"
                    })
                } else {
                    res.status(200).send({
                        result: true,
                        error: "NOERROR",
                        data: "NDF",
                        message: "No Data in enqueryform"
                    })
                }
            })
                .catch(error => {
                    res.status(200).send({
                        result: false,
                        error: error.message,
                        data: "ERROR",
                        message: "Unable to Add enqueryform"
                    })
                })
        })

    }


    //get enquiry from data by userid
    {
        tenantRouter.get("/getDataInEnquiryForm/:userid", (req, res, next) => {
            var userid = req.params.userid;

            db.any("select * from fn_getEnquiryform($1)", [userid]).then((data) => {
                //  console.log(data)
                if (data.length > 0) {
                    res.status(200).send({
                        result: true,
                        error: "NOERROR",
                        data: data,
                        message: "Enqueryform get Successfully"
                    })
                } else {
                    res.status(200).send({
                        result: true,
                        error: "NOERROR",
                        data: "NDF",
                        message: "No Data in enqueryform"
                    })
                }
            })
                .catch(error => {
                    res.status(200).send({
                        result: false,
                        error: error.message,
                        data: "ERROR",
                        message: "Unable to get enqueryform"
                    })
                })
        })
    }


    //update enquiry_form based on userid
    {
        tenantRouter.put('/updateEnquiryForm/:userid', (req, res, next) => {
            // console.log(req.body)
            var userid = req.params.userid;
            var propertytypeid = req.body.propertytypeid;
            var minprice = req.body.minprice;
            var maxprice = req.body.maxprice;
            var facing = req.body.facing;
            var country = req.body.countryname;
            var state = req.body.statename;
            var city = req.body.cityname;
            var area = req.body.areaname;

            db.any('select * from  fn_updateEnquiryForm($1,$2,$3,$4,$5,$6,$7,$8,$9)', [propertytypeid, minprice, maxprice, facing, country, state, city, area, userid]).then((data) => {
                if (data.length > 0) {
                    res.status(200).send({
                        result: true,
                        error: "NOERROR",
                        data: data,
                        message: "enquiryfrom works"
                    })
                }
                else {

                    res.status(200).send({
                        result: false,
                        error: "NOERROR",
                        data: "NDF",
                        message: "No Data Found enquiryfrom"
                    })
                }

            })
                .catch(error => {

                    res.status(404).send({
                        result: false,
                        error: error.message,
                        data: "ERROR",
                        message: "unable to view  enquiryfrom"
                    })

                })
        })
    }
    //get enquiry from data by userid

    {
        tenantRouter.post("/getRecommendationsData1/:page", (req, res, next) => {

            var countryid = req.body.countryid;
            var userid = req.body.userid;

            var propertytypeid = req.body.propertytypeid;
            var minprice = req.body.minprice;
            var maxprice = req.body.maxprice;
            var facing = req.body.facing;
            var countryid = req.body.countryid;
            var stateid = req.body.stateid;


            var cityid = req.body.cityid;
            var areaid = req.body.areaid;

            var page = (req.params.page) * 10;


            var cityid = parseInt(cityid);

            if (areaid != null) {
                var areaid = parseInt(areaid);
            }

            var propertyArray = [];

            if (propertytypeid == undefined) {
                propertytypeid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
            }
            if (facing == undefined) {
                facing = ['East', 'North', 'South', 'West', 'South East', 'South West', 'North East', 'North West']
            }

            if (minprice == undefined) {
                minprice = 0
            }
            if (maxprice == undefined) {
                maxprice = 100000000
            }

            facingarray = facing

            propertyarray = propertytypeid

            var pt = `{` + (propertytypeid) + `}`;
            var fc = `{` + (facing) + `}`;

            var p1 = [propertytypeid];


            var f1 = [facing];



            if (areaid != null) {



                db.any('select * from fn_recomendationswitharea($1,$2,$3,$4,$5,$6,$7,$8,$9)', [cityid, countryid, stateid, areaid, pt, fc, minprice, maxprice, page]).then((rdata) => {

                    if (rdata.length > 0) {
                        rdata.forEach(prop => {
                            myPath = path.join('./', 'Gallery/' + prop.propertyid + '/Images/');
                            fs.readdir(myPath, (err, files) => {
                                if (files == undefined) {
                                    prop['img'] = "http://localhost:3400/no_image.gif";
                                    propertyArray.push(prop)
                                } else {
                                    prop['img'] = "http://localhost:3400/" + prop.propertyid + "/Images/" + files[0]
                                    propertyArray.push(prop)
                                }
                                if (rdata.length == propertyArray.length) {




                                    res.status(200).send({
                                        result: true,
                                        error: "No Error",
                                        data: propertyArray,
                                        message: "get Recommendations Data  "
                                    })
                                }
                            })
                        })
                    }
                    else {

                        res.status(200).send({
                            result: true,
                            error: "No Error",
                            data: "NDF",
                            message: "get Recommendations Data  "
                        })
                    }

                })
            }
            else {


                db.any('select * from fn_recomendationswithoutarea($1,$2,$3,$4,$5,$6,$7,$8)', [cityid, countryid, stateid, pt, fc, minprice, maxprice, page]).then((rdata) => {

                    if (rdata.length > 0) {
                        rdata.forEach(prop => {
                            myPath = path.join('./', 'Gallery/' + prop.propertyid + '/Images/');
                            fs.readdir(myPath, (err, files) => {
                                if (files == undefined) {
                                    prop['img'] = "http://localhost:3400/no_image.gif";
                                    propertyArray.push(prop)
                                } else {
                                    prop['img'] = "http://localhost:3400/" + prop.propertyid + "/Images/" + files[0]
                                    propertyArray.push(prop)
                                }
                                if (rdata.length == propertyArray.length) {




                                    res.status(200).send({
                                        result: true,
                                        error: "No Error",
                                        data: propertyArray,
                                        message: "get Recommendations Data  "
                                    })
                                }
                            })
                        })
                    }
                    else {
                        res.status(200).send({
                            result: true,
                            error: "No Error",
                            data: "NDF",
                            message: "get Recommendations Data  "
                        })
                    }
                })
            }



            // console.log(countryid)

            // db.any("select * from fn_getRecommendation($1,$2)", [countryid,userid]).then((data) => {

            //     if (data.length > 0) {
            //         for (let index = 0; index < data.length; index++) {
            //             // console.log(data[index].stateid +" " +req.body.stateid)
            //             if (data[index].stateid === req.body.stateid) {
            //                 filter5.push(data[index])
            //                 count5 = 1;
            //             }
            //         }
            //         if (count5 == 0) {
            //             filter5 = data;
            //             // console.log(filter5.length);
            //         }
            //         // console.log(filter5.length);
            //         for (let index = 0; index < filter5.length; index++) {
            //             // console.log('8')
            //             if (parseInt(filter5.cityid) == parseInt(req.body.cityid)) {
            //                 filter_city.push(filter5[index])
            //                 count6 = 1;
            //             }

            //         }
            //         if (count6 == 0) {
            //             filter_city = filter5;
            //             // console.log(filter_city.length);
            //         }
            //         // console.log(filter_city.length);
            //         // console.log(filter_city)
            //         for (let index = 0; index < filter_city.length; index++) {
            //             // console.log(7)
            //             if (filter_city[index].face == req.body.facing) {
            //                 filter.push(filter_city[index])
            //                 count = 1;
            //             }
            //         }
            //         if (count == 0) {
            //             filter = filter_city;
            //         }

            //         for (let index = 0; index < filter.length; index++) {
            //             // console.log('6')
            //             if (parseInt(filter[index].propertytypeid) == parseInt(req.body.propertytypeid)) {

            //                 filter1.push(filter[index])
            //                 count1 = 1;
            //             }
            //         }
            //         if (count1 == 0) {
            //             filter1 = filter;
            //         }
            //         for (let index = 0; index < filter1.length; index++) {
            //             // console.log('5')
            //             if (parseInt(filter1[index].areaid) == parseInt(req.body.areaid)) {
            //                 filter2.push(filter1[index])
            //                 count2 = 1;
            //             }
            //         }
            //         if (count2 == 0) {
            //             filter2 = filter1;
            //         }
            //         for (let index = 0; index < filter2.length; index++) {
            //             // console.log('4');
            //             if (parseInt(filter2[index].price) >= req.body.minprice) {
            //                 filter3.push(filter2[index])
            //                 count3 = 1;
            //             }
            //         }
            //         if (count3 == 0) {
            //             filter3 = filter2;
            //         }
            //         for (let index = 0; index < filter3.length; index++) {
            //             // console.log('3')
            //             if (parseInt(filter3[index].price) <= req.body.maxprice) {
            //                 filter4.push(filter3[index])
            //                 count4 = 1;
            //             }

            //         }
            //         if (count4 == 0) {
            //             filter4 = filter3;
            //         }
            //         totalcount = count + count1 + count2 + count3 + count4 + count5 + count6;
            //         if (totalcount >= 3) {


            //         }
            //         else {

            //         }


            //         filter4.forEach(prop => {
            //             myPath = path.join('./', 'Gallery/' + prop.propertyid + '/Images/');
            //             fs.readdir(myPath, (err, files) => {

            //                 if (files == undefined) {


            //                     prop['img'] = "http://localhost:3400/no_image.gif"

            //                     propertyArray.push(prop)

            //                 }
            //                 else {
            //                     prop['img'] = "http://localhost:3400/" + prop.propertyid + "/Images/" + files[0]
            //                     propertyArray.push(prop)


            //                 }
            //                 if (filter4.length == propertyArray.length) {
            //                     // console.log(propertyArray)
            //                     res.status(200).send({
            //                         result: true,
            //                         error: "No Error",
            //                         data: propertyArray,
            //                         message: "get Recommendations Data  "
            //                     })

            //                 }


            //             })

            //         })

            //     }

            //     //  console.log(data)

            //     else {
            //         res.status(200).send({
            //             result: true,
            //             error: "NOERROR",
            //             data: "NDF",
            //             message: "No Data Found as recommendations"
            //         })
            //     }


            // })

            // .catch(error => {

            //     res.status(404).send({
            //         result: false,
            //         error: error.message,
            //         data: "ERROR",
            //         message: "unable to view  recommendations"
            //     })

            // })
        })
    }
}


{
    tenantRouter.post("/getRecommendationsData1new/:page", (req, res, next) => {

        var countryid = req.body.countryid;
        var userid = req.body.userid;

        var propertytypeid = req.body.propertytypeid;
        var minprice = req.body.minprice;
        var maxprice = req.body.maxprice;
        var facing = req.body.facing;
        var countryid = req.body.countryid;
        var stateid = req.body.stateid;


        var cityid = req.body.cityid;
        var areaid = req.body.areaid;

        // var page = (req.params.page) * 10;


        var page = 10;

        var offset = (req.params.page - 1) * 10;


        var cityid = parseInt(cityid);

        if (areaid != null) {
            var areaid = parseInt(areaid);
        }

        var propertyArray = [];

        if (propertytypeid == undefined) {
            propertytypeid = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
        }
        if (facing == undefined) {
            facing = ['East', 'North', 'South', 'West', 'South East', 'South West', 'North East', 'North West']
        }

        if (minprice == undefined) {
            minprice = 0
        }
        if (maxprice == undefined) {
            maxprice = 100000000
        }

        facingarray = facing

        propertyarray = propertytypeid

        var pt = `{` + (propertytypeid) + `}`;
        var fc = `{` + (facing) + `}`;

        var p1 = [propertytypeid];


        var f1 = [facing];



        if (areaid != null) {



            db.any('select * from fn_recomendationswithareanew($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [cityid, countryid, stateid, areaid, pt, fc, minprice, maxprice, page, offset]).then((rdata) => {

                if (rdata.length > 0) {
                    rdata.forEach(prop => {
                        myPath = path.join('./', 'Gallery/' + prop.propertyid + '/Images/');
                        fs.readdir(myPath, (err, files) => {
                            if (files == undefined) {
                                prop['img'] = "http://localhost:3400/no_image.gif";
                                propertyArray.push(prop)
                            } else {
                                prop['img'] = "http://localhost:3400/" + prop.propertyid + "/Images/" + files[0]
                                propertyArray.push(prop)
                            }
                            if (rdata.length == propertyArray.length) {




                                res.status(200).send({
                                    result: true,
                                    error: "No Error",
                                    data: propertyArray,
                                    offset: offset,
                                    message: "get Recommendations Data  "
                                })
                            }
                        })
                    })
                }
                else {

                    res.status(200).send({
                        result: true,
                        error: "No Error",
                        data: [],
                        offset: offset,
                        message: "get Recommendations Data  "
                    })
                }

            })
        }
        else {


            db.any('select * from fn_recomendationswithoutareanew($1,$2,$3,$4,$5,$6,$7,$8,$9)', [cityid, countryid, stateid, pt, fc, minprice, maxprice, page, offset]).then((rdata) => {

                if (rdata.length > 0) {
                    rdata.forEach(prop => {
                        myPath = path.join('./', 'Gallery/' + prop.propertyid + '/Images/');
                        fs.readdir(myPath, (err, files) => {
                            if (files == undefined) {
                                prop['img'] = "http://localhost:3400/no_image.gif";
                                propertyArray.push(prop)
                            } else {
                                prop['img'] = "http://localhost:3400/" + prop.propertyid + "/Images/" + files[0]
                                propertyArray.push(prop)
                            }
                            if (rdata.length == propertyArray.length) {




                                res.status(200).send({
                                    result: true,
                                    error: "No Error",
                                    data: propertyArray,
                                    offset: offset,
                                    message: "get Recommendations Data  "
                                })
                            }
                        })
                    })
                }
                else {
                    res.status(200).send({
                        result: true,
                        error: "No Error",
                        data: [],
                        offset: offset,
                        message: "get Recommendations Data  "
                    })
                }
            })
        }

    })
}






tenantRouter.get('/search/all/:valuename/:limit', (req, res, next) => {

    var propertyname = req.params.valuename;
    var limit = (req.params.limit) * 5;
    var propertyArray = []




    db.any("select pd.posteddate,pt.propertytype,pd.propertyname,pd.id,pd.facing,pd.rentalperiod,pd.nearlukverified,pd.price,pd.propertytypeid,pd.description,pa.address,pa.pincode,c.countryname,s.statename,ci.cityname,a.areaname FROM  propertydetails pd join propertyaddress pa on pd.id=pa.propertyid join propertytypes pt on pt.id=pd.propertytypeid join country c on c.id=pa.countryid join state s on s.id=pa.stateid join city ci on ci.id=pa.cityid join area a on a.id=pa.areaid where (pd.propertyname ILIKE  '%' || $1 || '%' or pt.propertytype ILIKE '%'||$1||'%'  or pd.description ILIKE '%'||$1||'%'  or pa.address ILIKE '%'||$1||'%' or pa.pincode ILIKE '%'||$1||'%' or c.countryname ILIKE '%'||$1||'%' or s.statename ILIKE '%'||$1||'%' or  ci.cityname ILIKE '%'||$1||'%' or a.areaname ILIKE '%'||$1||'%') and status='Active'  limit $2", [propertyname, limit]).then((data) => {



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

                            prop['img'] = "http://localhost:3400/" + prop.id + "/Images/" + files[0]
                            propertyArray.push(prop)

                        }
                        if (data.length == propertyArray.length) {
                            res.status(200).send({
                                result: true,
                                error: "NOERROR",
                                data: propertyArray,
                                message: "Get search properties succesfully"
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
                    message: " Unable to View  search Properties"
                });
            });
        })
})



// Featured properties filters


{
    tenantRouter.post('/FeaturedProperty/filters/:userid/:page', (req, res, next) => {

        var facing = req.body.facing;
        var minprice = req.body.minprice;
        var maxprice = req.body.maxprice;
        var verify = req.body.veification;
        var Featured = req.body.feateredType;
        var page = (req.params.page) * 10;
        var userId = req.params.userid;
        if (facing == undefined) {
            facing = ['East', 'North', 'South', 'West', 'South East', 'South West', 'North East', 'North West']
        }
        if (minprice == undefined) {
            minprice = 0
        }
        if (maxprice == undefined) {
            maxprice = 1000000000
        }
        if (verify == undefined) {
            verify = ['N', 'V']
        } else if (verify != undefined) {
            verify = req.body.veification.name;
        }
        facingarray = facing
        var fc = `{` + (facing) + `}`;
        var verf1 = `{` + (verify) + `}`;
        var f1 = [facing];

        if (userId == 'undefined' || userId == undefined || userId == null || userId == 'null') {
            db.any("select * from fn_filters($1,$2,$3,$4,$5,$6)", [fc, minprice, maxprice, verf1, Featured, page]).then((data) => {
                var propertyArray = []
                data.forEach(prop => {
                    myPath = path.join('./', 'Gallery/' + prop.propertyid + '/Images/');
                    fs.readdir(myPath, (err, files) => {
                        if (files == undefined) {
                            prop['img'] = "http://localhost:3400/no_image.gif";
                            propertyArray.push(prop)
                        } else {
                            prop['img'] = "http://localhost:3400/" + prop.propertyid + "/Images/" + files[0]
                            propertyArray.push(prop)
                        }
                        if (data.length == propertyArray.length) {

                            res.send(propertyArray)
                        }
                    })
                })
                if (data.length == 0) {
                    res.send(data);
                }
            })
                .catch(error => {
                    db.any("insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:Institute','ITR','ERR','Filter Get error','tenant',False)").then((log) => {
                        res.status(200).send({
                            message: " Unable to View filterget"
                        });
                    });
                })
        }

        else {
            db.any("select * from fn_filtersbyuserid($1,$2,$3,$4,$5,$6,$7)", [fc, minprice, maxprice, verf1, Featured, userId, page]).then((data) => {
                var propertyArray = []
                data.forEach(prop => {
                    myPath = path.join('./', 'Gallery/' + prop.propertyid + '/Images/');
                    fs.readdir(myPath, (err, files) => {
                        if (files == undefined) {
                            prop['img'] = "http://localhost:3400/no_image.gif";
                            propertyArray.push(prop)
                        } else {
                            prop['img'] = "http://localhost:3400/" + prop.propertyid + "/Images/" + files[0]
                            propertyArray.push(prop)
                        }
                        if (data.length == propertyArray.length) {

                            res.send(propertyArray)
                        }
                    })
                })
                if (data.length == 0) {
                    res.send(data);
                }
            })

                .catch(error => {
                    db.any("insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:Institute','ITR','ERR','Filter Get error','tenant',False)").then((log) => {
                        res.status(200).send({
                            message: " Unable to View filterget"
                        });
                    });
                })
        }


    })

}


{
    tenantRouter.post('/FeaturedPropertynew/filters/:userid/:page', (req, res, next) => {

        var facing = req.body.facing;
        var minprice = req.body.minprice;
        var maxprice = req.body.maxprice;
        var verify = req.body.veification;
        var Featured = req.body.feateredType;
        var page = 10;

        var offset = (req.params.page - 1) * 10;
        var userId = req.params.userid;
        if (facing == undefined) {
            facing = ['East', 'North', 'South', 'West', 'South East', 'South West', 'North East', 'North West']
        }
        if (minprice == undefined) {
            minprice = 0
        }
        if (maxprice == undefined) {
            maxprice = 1000000000
        }
        if (verify == undefined) {
            verify = ['N', 'V']
        } else if (verify != undefined) {
            verify = req.body.veification.name;
        }
        facingarray = facing
        var fc = `{` + (facing) + `}`;
        var verf1 = `{` + (verify) + `}`;
        var f1 = [facing];

        if (userId == 'undefined' || userId == undefined || userId == null || userId == 'null') {
            db.any("select * from fn_filtersnew($1,$2,$3,$4,$5,$6,$7)", [fc, minprice, maxprice, verf1, Featured, page, offset]).then((data) => {

                var propertyArray = []
                data.forEach(prop => {
                    myPath = path.join('./', 'Gallery/' + prop.propertyid + '/Images/');
                    fs.readdir(myPath, (err, files) => {
                        if (files == undefined) {
                            prop['img'] = "http://localhost:3400/no_image.gif";
                            propertyArray.push(prop)
                        } else {
                            prop['img'] = "http://localhost:3400/" + prop.propertyid + "/Images/" + files[0]
                            propertyArray.push(prop)
                        }
                        if (data.length == propertyArray.length) {

                            res.send(propertyArray)
                        }
                    })
                })
                if (data.length == 0) {
                    res.send([]);
                }
            })
                .catch(error => {
                    db.any("insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:Institute','ITR','ERR','Filter Get error','tenant',False)").then((log) => {
                        res.status(200).send({
                            message: " Unable to View filterget"
                        });
                    });
                })
        }

        else {
            db.any("select * from fn_filtersbyuseridnew($1,$2,$3,$4,$5,$6,$7,$8)", [fc, minprice, maxprice, verf1, Featured, userId, page, offset]).then((data) => {

                var propertyArray = []
                data.forEach(prop => {
                    myPath = path.join('./', 'Gallery/' + prop.propertyid + '/Images/');
                    fs.readdir(myPath, (err, files) => {
                        if (files == undefined) {
                            prop['img'] = "http://localhost:3400/no_image.gif";
                            propertyArray.push(prop)
                        } else {
                            prop['img'] = "http://localhost:3400/" + prop.propertyid + "/Images/" + files[0]
                            propertyArray.push(prop)
                        }
                        if (data.length == propertyArray.length) {

                            res.send(propertyArray)
                        }
                    })
                })
                if (data.length == 0) {
                    res.send(data);
                }
            })

                .catch(error => {
                    db.any("insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:Institute','ITR','ERR','Filter Get error','tenant',False)").then((log) => {
                        res.status(200).send({
                            message: " Unable to View filterget"
                        });
                    });
                })
        }


    })

}

tenantRouter.get('/getLoans/', (req, res, next) => {
    // var userid = req.params.userid;
    var propertyArray = []
    db.any('select * from moversandpackersandloan where itemid=2').then((data) => {
        db.any("insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:tenant','ITR','INFO','View of Getallproperties Table successfull','tenant',true)").then((log) => {
            if (data.length > 0) {
                data.forEach(prop => {
                    myPath = path.join('./', 'loan/');
                    fs.readdir(myPath, (err, files) => {
                        if (files == undefined) {
                            prop['img'] = "http://localhost:3400/Profile/NoProfile/noprofile.png"
                            propertyArray.push(prop)
                        }
                        else {

                            prop['img'] = "http://localhost:3400/" + files[0]
                            propertyArray.push(prop)

                        }
                        if (data.length == propertyArray.length) {
                            res.status(200).send({
                                result: true,
                                error: "NOERROR",
                                data: propertyArray,
                                message: "Get packers,movers and lones succesfully"
                            })
                            // console.log(propertyArray)
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
                    message: " Unable to View loans Detyails"
                });
            });
        })
})

tenantRouter.get('/getPakcers/', (req, res, next) => {
    // var userid = req.params.userid;
    var propertyArray = []
    db.any('select * from moversandpackersandloan where itemid=1').then((data) => {
        db.any("insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:tenant','ITR','INFO','View of Getallproperties Table successfull','tenant',true)").then((log) => {
            if (data.length > 0) {
                data.forEach(prop => {
                    myPath = path.join('./', 'packers/');
                    fs.readdir(myPath, (err, files) => {
                        if (files == undefined) {
                            prop['img'] = "http://localhost:3400/Profile/NoProfile/noprofile.png"
                            propertyArray.push(prop)
                        }
                        else {

                            prop['img'] = "http://localhost:3400/" + files[0]
                            propertyArray.push(prop)

                        }
                        if (data.length == propertyArray.length) {
                            res.status(200).send({
                                result: true,
                                error: "NOERROR",
                                data: propertyArray,
                                message: "Get packers,movers and lones succesfully"
                            })
                            // console.log(propertyArray)
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
                    message: " Unable to View loans Detyails"
                });
            });
        })
})


{
    tenantRouter.post('/get/all/featured/propertys/:page', (req, res, next) => {


        var page = parseInt(req.params.page);
        var propertyArray = []

        db.any('select * from fn_getallfeartued($1)', [page]).then((data) => {

            if (data.length > 0) {

                data.forEach(prop => {
                    myPath = path.join('./', 'Gallery/' + prop.id + '/Images/');
                    fs.readdir(myPath, (err, files) => {

                        if (files == undefined) {


                            prop['img'] = "http://localhost:3400/no_image.gif"

                            propertyArray.push(prop)

                        }
                        else {

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
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "Get search properties succesfully"
                })
            }


        })
    })
}



tenantRouter.post('/filters/searchnew/:page', (req, res, next) => {//***** */
    var propertyType = req.body.propertyTypeId;
    var facing = req.body.facing;
    var minprice = req.body.minprice;
    var maxprice = req.body.maxprice;
    var verify = req.body.veification;
    var rating = req.body.rating;
    var cityname = req.body.cityName;
    var userid = req.body.userId;
    // var result = cityname.split(",");
    // cityName = result[0]
    // stateName = result[1]
    var location = req.body.location;
    var locationId = req.body.locationId;

    // db.any("select * from fn_getcityid_bycitandstatename($1,$2)", [cityName, stateName]).then((data) => {

    // var cityid = parseInt(data[0].cityid);

    var k = 8;
    var offset = (req.params.page) * 8

    // var k = 1000
    if (propertyType == undefined) {
        propertyType = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
    }
    if (facing == undefined) {
        facing = ['East', 'North', 'South', 'West', 'South East', 'South West', 'North East', 'North West']
    }

    if (minprice == undefined) {
        minprice = 0
    }
    if (maxprice == undefined) {
        maxprice = 1000000000
    }
    if (verify == undefined) {

        verify = ['N', 'V']
    }

    facingarray = facing

    propertyarray = propertyType

    var pt = `{` + (propertyType) + `}`;
    var fc = `{` + (facing) + `}`;

    var p1 = [propertyType];

    var verf1 = `{` + (verify) + `}`;
    var f1 = [facing];

    if (rating != undefined) {
        if (userid == 'undefined' || userid == undefined || userid == null || userid == 'null') {

            if (location == 'city') {
                db.any("select * from fn_filterswithratinguseridnew($1,$2,$3,$4,$5,$6,$7,$8,$9)", [locationId, pt, fc, minprice, maxprice, verf1, k, rating, offset]).then((data) => {
                    var propertyArray = []
                    data.forEach(prop => {
                        myPath = path.join('./', 'Gallery/' + prop.propertyid + '/Images/');

                        fs.readdir(myPath, (err, files) => {
                            if (files == undefined) {
                                prop['img'] = "http://localhost:3400/no_image.gif";
                                propertyArray.push(prop)
                            }
                            else {
                                prop['img'] = "http://localhost:3400/" + prop.propertyid + "/Images/" + files[0]
                                propertyArray.push(prop)
                            }
                            if (data.length == propertyArray.length) {
                                res.send(propertyArray)
                            }

                        })

                    })
                    if (data.length == 0) {
                        res.send(data);
                    }

                })
            }
            else {
                db.any("select * from fn_filterswithratinguseridnewwitharea($1,$2,$3,$4,$5,$6,$7,$8,$9)", [locationId, pt, fc, minprice, maxprice, verf1, k, rating, offset]).then((data) => {
                    var propertyArray = []
                    data.forEach(prop => {
                        myPath = path.join('./', 'Gallery/' + prop.propertyid + '/Images/');

                        fs.readdir(myPath, (err, files) => {
                            if (files == undefined) {
                                prop['img'] = "http://localhost:3400/no_image.gif";
                                propertyArray.push(prop)
                            }
                            else {
                                prop['img'] = "http://localhost:3400/" + prop.propertyid + "/Images/" + files[0]
                                propertyArray.push(prop)
                            }
                            if (data.length == propertyArray.length) {
                                res.send(propertyArray)
                            }

                        })

                    })
                    if (data.length == 0) {
                        res.send(data);
                    }

                })
            }

        }
        else {

            if (location == 'city') {
                db.any("select * from fn_filterswithratingpaginationnew($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)", [locationId, pt, fc, minprice, maxprice, verf1, k, rating, userid, offset]).then((data) => {

                    var propertyArray = []

                    data.forEach(prop => {
                        myPath = path.join('./', 'Gallery/' + prop.propertyid + '/Images/');

                        fs.readdir(myPath, (err, files) => {
                            if (files == undefined) {
                                prop['img'] = "http://localhost:3400/no_image.gif";
                                propertyArray.push(prop)
                            }
                            else {
                                prop['img'] = "http://localhost:3400/" + prop.propertyid + "/Images/" + files[0]
                                propertyArray.push(prop)
                            }
                            if (data.length == propertyArray.length) {
                                res.send(propertyArray)
                            }
                        })
                    })

                    if (data.length == 0) {
                        res.send(data);
                    }

                })
            }
            else {

                db.any("select * from fn_filterswithratingpaginationnewwitharea($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)", [locationId, pt, fc, minprice, maxprice, verf1, k, rating, userid, offset]).then((data) => {

                    var propertyArray = []

                    data.forEach(prop => {
                        myPath = path.join('./', 'Gallery/' + prop.propertyid + '/Images/');

                        fs.readdir(myPath, (err, files) => {
                            if (files == undefined) {
                                prop['img'] = "http://localhost:3400/no_image.gif";
                                propertyArray.push(prop)
                            }
                            else {
                                prop['img'] = "http://localhost:3400/" + prop.propertyid + "/Images/" + files[0]
                                propertyArray.push(prop)
                            }
                            if (data.length == propertyArray.length) {
                                res.send(propertyArray)
                            }
                        })
                    })

                    if (data.length == 0) {
                        res.send(data);
                    }

                })
            }

        }

    }
    else {

        if (userid == 'undefined' || userid == undefined || userid == null || userid == 'null') {


            if (location == 'city') {


                db.any("select * from fn_filterswithoutratinguseridnew($1,$2,$3,$4,$5,$6,$7,$8)", [locationId, pt, fc, minprice, maxprice, verf1, k, offset]).then((data) => {

                    var propertyArray = []
                    data.forEach(prop => {
                        myPath = path.join('./', 'Gallery/' + prop.propertyid + '/Images/');

                        fs.readdir(myPath, (err, files) => {
                            prop['img'] = "http://localhost:3400/no_image.gif"
                            if (files == undefined) {
                                propertyArray.push(prop)
                            }
                            else {
                                prop['img'] = "http://localhost:3400/" + prop.propertyid + "/Images/" + files[0]
                                propertyArray.push(prop)
                            }
                            if (data.length == propertyArray.length) {
                                res.send(propertyArray)
                            }

                        })



                    })


                    if (data.length == 0) {
                        res.send(data);
                    }

                    // res.send(data);
                })

            }
            else {



                db.any("select * from fn_filterswithoutratinguseridnewwitharea($1,$2,$3,$4,$5,$6,$7,$8)", [locationId, pt, fc, minprice, maxprice, verf1, k, offset]).then((data) => {

                    var propertyArray = []
                    data.forEach(prop => {
                        myPath = path.join('./', 'Gallery/' + prop.propertyid + '/Images/');

                        fs.readdir(myPath, (err, files) => {
                            prop['img'] = "http://localhost:3400/no_image.gif"
                            if (files == undefined) {
                                propertyArray.push(prop)
                            }
                            else {
                                prop['img'] = "http://localhost:3400/" + prop.propertyid + "/Images/" + files[0]
                                propertyArray.push(prop)
                            }
                            if (data.length == propertyArray.length) {
                                res.send(propertyArray)
                            }

                        })



                    })


                    if (data.length == 0) {
                        res.send(data);
                    }

                    // res.send(data);
                })
            }
        }
        else {


            if (location == 'city') {
                db.any("select * from fn_filterswithoutratingpaginationnew($1,$2,$3,$4,$5,$6,$7,$8,$9)", [locationId, pt, fc, minprice, maxprice, verf1, k, userid, offset]).then((data) => {

                    var propertyArray = []
                    data.forEach(prop => {
                        myPath = path.join('./', 'Gallery/' + prop.propertyid + '/Images/');

                        fs.readdir(myPath, (err, files) => {
                            prop['img'] = "http://localhost:3400/no_image.gif"
                            if (files == undefined) {
                                propertyArray.push(prop)
                            }
                            else {
                                prop['img'] = "http://localhost:3400/" + prop.propertyid + "/Images/" + files[0]
                                propertyArray.push(prop)
                            }
                            if (data.length == propertyArray.length) {
                                res.send(propertyArray)
                            }

                        })



                    })


                    if (data.length == 0) {
                        res.send(data);
                    }

                })
            }
            else {
                db.any("select * from fn_filterswithoutratingpaginationnewwitharea($1,$2,$3,$4,$5,$6,$7,$8,$9)", [locationId, pt, fc, minprice, maxprice, verf1, k, userid, offset]).then((data) => {

                    var propertyArray = []
                    data.forEach(prop => {
                        myPath = path.join('./', 'Gallery/' + prop.propertyid + '/Images/');

                        fs.readdir(myPath, (err, files) => {
                            prop['img'] = "http://localhost:3400/no_image.gif"
                            if (files == undefined) {
                                propertyArray.push(prop)
                            }
                            else {
                                prop['img'] = "http://localhost:3400/" + prop.propertyid + "/Images/" + files[0]
                                propertyArray.push(prop)
                            }
                            if (data.length == propertyArray.length) {
                                res.send(propertyArray)
                            }

                        })



                    })


                    if (data.length == 0) {
                        res.send(data);
                    }

                })
            }

        }

    }
    // })
    // .catch(error => {
    //     db.any("insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:Institute','ITR','ERR','Filter Get error','tenant',False)").then((log) => {
    //         res.status(200).send({
    //             message: " Unable to View filterget"
    //         });
    //     });
    // })

})


module.exports = tenantRouter;