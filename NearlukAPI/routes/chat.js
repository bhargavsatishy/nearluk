
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
var chatRouter = express();

chatRouter.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", "Cache-Control,Pragma,Origin,Authorization,Content-Type,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "*");
    return next();
});

chatRouter.use(bodyparser.json({ limit: '30mb' }));
chatRouter.use(bodyparser.urlencoded({ limit: '30mb', extended: true }));




chatRouter.get('/getChatMapp/:userid', (req, res, next) => {
    var userid = req.params.userid;

    var propertyArray = []

    userid

    db.any('select u.*,r.name from userlogin u join registration r on r.id=u.userid where u.session=$1', [userid]).then((datasessionchatmapping) => {



        if (datasessionchatmapping.length > 0) {


            db.any('select cm.cmsid,cm.user1,(r.name)as user1name,cm.user2,(r1.name)as user2name,ch1.ncount,ch1.cnsid,cm.propertyid,pd.propertyname,(pd.userid) as ownerid from chatmapping cm join registration r on r.id=cm.user1 join registration r1 on r1.id=cm.user2 join propertydetails pd on cm.propertyid=pd.id left outer join (select cmsid,touser,ncount,cnsid from chatnotification cn where cn.touser=$1) as ch1 on ch1.cmsid=cm.cmsid where cm.user1=$1 or cm.user2=$1  order by cm.time desc', [datasessionchatmapping[0].userid]).then((datachatmapping) => {



                if (datachatmapping.length > 0) {
                    var promise1 = new Promise(function (resolve, reject) {
                        resolve('Success!');

                        datachatmapping.forEach(prop => {


                            if (datasessionchatmapping[0].userid != prop.user1) {




                                myPath = path.join('./', 'Profile/' + prop.user1 + '/');
                                fs.readdir(myPath, (err, files) => {





                                    if (files == undefined) {


                                        prop['img'] = "http://localhost:3400/Profile/NoProfile/noprofile.png"

                                        propertyArray.push(prop)

                                    }
                                    else {

                                        prop['img'] = "http://localhost:3400/" + prop.user1 + "/" + files[0]
                                        propertyArray.push(prop)

                                    }
                                    if (datachatmapping.length == propertyArray.length) {
                                        res.status(200).send({
                                            result: true,
                                            error: "NOERROR",
                                            data: propertyArray,
                                            userid: datasessionchatmapping[0].userid,
                                            username: datasessionchatmapping[0].name,
                                            message: "Get Owner Details succesfully"
                                        })
                                    }
                                })


                            }

                            else {


                                myPath = path.join('./', 'Profile/' + prop.user2 + '/');
                                fs.readdir(myPath, (err, files) => {





                                    if (files == undefined) {


                                        prop['img'] = "http://localhost:3400/Profile/NoProfile/noprofile.png"

                                        propertyArray.push(prop)

                                    }
                                    else {

                                        prop['img'] = "http://localhost:3400/" + prop.user2 + "/" + files[0]
                                        propertyArray.push(prop)

                                    }
                                    if (datachatmapping.length == propertyArray.length) {
                                        res.status(200).send({
                                            result: true,
                                            error: "NOERROR",
                                            data: propertyArray,
                                            message: "Get Owner Details succesfully"
                                        })
                                    }
                                })
                            }


                        })
                    });

                    promise1.then(function (value) {

                    });
                }

                else {
                    res.status(200).send({
                        result: true,
                        error: "NOERROR",
                        data: "NDF",
                        message: "Get Owner Details succesfully"
                    })
                }

            })
        } else {

            res.status(200).send({
                result: true,
                error: "NOERROR",
                data: "NDF",
                message: "Get Owner Details succesfully"
            })
        }



    })


})


chatRouter.get('/chat/:user1/:user2/:propertyid/:session', (req, res, next) => {
    var user1 = req.params.user1;
    var user2 = req.params.user2;
    var propertyid = req.params.propertyid;

    var session = req.params.session;


    db.any('select userid from userlogin where session=$1', [session]).then((datasession) => {


        if (datasession.length > 0) {
            if (datasession[0].userid == user1 || datasession[0].userid == user2) {


                db.any('select * from chatmapping where user1=$1 and user2=$2 and propertyid=$3 union select * from chatmapping where user1=$2 and user2=$1 and propertyid=$3', [user1, user2, propertyid]).then((data) => {




                    if (data.length == 0) {




                        db.any('select * from fn_addchatmapp($1,$2,$3)', [user1, user2, propertyid]).then((data1) => {



                            db.any('select c.msid,(c.fromuserid)as user,c.message,(r.name)as username from chat c join registration r on r.id=c.fromuserid join registration r2 on r2.id=c.touserid  where   chatmapp=$1 ORDER BY c.msid', data1[0].fn_addchatmapp).then((senddata) => {




                                res.status(200).send({
                                    result: true,
                                    error: 'NOERROR',
                                    data: senddata,

                                    room: data1[0].fn_addchatmapp,
                                    message: ""
                                })


                            })



                        })




                    } else {


                        db.any('select c.msid,(c.fromuserid)as user,c.message,(r.name)as username from chat c join registration r on r.id=c.fromuserid join registration r2 on r2.id=c.touserid  where   chatmapp=$1 ORDER BY c.msid', [data[0].cmsid]).then((datachat) => {




                            res.status(200).send({
                                result: true,
                                error: 'NOERROR',
                                data: datachat,
                                room: data[0].cmsid,
                                message: ""
                            })
                        }

                        )

                    }

                })
            }
            else {

                res.status(200).send({
                    result: false,
                    error: 'NOERROR',
                    data: 'NDF',
                    room: 'NDF',
                    message: ""
                })
            }
        } else {
            res.status(200).send({
                result: false,
                error: 'NOERROR',
                data: 'NDF',
                room: 'NDF',
                message: ""
            })
        }

    })
})



chatRouter.get('/delete/chat/noti/:touserid/:cmsid', (req, res, next) => {
    var touserid = req.params.touserid;
    var cmsid = req.params.cmsid;
 

   db.any('delete from chatnotification where touser=$1 and cmsid=$2',[touserid,cmsid]).then((data)=>{

     res.send();

   })



})


chatRouter.get('/appdelete/chat/noti/appchat:userid', (req, res, next) => {
    var user1 = req.params.userid;
    db.any('delete from appchatnotification where userid=$1', [user1]).then((data) => {

        res.send();
    })
})
chatRouter.get('/getChat/:roomid', (req, res, next) => {
    var roomid = req.params.roomid;
    db.any('select c.msid,(c.fromuserid)as user,c.message,(r.name)as username from chat c join registration r on r.id=c.fromuserid join registration r2 on r2.id=c.touserid  where   chatmapp=$1 ORDER BY c.msid', [roomid]).then((data) => {
        res.status(200).send({
            result: true,
            error: 'NOERROR',
            data: data,
            message: ""
        })
    }

    )

})

module.exports = chatRouter;
