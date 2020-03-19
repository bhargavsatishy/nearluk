var fs = require('fs')
var path = require('path')
var express = require('express')
var promise = require('bluebird')
var bodyparser = require('body-parser')
var mail = require('../mailer')




var option = {
    promiseLib: promise
};


var nearlukRouter = express();
var config = require('../apiconfig')
var conntstr = config.connectionString
const dba = require('../db');
const db = dba.db;
const pgp = db.$config.pgp
var md5 = require('md5');


nearlukRouter.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", "Cache-Control,Pragma,Origin,Authorization,Content-Type,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "*");
    return next();
});

nearlukRouter.use(bodyparser.json({ limit: '30mb' }));
nearlukRouter.use(bodyparser.urlencoded({ limit: '30mb', extended: true }));



{
    nearlukRouter.get('/Imagepic/:id', (req, res, next) => {

        var id = req.params.id
        var propertyArray = []
        db.any("select id from registration where id=$1", id).then((data) => {

            data.forEach(prop => {
                myPath = path.join('./', 'Profile/' + prop.id + '/');
                fs.readdir(myPath, (err, files) => {

                    if (files == undefined) {


                        prop['img'] = "http://localhost:3400/Profile/NoProfile/noprofile.png"

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
        })

    })
}

// {
//     nearlukRouter.post('/Registration/Add/', (req, res, next) => {
//         var name = req.body.name;
//         var email = req.body.email;
//         var mobile = req.body.mobile;
//         var address = req.body.address;
//         var gender = req.body.gender;
//         var occupation = req.body.occupation;
//         var roleId = req.body.roleid;
//         var dob = req.body.dob;
//         var pwd = req.body.Password;
//         var status = 'NotVerified';
//         var gmail_id = req.body.gmail_id;
//         var areaId = req.body.areaId;

//         db.any('select * from fn_checkuserregisted($1)', [email]).then((data) => {


//             if (data.length > 0) {

//                 res.status(200).send({
//                     result: true,
//                     error: "NOERROR",
//                     data: "NDF",
//                     message: "Email already exist"
//                 })



//             } else {



//                 db.any('select * from fn_addRegistration($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);', [name, email, mobile, address, gender, occupation, roleId, dob, status, gmail_id, areaId]).then((data) => {
//                     var userid = data[0].fn_addregistration;
//                     db.any('select * from fn_login($1,$2,$3)', [userid, email, pwd]).then((data) => {











//                         db.any('select * from fn_adduserlogin($1)', userid).then(sess => {

//                             // console.log(data[0].fn_login)
//                             //                             console.log(sess[0].fn_adduserlogin)
//                             //                             console.log('prasad')

//                             mail.mailer(data[0].fn_login, 'Nearluk Username  Sending ', 'Activation ', sess[0].fn_adduserlogin);


//                             if (data.length > 0) {


//                                 // mail.verify(email);

//                                 res.status(200).send({
//                                     result: true,
//                                     error: "NOERROR",
//                                     data: data,
//                                     message: "Register Sucessfully"
//                                 })
//                             } else {
//                                 res.status(200).send({
//                                     result: true,
//                                     error: "NOERROR",
//                                     data: "NDF",
//                                     message: "No Data Found"
//                                 })
//                             }


//                         })












//                     })
//                 })

//             }
//         })



//             .catch(error => {
//                 res.status(200).send({
//                     result: false,
//                     error: error.message,
//                     data: "ERROR",
//                     message: "Unable to Register"
//                 })
//             })
//     })


// }




{
    nearlukRouter.post('/Registration/Add/', (req, res, next) => {
        var name = req.body.name;
        var email = req.body.email;
        var mobile = req.body.mobile;
        var address = req.body.address;
        var gender = req.body.gender;
        var occupation = req.body.occupation;
        var roleId = req.body.roleid;
        var dob = req.body.dob;
        var pwd = req.body.Password;
        var status = 'Verified';
        var gmail_id = req.body.gmail_id;
        var areaId = req.body.areaId;
        var isd = req.body.isd_code;
        var verifymail='NotVerified';

        db.any('select * from fn_checkuserregisted1($1)', [mobile]).then((data) => {

            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "mobile number already exist"
                })
            } else {
                db.any('select * from fn_addRegistration1($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,$13);', [name, email, mobile, address, gender, occupation, roleId, dob, status, gmail_id, areaId, isd, verifymail]).then((data) => {
                    var userid = data[0].fn_addregistration1;
                    db.any('select * from fn_login($1,$2,$3)', [userid, email, pwd]).then((data) => {

                        db.any('select * from fn_adduserlogin($1)', userid).then(sess => {

                            // console.log(data[0].fn_login)
                            //                             console.log(sess[0].fn_adduserlogin)
                            //                             console.log('prasad')

                           // mail.mailer(data[0].fn_login, 'Nearluk Username  Sending ', 'Activation ', sess[0].fn_adduserlogin);


                            if (data.length > 0) {


                                // mail.verify(email);

                                res.status(200).send({
                                    result: true,
                                    error: "NOERROR",
                                    data: data,
                                    message: "Register Sucessfully"
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
                    })
                })

            }
        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to Register"
                })
            })
    })


}




{
    nearlukRouter.post('/Login', (req, res, next) => {
        var email = req.body.emailId;
        var pwd = req.body.Password;
        db.any('select * from login where email=$1 and password=$2', [email, pwd]).then((data) => {
            if (data.length > 0) {
                var userid = data[0].userid;
                db.any('select * from fn_adduserlogin($1)', userid).then(sess => {
                    res.status(200).send({
                        result: true,
                        error: "NOERROR",
                        data: sess,
                        message: " Logged In Successfully"
                    })
                })
            } else {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data ContactUs"
                })
            }

        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to Add ContactUs"
                })
            })

    })

}



{
    nearlukRouter.post('/logingetalldetails', (req, res, next) => {
        var mobile = req.body.mobile;
        var pwd = req.body.Password;
        var prop = []
        db.any('select l.*,r.*,acn.ancount from login l join registration r on l.userid=r.id left outer join appchatnotification acn on acn.userid =r.id where r.mobile=$1', [mobile]).then(data => {



            if (data.length > 0) {

                if (data[0].password == pwd) {

                    var userid = data[0].userid;


                    if (data[0].status == 'Verified') {


                        db.any('select * from fn_adduserlogin($1)', userid).then(sess => {

                            // console.log("logged in successfully")

                            var session = sess[0].fn_adduserlogin

                            data[0]['session'] = session;



                            myPath = path.join('./', 'Profile/' + userid + '/');


                            fs.readdir(myPath, (err, files) => {

                                if (files == undefined) {


                                    var img = "http://localhost:3400/Profile/NoProfile/noprofile.png"


                                    res.status(200).send({
                                        result: true,
                                        error: "NOERROR",
                                        data: data,
                                        image: img,
                                        message: "Logged In Successfully"
                                    })

                                }
                                else {

                                    var img = "http://localhost:3400/" + userid + "/" + files[0]


                                    res.status(200).send({
                                        result: true,
                                        error: "NOERROR",
                                        data: data,
                                        image: img,
                                        message: "Logged In Successfully"
                                    })
                                }
                            })
                        })
                    } else {


                        var img = "http://localhost:3400/Profile/NoProfile/noprofile.png"


                        res.status(200).send({
                            result: true,
                            error: "NOERROR",
                            data: data,
                            image: img,
                            message: "Logged In Successfully"
                        })
                    }


                }
                else {

                    console.log("Invalid password")
                    res.status(200).send({
                        result: false,
                        error: "NOERROR",
                        data: null,
                        message: "Invalid password"
                    })
                }

            } else {

                console.log("Invalid Mobile Number")
                res.status(200).send({
                    result: false,
                    error: "NOERROR",
                    data: null,
                    message: "Invalid Mobile Number"
                })
            }

        })
            .catch(error => {

                console.log(error)
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to Login"
                })
            })

    })

}



