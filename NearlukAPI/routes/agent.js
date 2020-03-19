var fs = require('fs')
var path = require('path')
var express = require('express')
var promise = require('bluebird')
var bodyparser = require('body-parser')
var option = {
    promiseLib: promise
};


var agentRouter = express();
var config = require('../apiconfig')
var conntstr = config.connectionString
const dba = require('../db');
const db = dba.db;
const pgp = db.$config.pgp


agentRouter.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", "Cache-Control,Pragma,Origin,Authorization,Content-Type,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "*");
    return next();
});
agentRouter.use(bodyparser.json({ limit: '30mb' }));
agentRouter.use(bodyparser.urlencoded({ limit: '30mb', extended: true }));


{
    agentRouter.post('/AgentReview/Add/', (req, res, next) => {
        var agentUserId = req.body.agentUserId;
        var ownerUserId = req.body.ownerUserId;
        var comment = req.body.comment;
        var cmntDate = req.body.cmntDate;
        var rating = req.body.rating;
        db.any('select * from fn_addAgentReview($1, $2, $3, $4, $5);', [agentUserId, ownerUserId, comment, cmntDate, rating]).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: " AgentReview Added Successfully"
                })
            } else {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data AgentReview"
                })
            }
        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to Add AgentReview"
                })
            })
    })
}


{

    agentRouter.post('/sendnotification', (req, res, body) => {
        var propertyid = req.body.propertyid;
        var fromuserid = req.body.fromuserid;
        var touserid = req.body.touserid;
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
        var postedDate = posted_date;

        db.any('select * from fn_tenantnotificationsadd($1,$2,$3,$4,$5,$6,$7)', [propertyid, touserid, fromuserid, '', postedDate, 'request', 'unseen']).then((data) => {

            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: " AgentReview Added Successfully"
                })
            } else {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data AgentReview"
                })
            }
        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to Add AgentReview"
                })
            })
    })
}




{
    agentRouter.post('/insertOwnerAddAgent/', (req, res, next) => {
        var propertyid = req.body.propertyid;
        var agentuserid = req.body.agentuserid;
        var status = 'P'

        db.any('select fn_owneraddagentinsert($1,$2,$3)', [propertyid, agentuserid, status]).then((data) => {



            if (data.length > 0) {

                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: " owner Added agent Successfully"

                })
            } else {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data owneraddagent"
                })
            }
        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to Add ownweradd agent"
                })
            })
    })
}


{
    agentRouter.get('/getnotificationsbyusername/:userid', (req, res, next) => {
        var userid = req.params.userid;

        db.any('select * from fn_getnotificationsbyusername($1)', userid).then((data) => {

            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "getnotifications get succesfully"
                })
            }
            else {

                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found for notifications"
                })
            }
        })

            .catch(error => {

                res.status(404).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "unable to view  notifications"
                })

            })




    })
}



{
    agentRouter.get('/getagentnotifications/:userid', (req, res, next) => {
        var userid = req.params.userid

        db.any("select * from fn_getagentsownernotificationbyusername($1)", [userid]).then((data) => {

            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "getnotifications get succesfully"
                })
            }
            else {

                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found for notifications"
                })
            }

        })

            .catch(error => {

                res.status(404).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "unable to view  notifications"
                })

            })




    })
}






{
    agentRouter.get('/myowners/:agentuserid/:page', (req, res, next) => {
        var agentuserid = req.params.agentuserid;
        var page = (req.params.page) * 10;
        var propertyArray = []
        db.any('select * from fn_getmyowners($1,$2)', [agentuserid, page]).then((data) => {
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
    agentRouter.get('/dataToSendNotification/:property_id/:agentuserid', (req, res, next) => {
        var property_id = req.params.property_id;
        var agentuserid = req.params.agentuserid;

        db.any("select * from tenantnotifications where propertyid=$1 and touserid=$2 and notificationtype='request'", [property_id, agentuserid]).then((data) => {

            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "getnotifications get succesfully"
                })
            }
            else {

                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found for notifications"
                })
            }

        })

            .catch(error => {

                res.status(404).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "unable to view  notifications"
                })

            })




    })
}


