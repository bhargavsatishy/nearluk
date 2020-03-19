

var fs = require('fs')
var path = require('path')
var express = require('express')
var promise = require('bluebird')
var bodyparser = require('body-parser')
var option = {
    promiseLib: promise
};


var adminRouter = express();
var config = require('../apiconfig')
var conntstr = config.connectionString
const dba = require('../db');
const db = dba.db;
const pgp = db.$config.pgp

adminRouter.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", "Cache-Control,Pragma,Origin,Authorization,Content-Type,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "*");
    return next();
});

adminRouter.use(bodyparser.json({ limit: '30mb' }));
adminRouter.use(bodyparser.urlencoded({ limit: '30mb', extended: true }));


{
    adminRouter.get('/adminhome/:page', (req, res, next) => {
        var propertyArray = []
        var page = (req.params.page) * 10;
        db.any('select * from fn_adminhome($1)',page).then((data) => {
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
                                message: "Admin Home get succesfully"
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
                    message: "No Data Found for Admin Home"
                })
            }


        })
            .catch(error => {

                db.any("insert into domainlogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:  tenant','ITR','ERR','unable to Get propertybyareaorcity','tenant',FALSE)").then((log) => {
                    res.status(404).send({
                        result: false,
                        error: error.message,
                        data: "ERROR",
                        message: "unable to view  Admin home"
                    })
                })


            })


    })
}



{
    adminRouter.put('/Inactive/:propertyid/:status', (req, res) => {

        var propertyid = req.params.propertyid;
        var status = req.params.status;
        db.any("select * from fn_adminpropertystatusupdate($1,$2)", [status, propertyid]).then((data) => {

            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "Update status succesfully"
                })
            }
            else {

                res.status(200).send({
                    result: false,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found Update status"
                })
            }

        })

            .catch(error => {

                res.status(404).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "unable to view  Update status"
                })

            })
    })
}



{

    adminRouter.put('/verification/:propertyid', (req, res) => {


        var propertyid = req.params.propertyid;

        db.any("select * from fn_adminpropertyverified($1)", propertyid).then((data) => {

            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "Nearluk Verified succesfully"
                })
            }
            else {

                res.status(200).send({
                    result: false,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found nearlukverified"
                })
            }

        })

            .catch(error => {

                res.status(404).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "unable to view nearlukverified "
                })

            })
    })
}



{
    adminRouter.post('/verified', (req, res) => {
        var verified = req.body.adminsort;
        var countryid = req.body.countryname;
        var stateid = req.body.statename;
        var cityid = req.body.cityname;
        var areaid = req.body.areaname;
        db.any('select * from fn_adminnearlukverifiednotverified($1,$2,$3,$4,$5)', [verified, countryid, stateid, cityid, areaid]).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: " admin nearluk verified Successfully"
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
                    message: "Unable to view admin nearluk verified "
                })
            })
    })
}





{
    adminRouter.post('/GetSortingActive/', (req, res) => {
        // console.log(req.body)
    var status = req.body.adminsort;
    var countryid = req.body.countryname;
    var stateid = req.body.statename;
    var cityid = req.body.cityname;
    var areaid = req.body.areaname;
    // console.log(verified + countryid + stateid + cityid + areaid)

    db.any('select * from fn_adminnearlukactiveinactive($1,$2,$3,$4,$5)', [status,countryid,stateid,cityid,areaid]).then((data) => {
        // console.log(data)
        if (data.length > 0) {
            res.status(200).send({
                result: true,
                error: "NOERROR",
                data: data,
                message: " get inactive propertry info Successfully"
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
                message: "Unable to view admin inactive property"
            })
        })
})
}

adminRouter.get('/Contacts', (req, res) => {

    db.any("select * from fn_admincontactus()").then(data => {
        if (data.length > 0) {
            res.status(200).send({
                result: true,
                error: "NOERROR",
                data: data,
                message: " get admin verified Successfully"
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
                message: "Unable to view admin verified"
            })
        })
})



adminRouter.put('/AdminContact/:id', (req, res) => {

    var id = req.params.id;

    db.any("select * from fn_admincontactusupdate($1)", id).then(data => {
        if (data.length > 0) {
            res.status(200).send({
                result: true,
                error: "NOERROR",
                data: data,
                message: "Nearluk Verified succesfully"
            })
        }
        else {

            res.status(200).send({
                result: false,
                error: "NOERROR",
                data: "NDF",
                message: "No Data Found nearlukverified"
            })
        }

    })

        .catch(error => {

            res.status(404).send({
                result: false,
                error: error.message,
                data: "ERROR",
                message: "unable to view nearlukverified "
            })

        })
})




module.exports = adminRouter;