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


io.on('connection', function(socket) {  
    console.log('Client connected...' + socket.id);

    socket.on('disconnect', function() {
        console.log('user disconnected');
    })    
    
    socket.on('msg', (message) => {
        socket.emit('msg', "vindo do server " + message);
    });
    
});


server.listen(4000);  

module.exports = app