{
    nearlukRouter.get('/verify/:sessionid', (req, res, next) => {
        var sessionid = req.params.sessionid;
        var status = 'Verified'

        db.any('select * from userlogin where  session=$1', [sessionid]).then((data) => {


            db.any('update registration set verifymail=$1 where id=$2', [status, data[0].userid]).then((data1) => {


                // console.log('ss')


                res.send(data1)


            })

        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to Verify email"
                })
            })

    })

}




{
    nearlukRouter.get('/verifysendemails/:userid', (req, res, next) => {
        var userid = req.params.userid;


        db.any('select * from userlogin where userid=$1', [userid]).then((data) => {
            if (data.length > 0) {


                mail.mailer(data[0].userid, 'Nearluk Username  Sending ', 'Activation ', data[0].session);

                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: " verifyemail get Successfully"
                })
            } else {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data verifyemail"
                })
            }
        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to get verifyemail"
                })
            })
    })
}

{
    nearlukRouter.post('/Country/Add/', (req, res, next) => {
        var countryName = req.body.countryName;
        var isdCode = req.body.isdCode;
        var currencyName = req.body.currencyName;
        var currencyCode = req.body.currencyCode;
        db.any('select * from fn_addCountry($1, $2, $3, $4)', [countryName, isdCode, currencyName, currencyCode]).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: " Country Added Sucessfully"
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
                    message: "Unable to Add country"
                })
            })
    })
}
{
    nearlukRouter.post('/State/Add/', (req, res, next) => {
        var stateName = req.body.stateName;
        var countryId = req.body.countryId;
        db.any('select * from fn_addState($1, $2)', [stateName, countryId]).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: " State Added Sucessfully"
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
                    message: "Unable to Add State"
                })
            })
    })
}
{
    nearlukRouter.post('/City/Add/', (req, res, next) => {
        var cityName = req.body.cityName;
        var stateId = req.body.stateId;
        db.any('select * from fn_addCity($1, $2)', [cityName, stateId]).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: " City Added Sucessfully"
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
                    message: "Unable to Add City"
                })
            })
    })
}
{
    nearlukRouter.post('/Area/Add/', (req, res, next) => {
        var areaName = req.body.areaName;
        var zipCode = req.body.zipCode;
        var cityId = req.body.cityId;
        db.any('select * from fn_addArea($1, $2, $3)', [areaName, zipCode, cityId]).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: " Area Added Sucessfully"
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
                    message: "Unable to Add Area"
                })
            })
    })

}
{
    nearlukRouter.post('/ContactUs/Add/', (req, res, next) => {
        var name = req.body.name;
        var email = req.body.email;
        var message = req.body.message;
        var postedDate = req.body.postedDate;
        var status = req.body.status;
        db.any('select * from fn_addContactUs($1, $2, $3, $4, $5)', [name, email, message, postedDate, status]).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: " ContactUs Added Successfully"
                })
            } else {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data ContactUs"
                })
            }
        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to Add ContactUs"
                })
            })
    })
}