{
    agentRouter.get('/agentAdded/:property_id/:agentuserid', (req, res, next) => {
        var property_id = req.params.property_id;
        var agentuserid = req.params.agentuserid;
        db.any("select * from owneragent where propertyid=$1 and agentuserid=$2", [property_id, agentuserid]).then((data) => {

            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "agent data got succesfully"
                })
            }
            else {

                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found for agent"
                })
            }

        })

            .catch(error => {

                res.status(404).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "unable to view agent data"
                })

            })




    })
}


{



    agentRouter.delete('/deleteMyAgent/:propertyid/:agentuserid', (req, res, next) => {
        var propertyid = req.params.propertyid;
        var agentuserid = req.params.agentuserid;

        db.any('select * from fn_owneragentdelete($1,$2)', [propertyid, agentuserid]).then((data) => {
            res.status(200).send({
                result: true,
                error: "NOERROR",
                data: data,
                message: "Agent deleted succesfully"
            })
        })
    })
}



{
    agentRouter.get('/getAllAgents/:city', (req, res, next) => {

        var propertyArray = []

        var city = req.params.city.trim();

        db.any("select r.id,r.name,r.mobile,c.cityname,a.areaname,r.occupation from registration r join area a on a.id=r.areaid join city c on c.id=a.cityid where roleid=2 and cityname ilike '%'||$1||'%'", city).then((data) => {

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
                                    message: "Get agent succesfully"
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







{
    agentRouter.get('/MyAgents/:userid/:page', (req, res, next) => {//*****get my agents details */

        var username = req.params.userid;
        var page = (req.params.page) * 10;
        var propertyArray = []


        db.any("select * from owneragent o join propertydetails ow on o.propertyid=ow.id join registration r on o.agentuserid=r.id  where ow.userid=$1 and ow.status='Active' limit $2", [username, page]).then((data) => {


            if (data.length > 0) {
                data.forEach(prop => {
                    myPath = path.join('./', 'Gallery/' + prop.propertyid + '/Images/');
                    fs.readdir(myPath, (err, files) => {

                        if (files == undefined) {


                            prop['img'] = "http://localhost:3400/no_image.gif"

                            propertyArray.push(prop)

                        }
                        else {

                            // var latLng = {}
                            // latLng['lat'] = parseFloat(prop.latitude)
                            // latLng['lng'] = parseFloat(prop.longitude)
                            // prop['destination'] = latLng

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
    agentRouter.get('/getDataForAgentNotification/:propertyid/:userid/:status', (req, res, next) => {
        var userid = req.params.userid
        var propertyid = req.params.propertyid

        var status = req.params.status

        db.any('select * from fn_tenantnotificationsselect($1,$2,$3)', [propertyid, userid, status]).then((data) => {

            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "getnotifications get succesfully"
                })
            }
            else {

                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found for notifications"
                })
            }

        })

            .catch(error => {

                res.status(404).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "unable to view  notifications"
                })

            })




    })
}



{

    agentRouter.post('/getnotifications/:userid', (req, res, next) => {       //update tenant_notifications
        var userid = req.params.userid;
        db.any(" update public.allnotifications set status = true where touser_id = $1", userid).then((data) => {


            if (data.length > 0) {

                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "updatenotifications Successfully"

                })
            } else {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data updatenotifications"
                })
            }
        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to updatenotifications"
                })
            })
    })
}



{
    agentRouter.get('/getagentnotifications_count/:userid', (req, res, next) => {
        var userid = req.params.userid
        db.any("select count(notificationtype) from tenantnotifications where touserid=$1 and status='unseen' AND notificationtype='request'", [userid]).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "getnotifications get succesfully"
                })
            }
            else {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found for notifications"
                })
            }
        })
            .catch(error => {
                res.status(404).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "unable to view  notifications"
                })
            })
    })
}


{
    agentRouter.get("/getDataForNotification/:propertyid/:agentuserid", (req, res, next) => {
        var propertyid = req.params.propertyid;
        var agent_userid = req.params.agentuserid;

        db.any('select * from fn_owner_add_agent_select($1,$2)', [propertyid, agent_userid]).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "owner_Add_agent get succesfully"
                })
            }
            else {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found for owner_Add_agent"
                })
            }
        })
            .catch(error => {
                res.status(404).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "unable to view  owner_Add_agent"
                })
            })
    })
}


module.exports = agentRouter;