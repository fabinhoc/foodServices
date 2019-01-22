// app.js
const bodyParser = require('body-parser')
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

const allowCors = require('./cors')

app.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }))
app.use(bodyParser.json({ limit: '500mb', extended: true }))
app.use(allowCors)


io.on('connection', function(client) {  
    console.log('Client connected...');

    client.on('join', function(data) {
        console.log(data);
        client.emit('messages', 'Hello from server');
    });
});

server.listen(4200);  

module.exports = app