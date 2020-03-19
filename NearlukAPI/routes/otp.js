// var express = require('express');
// var bodyparser = require('body-parser');
// var qs = require("querystring");
// var http = require("http");
// const bodyParser = require("body-parser");
// var path = require('path')
// var otpRouter = express.Router();

// otpRouter.use(bodyParser.urlencoded({
//     extended: true
// }));
// otpRouter.use(bodyparser.json())


// otpRouter.get('/:phno', (req, res, next) => {
//     var body;
//     var collect;
//     var options = {

//         "method": "GET",
//         "hostname": "2factor.in",
//         "port": null,
//         "path": null,
//         "headers": {
//             "content-type": "application/x-www-form-urlencoded"
//         }
//     };
//     var i = req.params.phno;

//     options.path = "/API/V1/96ab36da-f79d-11e8-a895-0200cd936042/SMS/" + i + "/AUTOGEN"
//     var req = http.request(options, function (res) {
//         var chunks = [];

//         res.on("data", function (chunk) {
//             chunks.push(chunk);
//         });

//         res.on("end", function () {
//             body = Buffer.concat(chunks);

//             collect = body


//             twoFactor()
//         });

//     });
//     function twoFactor() {

//         var a = collect.toString()
//         var b = JSON.parse(a)
//         res.send(a)
//     }
//     req.write(qs.stringify({}));
//     req.end();

// })


// module.exports = otpRouter;




var express = require('express');
var bodyparser = require('body-parser');
var qs = require("querystring");
var http = require("http");
const bodyParser = require("body-parser");
var path = require('path')
var otpRouter = express.Router();

otpRouter.use(bodyParser.urlencoded({
    extended: true
}));
otpRouter.use(bodyparser.json())


otpRouter.get('/:phno', (req, res, next) => {






    var body;
    var collect;
    var options = {

        "method": "GET",
        "hostname": "2factor.in",
        "port": null,
        "path": null,
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        }
    };
    var i = req.params.phno;
    // 334edb33-90c7-11e9-ade6-0200cd936042	

    options.path = "/API/V1/96ab36da-f79d-11e8-a895-0200cd936042/SMS/" + i + "/AUTOGEN"
    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            body = Buffer.concat(chunks);

            collect = body

// console.log(collect)
            twoFactor()
            //  res.write(JSON.stringify(body.toString()));
        });
        //  res.write(JSON.stringify(body.toString()));

    });
    function twoFactor() {

        var a = collect.toString()
        var b = JSON.parse(a)
        res.send(a)

      
        // console.log(a.Details)



        


    }
    req.write(qs.stringify({}));
    req.end();

})



module.exports = otpRouter;