{


    //============================================Forgot Password ==================================

    nearlukRouter.post('/Forgot/Password', (req, res, next) => {

        var email = req.body.email;
        db.any('select * from registration where email=$1',
            [email]).then((data) => {

                if (data.length > 0) {
                    mail.forgot(email, 'Password Reset', 'forgot');
                    res.status(200).send({
                        result: true,
                        error: "NOERROR",
                        data: data,
                        message: "Password reset link sent successfully"
                    })
                }

                else {
                    res.status(200).send({
                        result: false,
                        error: "NOERROR",
                        data: 'NDF',
                        message: "Email does not exist"
                    })
                }
            })

    })






    nearlukRouter.post('/Change/Password/:cnfPwd/:Session', (req, res, next) => {
        var session = req.params.Session
        var cnfpwd = req.params.cnfPwd

        db.any('select * from login where userid=(select userid from userlogin where session=$1)', session).then((data) => {
            var userid = data[0].userid;
            if (data.length > 0) {
                db.any('update login set password=$1 where userid=$2', [cnfpwd, userid]).then((data) => {
                    res.send(data);
                })
            }
        })
    })
    // ==================================change password==================================


    nearlukRouter.post('/Update/Password/:cnfPwd/:Session/:oldPwd', (req, res, next) => {
        var session = req.params.Session
        var cnfpwd = req.params.cnfPwd
        var oldpwd = req.params.oldPwd

        db.any('select * from login where userid=(select userid from userlogin where session=$1) and password=$2', [session, oldpwd]).then((data) => {






            if (data.length > 0) {
                var userid = data[0].userid;
                db.any('update login set password=$1 where userid=$2', [cnfpwd, userid]).then((data2) => {
                    res.status(200).send({
                        result: true,
                        error: "noerror",
                        message: "updated successfully"
                    })
                })
            }

            else {

                res.status(200).send({
                    result: false,
                    error: "noerror",
                    message: "Old Password Wrong"
                })
            }
        })
    })
}

