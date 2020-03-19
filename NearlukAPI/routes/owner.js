var fs = require('fs')
var path = require('path')
var express = require('express')
var promise = require('bluebird')
var bodyparser = require('body-parser')
var option = {
    promiseLib: promise
};

var ownerRouter = express();
var config = require('../apiconfig')
var conntstr = config.connectionString
const dba = require('../db');
const db = dba.db;
const pgp = db.$config.pgp



ownerRouter.use(function (req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

ownerRouter.use(bodyparser.json({ limit: '50mb' }));
ownerRouter.use(bodyparser.urlencoded({ limit: '50mb', extended: true }));


{
    ownerRouter.post('/OwnerAgent/Add/', (req, res, next) => {
        var propertyId = req.body.propertyId;
        var agentUserId = req.body.agentUserId;
        var status = req.body.status;
        db.any('insert into fn_addOwnerAgent ($1, $2, $3)', [propertyId, agentUserId, status]).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: " OwnerAgent Added Successfully"
                })
            } else {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data OwnerAgent"
                })
            }
        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to Add OwnerAgent"
                })
            })
    })
}




ownerRouter.post('/notificationstatus/:notificationid/:status', (req, res) => {

    var notification_id = req.params.notificationid;
    var status = req.params.status;


    for (let index = 0; index < notification_id.length; index++) {


        try {
            db.any("select fn_tenantnotificationsupdate($1,$2)", [status, notification_id[index]]).then(data => {

                db.any("insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:  tenant','ITR','INFO','updated myproperty successfully','  tenant',True)").then((log) => {

                    res.status(200).send({
                        result: true,
                        error: "NOERROR",
                        data: data,
                        message: "updated myproperty successfully"
                    })
                })
            })



        }


        catch (error) {
            db.any("insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:  tenant','ITR','ERR','unable to update myproperty','  tenant',False)").then((log) => {
                res.status(404).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "unable to update myproperty"
                })
            })
        }

    }
})



module.exports = ownerRouter