// var express = require('express');
// var bodyparser = require('body-parser');
// var qs = require("querystring");
// var http = require("http");
// const bodyParser = require("body-parser");
// var path = require('path')
// var verifyRouter = express.Router();

// verifyRouter.use(bodyParser.urlencoded({
//     extended: true
// }));
// verifyRouter.use(bodyparser.json())




// verifyRouter.get('/:key/:otp', (req, res, next) => {
//     var id = req.params.key
//     var otp = req.params.otp

//     var collect
//     var options = {
//         "method": "GET",
//         "hostname": "2factor.in",
//         "port": null,
//         "path": null,
//         "headers": {
//             "content-type": "application/x-www-form-urlencoded"
//         }
//     };

//     options.path = "/API/V1/96ab36da-f79d-11e8-a895-0200cd936042/SMS/VERIFY/" + id + "/" + otp
//     var req = http.request(options, function (res) {
//         var chunks = [];

//         res.on("data", function (chunk) {
//             chunks.push(chunk);
//         });

//         res.on("end", function () {
//             var body = Buffer.concat(chunks);

//             collect = body
//             vinod()
//         });

//     });
//     function vinod() {

//         var a = collect.toString()
//         var b = JSON.parse(a)
//         res.send(a)
//     }


//     req.write(qs.stringify({}));
//     req.end();

// })


// module.exports = verifyRouter;






var express = require('express');
var bodyparser = require('body-parser');
var qs = require("querystring");
var http = require("http");
const bodyParser = require("body-parser");
var path = require('path')
var verifyRouter = express.Router();

verifyRouter.use(bodyParser.urlencoded({
    extended: true
}));

verifyRouter.use(bodyparser.json())
var nearlukRouter = express();
var config = require('../apiconfig')
var conntstr = config.connectionString
const dba = require('../db');
const db = dba.db;
const pgp = db.$config.pgp
var md5 = require('md5');




verifyRouter.get('/:key/:otp', (req, res, next) => {
    var id = req.params.key
    var otp = req.params.otp
    var userid = req.params.userid

    var collect
    var options = {
        "method": "GET",
        "hostname": "2factor.in",
        "port": null,
        "path": null,
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        }
    };
    // 334edb33-90c7-11e9-ade6-0200cd936042	
    options.path = "/API/V1/96ab36da-f79d-11e8-a895-0200cd936042/SMS/VERIFY/" + id + "/" + otp
    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
        res.on("end", function () {
            var body = Buffer.concat(chunks);

            collect = body
            OTP()
        });
    });
    function OTP() {
        var a = collect.toString()
        var b = JSON.parse(a)
        res.send(a)
    }
    req.write(qs.stringify({}));
    req.end();

})










//For forgot password otp

verifyRouter.get('/updatepassword/:key/:otp/:uid/:password', (req, res, next) => {
    var id = req.params.key
    var otp = req.params.otp
    var userid = req.params.uid
    var password = req.params.password
    // console.log(id)
    // console.log(otp)
    // console.log(userid)
    // console.log(password)
    var collect
    var options = {
        "method": "GET",
        "hostname": "2factor.in",
        "port": null,
        "path": null,
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        }
    };
    // 334edb33-90c7-11e9-ade6-0200cd936042	
    options.path = "/API/V1/96ab36da-f79d-11e8-a895-0200cd936042/SMS/VERIFY/" + id + "/" + otp
    var req = http.request(options, function (res) {
        var chunks = [];
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
        res.on("end", function () {
            var body = Buffer.concat(chunks);

            collect = body
            OTP()
        });
    });
    function OTP() {
        var a = collect.toString()
        var b = JSON.parse(a)
        // console.log(b.Details + "shivaaaaaa")
        if (b.Details == 'OTP Matched') {
            console.log('OTP Matched')
            db.any('select * from fn_update_otp_password($1,$2)', [userid, password]).then((data) => {
                res.status(200).send({
                    result: true,
                    error: "noerror",
                    data: data,
                    otp: a,
                    message: "updated successfully"
                })
            })
        }
        else {
            res.status(200).send({
                result: false,
                error: "noerror",
                data: data,
                otp: a,
                message: "Password notupdated"
            })
        }
    }
    // res.send(a)
    req.write(qs.stringify({}));
    req.end();
})


module.exports = verifyRouter;


