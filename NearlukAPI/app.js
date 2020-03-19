var express = require("express");
var path = require('path')
var fs = require('fs')


var admin = require(__dirname + '/routes/admin')
var agent = require(__dirname + '/routes/agent')
var nearluk = require(__dirname + '/routes/nearluk')
var owner = require(__dirname + '/routes/owner')
var property = require(__dirname + '/routes/property')
var tenant = require(__dirname + '/routes/tenant')
var otp = require(__dirname + '/routes/otp')
var verify = require(__dirname + '/routes/verify')
var chat = require(__dirname + '/routes/chat')



var app = express();

app.set("port", process.env.PORT || 3400)
app.all('*', function (req, res, next) {

    res.header("Access-Control-Allow-Origin", '*');

    res.header("Access-Control-Allow-Headers", "Cache-Control,Pragma, Origin, Authorization, Content-Type, X-Requested-With");

    res.header("Access-Control-Allow-Methods", "*");

    return next();
});


app.use('/admin', admin)
app.use('/agent', agent)
app.use('/nearluk', nearluk)
app.use('/owner', owner)
app.use('/property', property)
app.use('/tenant', tenant)
app.use('/otp', otp)
app.use('/verify', verify)
app.use('/chat', chat)




app.use(express.static(path.resolve(__dirname, 'Gallery')));

app.use(express.static(path.resolve(__dirname, 'Flag')));

app.use(express.static(path.resolve(__dirname, 'Facilities')));

app.use(express.static(path.resolve(__dirname, 'Profile')));

app.use(express.static(path.resolve(__dirname, 'videos')));

app.use(express.static(path.resolve(__dirname, 'propertyimages')));

app.use(express.static(path.resolve(__dirname, 'Places')));

app.use(express.static(path.resolve(__dirname, 'Amenities')));

app.use(express.static(path.resolve(__dirname, 'Featured')));

app.use(express.static(path.resolve(__dirname, 'packers')));

app.use(express.static(path.resolve(__dirname, 'loan')));

app.use(express.static(path.resolve(__dirname, '')));