//=========================================User Profile ==================================



nearlukRouter.get('/getUserDetails/:userid', (req, res, next) => {
    var userid = req.params.userid;
    var propertyArray = []
    db.any('select * from registration r left join agentdiscription ad on ad.id=r.id  where  r.id=$1', userid).then((data) => {
        db.any("insert into DomainLogs(LogHeader,LogCode,LogType,Message,LoggedFor,Status) values ('Table-View:tenant','ITR','INFO','View of Getallproperties Table successfull','tenant',true)").then((log) => {

            if (data.length > 0) {
                data.forEach(prop => {
                    myPath = path.join('./', 'Profile/' + prop.id + '/');
                    fs.readdir(myPath, (err, files) => {

                        if (files == undefined) {


                            prop['img'] = "http://localhost:3400/Profile/NoProfile/noprofile.png"

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

nearlukRouter.get('/UseroldPassword/:sessionid', (req, res, next) => {

    var userid = req.params.sessionid;
    db.any('select password from login where userid=(select userid from userlogin where session=$1)', userid).then((data) => {
        res.send(data);
    })
})

// nearlukRouter.get('/userProfile/:Session', (req, res, next) => {
//     var session = req.params.Session;

//     db.any('select * from fn_getUserprofile($1)', session).then((data) => {



//         if (data.length > 0) {
//             res.status(200).send({
//                 result: true,
//                 error: "noerror",
//                 data: data,
//                 message: "Profile Get Sucessfully"
//             })
//         }
//         else {
//             res.status(200).send({
//                 result: false,
//                 error: "noerror",
//                 data: "NDF",
//                 message: "No Data Profile Get"
//             })

//         }

//     })
// })

nearlukRouter.get('/userProfile/:Session', (req, res, next) => {
    var session = req.params.Session;

    db.any('select * from fn_getUserprofile1($1)', session).then((data) => {
        if (data.length > 0) {

            myPath = path.join('./', 'Profile/' + data[0].id);
            var arr = [];
            fs.readdir(myPath, (err, files) => {



                if (files) {
                    files.forEach(file => {
                        let a = 'http://localhost:3400/' + 'Profile/' + data[0].id + '/' + file
                        arr.push(a)

                        if (files.length == arr.length) {
                            res.status(200).send({
                                result: true,
                                error: "noerror",
                                data: data,
                                profileimage: [arr],
                                profile: true,
                                message: "Profile Get Sucessfully"
                            })
                        }

                    });

                }

                else {
                    res.status(200).send({
                        result: true,
                        error: "noerror",
                        data: data,
                        profileimage: ['http://localhost:3400/Profile/NoProfile/noprofile.png'],
                        profile: false,
                        message: "Profile Get Sucessfully"
                    })

                }

            })



        }
        else {
            res.status(200).send({
                result: false,
                error: "noerror",
                data: "NDF",
                message: "No Data Profile Get"
            })

        }

    })
})





nearlukRouter.get('/Cities/count', (req, res, next) => {

    db.any('select * from fn_getCityCountries()').then((data) => {
        res.send(data);
    })
})




nearlukRouter.post('/update/userProfile/', (req, res, next) => {
    var id = req.body.id;
    var name = req.body.name;
    var email = req.body.email;
    var mobile = req.body.mobile;
    var address = req.body.address;
    var gender = req.body.gender;
    var dob = req.body.dob;
    var occupation = req.body.occupation;
    var city = req.body.area

    db.any('select * from fn_updateprofile($1,$2,$3,$4,$5,$6,$7,$8,$9)', [name, email, mobile, address, gender, dob, occupation, id, city]).then((data) => {


        var discription = req.body.discription;



        if (data.length > 0) {
            db.any('select * from fn_addagentdiscription($1,$2)', [id, discription]).then((data) => {
                res.send(data);


            })
        }
    })



})

nearlukRouter.post('/putProfileImages', (req, res, next) => { // put Images..
    var id = req.body.id;
    var img = req.body.image;


    var count = [];

    var dir = "./Profile/" + id + '/';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);

        var dt = new Date();
        fName = dt.getFullYear() + '_' + dt.getMonth() + '_' + dt.getDate() + '_' + dt.getHours() + '_' + dt.getMinutes() + '_' + dt.getMilliseconds() + ".png";

        // console.log(fs.existsSync(dir));
        // fName = id + ".png";
        fNameW = path.join(__dirname, '../Profile/' + id + '/' + fName);
        // fNameW=path.join('./Profile'+username+'/'+fName)

        fs.writeFile(fNameW, img, 'base64', (err) => {
            if (err)
                ;
            else
                ;
        })
        res.send({ message: "updated" });

    }

    else {
        const directory = dir;

        fs.readdir(directory, (err, files) => {
            if (err) throw err;

            for (const file of files) {



                fs.unlink(path.join(directory, file), err => {
                    count.push(1)


                    if (files.length == count.length) {

                        var dt = new Date();
                        fName = dt.getFullYear() + '_' + dt.getMonth() + '_' + dt.getDate() + '_' + dt.getHours() + '_' + dt.getMinutes() + '_' + dt.getMilliseconds() + ".png";


                        // fName = id + ".png";
                        fNameW = path.join(__dirname, '../Profile/' + id + '/' + fName);
                        // fNameW=path.join('./Profile'+username+'/'+fName)

                        fs.writeFile(fNameW, img, 'base64', (err) => {
                            if (err)
                                ;
                            else
                                res.send({ message: "updated" });
                            ;
                        })

                    }

                    if (err) throw err;
                });
            }
        });
    }

})



{
    nearlukRouter.get('/property/:cid/:userid/:page', (req, res, next) => {
        var cityid = parseInt(req.params.cid);
        var page = (req.params.page) * 10
        var propertyArray = []
        var userid = req.params.userid;

        if (userid == 'undefined' || userid == undefined || userid == null || userid == 'null') {
            db.any('select * from fn_getbycity($1,$2)', [cityid, page]).then((data) => {
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
                                        message: "Get all property details successfully"
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
            db.any('select * from fn_getbycitybyUserId1($1,$2,$3)', [cityid, userid, page]).then((data) => {
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
                                        message: "Get all property details successfully"
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
    nearlukRouter.get('/propertynew/:cid/:userid/:page', (req, res, next) => {
        var cityid = parseInt(req.params.cid);
        var propertyArray = []
        var page = 8;
        var offset = (req.params.page) * 8
        var userid = req.params.userid;

        if (userid == 'undefined' || userid == undefined || userid == null || userid == 'null') {
            db.any('select * from fn_getbycitynew($1,$2,$3)', [cityid, page,offset]).then((data) => {
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
                                        message: "Get all property details successfully"
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
            db.any('select * from fn_getbycitybyuserid1new($1,$2,$3,$4)', [cityid, userid, page,offset]).then((data) => {
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
                                        message: "Get all property details successfully"
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
    nearlukRouter.get('/featuredproperty/:propertyTypeId', (req, res, next) => {
        var propertyTypeId = req.params.propertyTypeId;
        var status = 'Verified'

        db.any('select * from featuredproperty fp join featuredpropertyMapping fm on fp.fid=fm.fid	where propertytypeid=$1', [propertyTypeId]).then((data) => {

// console.log(data.length)

if(data.length>0){
    res.status(200).send({
        result: true,
        error: "NOERROR",
        data: data,
        message: ""
    })
}
else{
    res.status(200).send({
        result: false,
        error: "NOERROR",
        data: "NDF",
        message: ""
    })
}
         

        })
            .catch(error => {
                res.status(200).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "Unable to Add ContactUs"
                })
            })

    })

}



{
    nearlukRouter.get('/getAllIsdNumbers/:country', (req, res, next) => {
        var country = req.params.country.trim();
       // console.log(country)
        db.any("select * from fn_country_isd_select($1)", country).then((data) => {
           
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "ISD get Sucessfully"
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

    })
}


{
    nearlukRouter.get('/getBymobile/:mobile', (req, res, next) => {
        var mobile = req.params.mobile;

        db.any("select * from fn_registration_select_mobile1($1)", mobile).then((data) => {


            if(data.length>0){
                res.status(200).send({
                    result: true,
                    error: 'noerror',
                    data: data,
                    message: "mobile get success"
                })
            }else{
                res.status(200).send({
                    result: false,
                    error: 'noerror',
                    data: 'NDF',
                    message: "mobile number not exits"
                })
            }
          
        })

    })
}



{
    nearlukRouter.post('/update/verifymail/:email/:user/:userid', (req, res, next) => {

        var email = req.params.email;
        var section = req.params.user;
        // var verifymail = 'Pending';
        var userid = req.params.userid;

        mail.verifymailer(email,section);

        db.any("update registration set verifymail='Pending',email=$2 where id=$1", [userid,email]).then((data) => {
            if (data.length > 0) {
                res.status(200).send({
                    result: true,
                    error: "NOERROR",
                    data: data,
                    message: "verifymailer works"
                })
            }
            else {

                res.status(200).send({
                    result: false,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found verifymailer"
                })
            }

        })
            .catch(error => {

                res.status(404).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "unable to view  verifymailer"
                })

            })
    })
}


{
    nearlukRouter.get('/chechkusingsessionid/:sessionid', (req, res, next) => {

        var sessionid = req.params.sessionid;
     
        db.any("select r.id,r.roleid from userlogin ul left join  registration r on r.id=ul.userid where ul.session=$1", [sessionid]).then((data) => {
            if (data.length > 0) {


               myPath = path.join('./', 'Profile/' + data[0].id + '/');


               fs.readdir(myPath, (err, files) => {

                   if (files == undefined) {


                       var img = "http://localhost:3400/Profile/NoProfile/noprofile.png"


                       res.status(200).send({
                           result: true,
                           error: "NOERROR",
                           data: data,
                           image: img,
                           message: "Logged In Successfully"
                       })

                   }
                   else {

                       var img = "http://localhost:3400/" + data[0].id + "/" + files[0]


                       res.status(200).send({
                           result: true,
                           error: "NOERROR",
                           data: data,
                           image: img,
                           message: "Logged In Successfully"
                       })
                   }
               })
            }
            else {

                res.status(200).send({
                    result: false,
                    error: "NOERROR",
                    data: "NDF",
                    message: "No Data Found verifymailer"
                })
            }

        })
            .catch(error => {

                res.status(404).send({
                    result: false,
                    error: error.message,
                    data: "ERROR",
                    message: "unable to view  verifymailer"
                })

            })
    })
}

module.exports = nearlukRouter;