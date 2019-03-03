var http = require('http');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();

app.use(bodyParser.json());

app.get('/', function(req, res){
  res.send('This is working');
});

app.post('/test', function(req, res){
  console.log('Post test - Socket Id: ' + req.body.socketid);
  io.sockets.to(req.body.socketid).emit('socket:idacquired', 
  {
    "Header": {
      "ServiceName": "updateOrderProgress"
    },
    "Body": {
      "Response": {
          "SocketId":"5670098978",
          "OperationType":1,
          "OperationName":"Cambio de Plan",
          "CustomerIdCRM":"123123123",
          "DocumentType":"RUC",
          "DocumentNumber":"1023123123",
          "SocialName":"Digital Liquid SAC",
          "InitPlanDate":"10/10/2018",
          "Created":"10/10/2018 12:00",
          "Orders":[
            {
              "OrderId":3123123,
              "CustCode":"3123123",
              "QuotaNum":12,
              "InitialQuota":30,
              "VepAmount":55.99,
              "OrderRegister":[
                {
                  "CurrentPlanId":654321,
                  "CurrentPlanDesc":"PLAN 99",
                  "NewPlanId":678678,
                  "NewPlanDesc":"PLAN I. 89",
                  "ProductId":232435,
                  "ProductDesc":"MOTO C4",
                  "Brand":"MOTOROLA",
                  "FixedCharge":45,
                  "Lines":[
                    {
                        "PhoneNumber":"9879876543"
                    }
                  ]
                }
              ]
            }
          ]
      }
    }
  }  
  );
  res.json({ result:'OK' });
});

var server = http.createServer(app);
var io = require('socket.io')(server);

io.on('connection', function (socket) {
    socket.emit('msg', { msg: 'Welcome bro!' });

    socket.on("getSocketId", function(){
      socket.emit("socketid", socket.id);
      console.log('Sended socket id: ' + socket.id);
    });

    socket.on('msg',function(msg){
    	socket.emit('test', { id: 1, value: 'This is node js answering', list: [ { idl: 1, value: 'This is a element from list' } ] });
      console.log('Message: ' + msg.value);
    });

    socket.on('msg2',function(msg){
    	socket.emit('msg', { msg: "you sent : "+msg });
      console.log('Message: ' + msg);
    });

    console.log(`Socket ${socket.id} has connected`);
});

app.use(cors());

server.listen(8080, function() {
	console.log('Servidor corriendo en http://localhost:8080');
});