app.post('/img', (req, res) => {
    // console.log('im');
    // console.log(req.body);
    res.send('upload');
})
const dbc = require('./db.js');
const db = dbc.db;
const pgp = db.$config.pgp;
app.get('/', function (req, res, next) {
    var EQuires = "";
    //Check if its Initialized or not
    if (fs.existsSync(__dirname + "/sql/db.lock")) { //migration
        EQuires = fs.readFileSync(__dirname + '/sql/db.lock').toString();
        dbc.log('Re-Initialization Initiated');
        console.log('Re-Initialization Initiated');
        res.status(200).send({
            message: "Re-Initialization Initiated"
        })
    } else {
        dbc.log("Initializing NearLuk 3.0 => " + new Date(Date.now()).toLocaleString());
        console.log("Initializing NearLuk    3.0 => " + new Date(Date.now()).toLocaleString());
        var dropSchema = "DROP SCHEMA public CASCADE;" +
            "CREATE SCHEMA public;" +
            "GRANT ALL ON SCHEMA public TO postgres;" +
            "GRANT ALL ON SCHEMA public TO public;";
        /* var initQuery = fs.readFileSync(__dirname + '/sql/app_init.sql').toString();
        initQuery.replace('\n', ''); */
        db.none(dropSchema).then(function () {
            dbc.log('=> Loading Data')
            console.log('=> Loading Data')
            dbc.log("Initialization Processed");
            console.log("Initialization Processed");
            var init_Queries = fs.readFileSync(__dirname + '/sql/createtable.sql').toString();
            init_Queries.replace('\n', '');
            if (init_Queries != EQuires) {
                db.any(init_Queries)
                    .then(function (data) {
                        fs.writeFileSync(__dirname + '/sql/db.lock', init_Queries, 'utf8', (err) => {
                            if (err) {
                                dbc.log(err)
                                console.log(err)
                            } else {
                                dbc.log('\nTables Created');
                                console.log('\nTables Created');
                            }
                        });
                        dataInit(function (data) {
                            if (data) {
                                insertFun(function (insert) {
                                    if (insert) {
                                        updateFun(function (update) {
                                            if (update) {
                                                deleteFun(function (deleted) {
                                                    if (deleted) {
                                                        readFun(function (read) {
                                                            if (read) {
                                                                //appSetup.readComponents('../', function (err, data) {
                                                                console.log("6. APP SETUP")
                                                                let firstDate = new Date("1/23/2019"),
                                                                    secondDate = new Date(),
                                                                    timeDifference = Math.abs(secondDate.getTime() - firstDate.getTime());
                                                                //db.any(str).then(function (data) {
                                                                dbc.log('Application has been Setup Successfull @ ' + new Date(Date.now()).toLocaleString());
                                                                console.log('Application has been Setup Successfull @ ' + new Date(Date.now()).toLocaleString());
                                                                return 'Files Updated: ' + Math.ceil(timeDifference / (1000 * 3600 * 24)) + ' Days';
                                                                //});
                                                                //})
                                                            } else {
                                                                dbc.log(err)
                                                                console.log(err)
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }

                                });
                            }
                        })
                        //resetDir(__dirname + '/public');
                    });
                dbc.log('Successfully Initialized');
                console.log('Successfully Initialized');
            } else {
                dbc.log('No Re-Initialization Required');
                console.log('No Re-Initialization Required');
            }

            dbc.log('Processing.....');
            console.log('Processing.....');
        })
    }
});
function dataInit(callback) {
    console.log("DATA INIT")
    var data_init = fs.readFileSync(__dirname + '/sql/app_init.sql').toString();
    data_init.replace('\n', '');
    db.any(data_init).then((data) => {
        dbc.log('Data Init');
        console.log('data Init');
        callback(true)
    })
}
function insertFun(callback) {
    //create INSERT Functions
    console.log("1. INSERT")
    var create_fn = fs.readFileSync(__dirname + '/sql/fn_insert.sql').toString();
    create_fn.replace('\n', '');
    db.any(create_fn)
        .then(function (data) {
            dbc.log('Insert Functions Created');
            console.log('Insert Functions Created');
            callback(true)
        });
}
function readFun(callback) {
    //create INSERT Functions
    console.log("3. READ")
    var read_fn = fs.readFileSync(__dirname + '/sql/fn_read.sql').toString();
    read_fn.replace('\n', '');
    db.any(read_fn)
        .then(function (data) {
            dbc.log('Read Functions Created');
            console.log('Read Functions Created');
            callback(true)
        });
}
function updateFun(callback) {
    //create INSERT Functions
    console.log("2. UPDATE")
    var update_fn = fs.readFileSync(__dirname + '/sql/fn_update.sql').toString();
    update_fn.replace('\n', '');
    db.any(update_fn)
        .then(function (data) {
            dbc.log('Update Functions Created');
            console.log('Update Functions Created');
            callback(true)
        });
}

function deleteFun(callback) {
    //create Delete Functions
    console.log("4. DELETE")
    var create_fn = fs.readFileSync(__dirname + '/sql/fn_delete.sql').toString();
    create_fn.replace('\n', '');
    db.any(create_fn)
        .then(function (data) {
            dbc.log('Delete Functions Created');
            console.log('DeleteFunctions Created');
            callback(true)
        });
}

// app.listen(app.get('port'), (err) => {
//     if (err) {
//         console.log("server not started")
//     } else {
//         console.log("server  started http://localhost:" + app.get('port'))
//     }
// })


var debug = require('debug')('angular2-nodejs:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || 3400);
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

var io = require('socket.io').listen(server);

// server.listen(port)

const getOnlineUsers = () => {
    let clients = io.sockets.clients().connected;
    let sockets = Object.values(clients);
    let users = sockets.map(s => s.id);
    // console.log(users)

    return users.filter(u => u != undefined);
};

io.on('connection', (socket) => {
    //  console.log(socket)




    const emitOnlineUsers = () => {


        socket.broadcast.emit("users", getOnlineUsers());
    };




    socket.on('join', function (data) {




        var userstatus = 'us' + data.user2


        useronlinestatus = io.sockets.adapter.rooms[userstatus]


        socket.join(data.room);


        socket.join('uso' + data.user2);







        io.in(data.room).emit('new user joined', { user: data.user, room: data.room, message: useronlinestatus });



    });
    socket.on('joincheckuseronlineornot', function (data) {


        var userstatus = 'us' + data.user2


        useronlinestatus = io.sockets.adapter.rooms[userstatus]


        socket.leave('uso' + data.olduser)

        io.in('us' + data.user1).emit('check user status', { user: data.user, message: useronlinestatus });
    });


    socket.on('joinfornotification', function (data) {


        var s = io.sockets.adapter.sids[socket.user]







        userroom = "us" + data.user


        useroline = "uso" + data.user


        socket.join(userroom);

        socket.broadcast.to("uso" + data.user).emit('new user joined online status', { user: data.user, message: "online" });




    });



    socket.on('check user status', function (data) {



        userroom = "us" + data.user

        var s = io.sockets.adapter.sids[userroom]



    });






    socket.on('joinfornotificationchat', function (data) {


        userroom = "usc" + data.user




        socket.join(userroom);






    });


    socket.on('leave', function (data) {

        var userroom = data.room


        socket.broadcast.to(data.room).emit('left room', { user: userroom, message: 'has left this room.' });




        socket.leave('uso' + data.olduser);


        socket.leave(data.room);
    });


    socket.on('leaveforchat', function (data) {

       

        socket.leave('usc'+data.user);
    });




    socket.on('leavefornotification', function (data) {



        var room = "uso" + data.user;


        socket.leave("us" + data.user)
        socket.leave("uso" + data.user)
        socket.leave("usc" + data.user)


        socket.broadcast.to("uso" + data.user).emit('user left offline', { user: data.user, message: 'has left this room.' });

    });
    socket.on('message', function (data) {

        var cmsid = data.cmsid
        useronlinestatus = io.sockets.adapter.rooms[data.room]


        var appuser = 'us' + data.user2;
        var chatuser = 'usc' + data.user2;

        useronlineapp = io.sockets.adapter.rooms[appuser];


        useronlinechat = io.sockets.adapter.rooms[chatuser]

        io.in(data.room).emit('new message', { user: data.user, message: data.message, username: data.fromUsername });





        db.any('insert into chat(fromuserid,touserid,message,chatmapp) values ($1,$2,$3,$4)', [data.user, data.user2, data.message, data.room]).then((data) => {




        })


        db.any('select * from fn_chatmapptimeupdate($1)', [data.room]).then((data) => {




        })






        if (useronlineapp != undefined) {

            if (useronlinechat != undefined) {


                io.in('us' + data.user2).emit('new message for notification', [{
                    cmsid: cmsid,
                    user1: data.user,
                    user1name: data.fromUsername,
                    user2: data.user2,
                    user2name: '',
                    ncount: 1,
                    cnsid: null
                }]);



                if (useronlinestatus != undefined) {
                    if (useronlinestatus.length == 1) {
                        db.any('select * from chatnotification where fromuser=$1 and touser=$2 and cmsid=$3', [data.user, data.user2, data.room]).then((datan) => {


                            if (datan.length == 0) {


                                db.any('insert into chatnotification(fromuser,touser,cmsid,ncount) values($1,$2,$3,1)', [data.user, data.user2, data.room]).then((datan) => {



                                })



                            }

                            else {

                                db.any('UPDATE chatnotification  SET ncount = ncount + 1 WHERE fromuser = $1 AND touser = $2 and  cmsid=$3', [data.user, data.user2, data.room]).then((datan) => {



                                })

                            }



                        })
                    }

                }





            }
            else {

                db.any('select * from chatnotification where fromuser=$1 and touser=$2 and cmsid=$3', [data.user, data.user2, data.room]).then((datan) => {


                    if (datan.length == 0) {


                        db.any('insert into chatnotification(fromuser,touser,cmsid,ncount) values($1,$2,$3,1)', [data.user, data.user2, data.room]).then((datan) => {



                        })



                    }

                    else {

                        db.any('UPDATE chatnotification  SET ncount = ncount + 1 WHERE fromuser = $1 AND touser = $2 and  cmsid=$3', [data.user, data.user2, data.room]).then((datan) => {



                        })

                    }



                })

                db.any('select * from appchatnotification where userid=$1', [data.user2]).then((datan) => {


                    if (datan.length == 0) {


                        db.any('insert into appchatnotification(userid,ancount) values($1,$2)', [data.user2, 1]).then((datan) => {



                        })



                    }

                    else {

                        db.any('UPDATE appchatnotification  SET ancount = ancount + 1 WHERE userid = $1', [data.user2]).then((datan) => {



                        })

                    }



                })

                io.in('us' + data.user2).emit('new message for notificationapp', [{
                    cmsid: cmsid,
                    user1: data.user,
                    user1name: "",
                    user2: data.user2,
                    user2name: data.fromUsername,
                    ncount: 0,
                    cnsid: null
                }]);

            }

        }
        else {


            db.any('select * from appchatnotification where userid=$1', [data.user2]).then((datan) => {


                if (datan.length == 0) {


                    db.any('insert into appchatnotification(userid,ancount) values($1,$2)', [data.user2, 1]).then((datan) => {



                    })



                }

                else {





                    db.any('UPDATE appchatnotification  SET ancount = ancount + 1 WHERE userid = $1', [data.user2]).then((datan) => {



                    })

                }



            })


            db.any('select * from chatnotification where fromuser=$1 and touser=$2 and cmsid=$3', [data.user, data.user2, cmsid]).then((datan) => {


                if (datan.length == 0) {


                    db.any('insert into chatnotification(fromuser,touser,cmsid,ncount) values($1,$2,$3,1)', [data.user, data.user2, cmsid]).then((datan) => {



                    })



                }

                else {

                    db.any('UPDATE chatnotification  SET ncount = ncount + 1 WHERE fromuser = $1 AND touser = $2 and  cmsid=$3', [data.user, data.user2, cmsid]).then((datan) => {



                    })

                }



            })
        }








    })


    socket.on('messageForNotification', function (data) {



        io.in('us' + data.user2).emit('new message for notificationapp', [{
            cmsid: cmsid,
            user1: data.user,
            user1name: "",
            user2: data.user2,
            user2name: data.fromUsername,
            ncount: 0,
            cnsid: null
        }]);

    });






});

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {



    var addr = server.address();




    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}