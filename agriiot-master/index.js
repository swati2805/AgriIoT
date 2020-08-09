'use strict';

var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var session = require('express-session')
app.use(session({ resave: true ,secret: '123456' , saveUninitialized: true}));
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

var collections = {};

var appClient ;

var appClientConfig = {
    "org" : "1j0vu8",
    "id" : "SampleAppNk",
    "domain": "internetofthings.ibmcloud.com",
    "auth-key" : "a-1j0vu8-zfsmcrmx6c",
    "auth-token" : "sJJN3tMyMkYsJVFdbh",
    "type" : "shared" 
}

//l1nAjDm+Sz?gmHRlO7

require('./db/mongodb')(function(colls){
    collections = (colls);
    require('./routes/user/create')(app,collections);
    require('./routes/user/login')(app,collections);
    require('./routes/user/logout')(app,collections);
    require('./routes/farm/create')(app,collections);
    require('./routes/farm/list')(app,collections);
    require('./routes/farm/read')(app,collections);
    require('./routes/servicerequest/create')(app,collections);
    require('./routes/servicerequest/list')(app,collections);
    require('./routes/servicerequest/read')(app,collections);
    require('./routes/servicerequest/cancel')(app,collections);
    require('./routes/bill/create')(app,collections);
    require('./routes/bill/pay')(app,collections);
    require('./routes/thing/list')(app,collections);
    require('./routes/thing/create')(app,collections);
    require('./routes/thing/read')(app,collections);
});


app.get('/test', function (req, res) {
    //res.setHeader('content-type', 'text/html');
    //res.send('<h1>Hello World</h1>');
    res.sendfile("test.html");
});

app.get('/whoami', function (req, res) {
    /*
    var cursor = collections["users"].find();

// Execute the each command, triggers for each document
    cursor.each(function(err, item) {
        // If the item is null then the cursor is exhausted/empty and closed
        if(item == null) {
            //db.close(); // you may not want to close the DB if you have more code....
            return;
        }
        console.log(item);
        // otherwise, do something with the item
    });
    */

    require('./whoami')(req,collections,function(data){
        console.log('user retrieved');
        console.log(data);
        res.json(data);
    });

});

app.use(express.static('projectWeb'))


http.listen(3000, function() {
  console.log('Example app listening on port '+(process.env.PORT || 3000)+'!');


    var Client = require("ibmiotf");
 
    appClient = new Client.IotfApplication(appClientConfig);
   
    console.log("appClientCreated");
    
    appClient.connect();
 
    console.log("appClientConnected");
    
    appClient.on("connect", function () {
 
        appClient.subscribeToDeviceEvents("Generic","+","+","json");

        console.log("appClientConnected Successfully");

    });
    appClient.on("deviceEvent", function (deviceType, deviceId, eventType, format, payload) {

        console.log("Device Event from :: "+deviceType+" : "+deviceId+" of event "+eventType+" with payload : "+payload);

            console.log("appClientConnected deviceEvent");
            try{
                if(isNaN(JSON.parse(payload).temperature) === false)
                io.emit(deviceId, JSON.parse(payload)); // This will emit the event to all connected sockets
            }catch(e){

            }
            
            

    });
    
    appClient.on("error", function (err) {
        console.log("Error : "+err);
    });
    
});

io.on('connection', function(socket){
  console.log('a user connected');
    io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets
});

app.post('/thing/command',function(req,res){
    
    
    
    res.json({success:true});
    
});