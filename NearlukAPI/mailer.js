var nodemailer = require('nodemailer');
var fs = require('fs');
var config = require(__dirname + '/apiconfig');
const dbc = require('./db.js');
const db = dbc.db;
const pgp = db.$config.pgp;
var eid = Date.now();
const path = require('path');

var msg='';

// from
var transporter = nodemailer.createTransport({
    service: config.mailServer,
    auth: {
        user: config.email,
        pass: config.password
    }
});

// to

function sendMail(registrationmail) {
    transporter.sendMail(registrationmail, function (err, info) {
        if (err) {
            dbc.log(err);
        } else {
            dbc.log('Email sent Successfully: ' + info.response);
            res.staus(200).send([Id[0], {
                message: "success",
                result: "true"
            }])
        }
    })
}

module.exports={

    mailer: function (Id, sub, rtype,sessionid) {
          dbc.log("mailer ==> " + Id, sub, rtype)
          db.any("select * from registration where id=$1",[Id]).then((data)=>
          {
            
              toMail = data[0].email;
  
           
              msg = '<div style="text-align=center;margin-left: 300px">Thank you '+ data[0].name +',for Registering with Nearluk <a href="http://localhost:4200/verify/'+sessionid+'">Click Here to verify</a> </div>';
  
              var mailOptions = {
                  from: config.email,
                  to: toMail,
                  subject: 'Activation',
                  dsn: {
                    id: eid,
                    return: 'headers',
                    notify: ['failure', 'delay', 'success'],
                    recipient: config.email
                  },
                  html: '<div  style="background-image: url(http://getwallpapers.com/wallpaper/full/b/8/b/1086000-beautiful-simple-backgrounds-1920x1200.jpg) ;text-align: center; height:50px" ><h1 style="color:rgb(34, 31, 82)">Welcome to Nearluk</h1> </div>' + msg
                };
                sendMail(mailOptions)
          })
         
      },
      verifymailer: function (email, section) {
        // dbc.log("mailer ==> " + Id, sub, rtype)
        // db.any("select * from registration where id=$1",[Id]).then((data)=>
        // {

        toMail = email;


        msg = '<div style="text-align=center;margin-left: 300px">Thank you ' + ',for Registering with Nearluk <a href="http://localhost:4200/verify/' + section + '">Click Here to verify</a> </div>';

        var mailOptions = {
            from: config.email,
            to: toMail,
            subject: 'Activation',
            dsn: {
                id: eid,
                return: 'headers',
                notify: ['failure', 'delay', 'success'],
                recipient: config.email
            },
            html: '<div  style="background-image: url(http://getwallpapers.com/wallpaper/full/b/8/b/1086000-beautiful-simple-backgrounds-1920x1200.jpg) ;text-align: center; height:50px" ><h1 style="color:rgb(34, 31, 82)">Welcome to Nearluk</h1> </div>' + msg
        };
        sendMail(mailOptions)
        // })

    },

      notification: function (ownerid, sub, rtype,tennantid) {
        // console.log(ownerid+tennantid)
        // dbc.log("mailer ==> " + Id, sub, rtype)
        // union  select id,name,email,mobile from registration where id=$2
        db.any("select id,name,email,mobile,verifymail from registration where id=$1",[ownerid]).then((data)=>
        {
          // console.log("r1r1r1")
          // console.log(data[0].verifymail)
          if(data[0].verifymail=='Verified'){

            db.any("select id,name,email,mobile from registration where id=$1",[tennantid]).then((data2)=>
            {
                // console.log(data[0])
                // console.log(data[1])
                  toMail = data[0].email;
                   msg = '<div style="text-align=center;margin-left: 300px">Hi  '+data[0].name+ ',Some one has checked your property  ,<br>User Details :<br>  Name:'+data2[0].name+',<b> Email:</b>' +  data2[0].email+', Mobile:'+data2[0].mobile+'  </div>';
      
                  // msg = '<div style="text-align=center;margin-left: 300px">Thank you '+ data[0].name +',for Registering with Nearluk <a href="http://localhost:4200/verify/'+sessionid+'">Click Here to verify</a> </div>';
      
                  var mailOptions = {
                      from: config.email,
                      to: toMail,
                      subject: 'Nearluk Notification',
                      dsn: {
                        id: eid,
                        return: 'headers',
                        notify: ['failure', 'delay', 'success'],
                        recipient: config.email
                      },
                      html: '<div  style="background-image: url(http://getwallpapers.com/wallpaper/full/b/8/b/1086000-beautiful-simple-backgrounds-1920x1200.jpg) ;text-align: center; height:50px" ><h1 style="color:rgb(34, 31, 82)"></h1> </div>' + msg 
                    };
                    sendMail(mailOptions)
            })    

          }
              
        })
    },

    forgot: function (email, sub, rtype) {
        dbc.log("mailer ==> " + email, sub, rtype)
    
       db.any('select * from registration where email=$1',[email]).then((data)=>{
     
        toMail = data[0].email;
        userid = data[0].id;
        
  
        db.any('select * from userlogin where userid=$1',[userid]).then((data1)=>{

    
        if(rtype!='forgot'){
  
        msg = '<div style="text-align=center;margin-left: 300px"> Please use the link .</br><a href="http://localhost:4200/forgotpassword'+data1[0].session+'">Click Here to change Password</a></div><b>';
      }
       else{
     
          msg = '<div style="text-align=center;margin-left: 300px"> Please use the link to access your account and change your settings.</br><a href="http://localhost:4200/changepassword/'+data1[0].session+'">Click Here to Update Password</a></div><b>';
        }
      var mailOptions = {
        from: config.email,
        to: toMail,
        subject: sub,
        dsn: {
          id: eid,
          return: 'headers',
          notify: ['failure', 'delay', 'success'],
          recipient: config.email
        },
       html:'<div>Hi</div>'+ msg
      };

      sendMail(mailOptions)
    })
  })
       
    },

    
}