console.log('Server-side code running');

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const client = require('socket.io').listen(4000).sockets;
const clientappoint = require('socket.io').listen(4020).sockets;
const clientmedalert = require('socket.io').listen(4040).sockets;
const clientambalert = require('socket.io').listen(4060).sockets;
const clientdetail = require('socket.io').listen(4080).sockets;
const clientfeedback = require('socket.io').listen(4100).sockets;
var nodemailer = require('nodemailer');
// serve files from the public directory
app.use(express.static('public'));

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connect to the db and start the express server
let db;
// var username;

// ***Replace the URL below with the URL for your database***
const url = 'mongodb://ThaparUser:Pass#123@ds241537.mlab.com:41537/hospital';
// E.g. for option 2) above this will be:
// const url =  'mongodb://localhost:21017/databaseName';

MongoClient.connect(url, (err, database) => {
    if (err) {
        return console.log(err);
    }
    db = database;
    // start the express web server listening on 8080
    app.listen(8080, () => {
        console.log('listening on 8080');
    });
});
// Clent for the medicines page starts up

var idnumber;

client.on('connection', function (socket) {
    console.log('Client Socket connected');

    let medicines = db.collection('medicines');

    // create function to send status//whenever we want to side something from servere side to client side we use emit to do so to show it in html file
    sendStatus = function (s) {
        socket.emit('status', s);
    };

    db.collection('medicines', function (err, collection) {
        if (err) return console.log('error opening users collection, err = ', err);

        //get chats from mongo collection
        // limit(100).sort({ _id: 1, hospitalname: 1, medicinename: 1 ,docotorname:username}).
        medicines.find().toArray(function (err, res) {
            if (err) {
                throw errs;
            }
            // emit the messages
            socket.emit('output', res);
            console.log(res);
        });

    });
});

// client of medicine ends here 

//client for the doctors begins
clientappoint.on('connection', function (socket) {
    console.log('Client Socket connected');

    let doctorsapp = db.collection('doctorappointment');

    // create function to send status//whenever we want to side something from servere side to client side we use emit to do so to show it in html file
    sendStatus = function (s) {
        socket.emit('status', s);
    };

    doctorsapp.find({ idno: idnumber }).limit(100).sort({ _id: 1, appointmentno: 1, timeslot: 1 }).toArray(function (err, res) {
        if (err) {
            throw err;
        }
        // emit the messages
        console.log(res);
        socket.emit('output', res);

    });
});

//client for the doctors ends

//medicine alert client starts

clientmedalert.on('connection', function (socket) {
    console.log('Client Socket connected');

    let medicines = db.collection('medicines');

    // create function to send status//whenever we want to side something from servere side to client side we use emit to do so to show it in html file
    sendStatus = function (s) {
        socket.emit('status', s);
    };

    medicines.find().limit(100).sort({ _id: 1, medicinename: 1, stock: 1 }).toArray(function (err, res) {
        if (err) {
            throw err;
        }
        // emit the messages
        console.log(res);
        socket.emit('output', res);

    });
});


//medicine alert ends here

//ambulance alert client begins here

clientambalert.on('connection', function (socket) {
    console.log('Client Socket connected');

    let alertambulance = db.collection('alertambulance');

    // create function to send status//whenever we want to side something from servere side to client side we use emit to do so to show it in html file
    sendStatus = function (s) {
        socket.emit('status', s);
    };

    alertambulance.find().limit(100).sort({ _id: 1, location: 1, time: 1 }).toArray(function (err, res) {
        if (err) {
            throw err;
        }
        // emit the messages
        console.log(res);
        socket.emit('output', res);

    });
});

//ambulance alert client ends here

//doctors details client starts
clientdetail.on('connection', function (socket) {
    console.log('Client Socket connected');

    let doctorsdes = db.collection('doctorsdes');

    // create function to send status//whenever we want to side something from servere side to client side we use emit to do so to show it in html file
    sendStatus = function (s) {
        socket.emit('status', s);
    };

    doctorsdes.find().limit(100).sort({ _id: 1, doctorname: 1 }).toArray(function (err, res) {
        if (err) {
            throw err;
        }
        // emit the messages
        console.log(res);
        socket.emit('output', res);

    });
});
//doctors details client ends here

//feedback client starts here
clientfeedback.on('connection', function (socket) {
    console.log('Client Socket connected');

    let feedback = db.collection('feedbacks');

    // create function to send status//whenever we want to side something from servere side to client side we use emit to do so to show it in html file
    sendStatus = function (s) {
        socket.emit('status', s);
    };

    feedback.find().limit(100).sort({ _id: 1, feedback: 1 }).toArray(function (err, res) {
        if (err) {
            throw err;
        }
        // emit the messages

        socket.emit('output', res);

    });
});
//feedback client ends here

// serve the homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/appointments/:id', (req, res) => {
    idnumber = req.params.id;
    res.sendFile(__dirname + '/appointments.html');
});

app.get('/appointments', (req, res) => {
    //idnumber=req.params.id; 
    res.sendFile(__dirname + '/appointments.html');
});

app.get('/medicines', (req, res) => {
    res.sendFile(__dirname + '/medicine.html');
});

app.get('/bloodbank', (req, res) => {
    res.sendFile(__dirname + '/bloodbank.html');
});

app.get('/infodeliver', (req, res) => {
    res.sendFile(__dirname + '/infodeliver.html');
});

app.get('/bloodbank', (req, res) => {
    res.sendFile(__dirname + '/bloodbank.html');
});


app.get('/adddoctor', (req, res) => {
    res.sendFile(__dirname + '/newdoctors.html');
});
let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 25,
    auth: {
        user: 'GBM918211@gmail.com',
        pass: 'Pass#123!'
    },
    tls: {
        rejectUnauthorized: true
    }
});
//message to be delivered begins here
app.post('/deliver', (req, res) => {
    console.log(req.body);
    var message = req.body;

    db.collection('doctorappointment').find(
        {
            doctorname: message.doctorname,
            timeslot: message.timeslot
        }).toArray((err, result) => {
            if (err) {
                res.send(err);
            }
            else {
                result.forEach(element => {

                    let HelperOptions = {
                        from: 'GBM918211@gmail.com',
                        to: element.patientemail,
                        subject: "hello!",
                        text: 'wow',

                    };
                    transporter.sendMail(HelperOptions, (error, info) => {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            console.log("message sent");
                        }
                    });

                    res.send([{
                        message: 'Request successfully logged',
                        status: true
                    }]);
                });

            }
        });
});

// add a document to the DB collection recording the click event
app.post('/savedetail', (req, res) => {
    console.log(req.body);
    var doctorsdes = req.body;
    var hospitalname = "AIMS"
    var lastIdNumber;
    db.collection('doctorsdes').find().sort({ idno: -1, doctorname: -1 }).limit(1).toArray((err, result) => {
        if (err) {
            res.send(err);
        }
        count = parseInt(result[0].idno) + 1;
        lastIdNumber = count.toString();

        var saveDoctor = {
            hospitalname: hospitalname,
            doctorname: doctorsdes.doctorname,
            doctorspeciality: doctorsdes.doctorspeciality,
            idno: lastIdNumber,
            doctordescription: doctorsdes.doctordescription
        };

        db.collection('doctorsdes').save(saveDoctor, (err, result) => {
            if (err) {
                return console.log(err);
            }
            console.log('click added to db');
            res.send([{
                message: 'Request successfully logged',
                status: true
            }]);
        });
    });

});
