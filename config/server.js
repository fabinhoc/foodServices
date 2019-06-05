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

	// var clients = []
	// socket.on('connect', function(client) {

	// 	console.log(client)
		
	// 	clients.push(client); 
	// 	socket.broadcast.emit('connect', {userId: client, socketId: socket.id});
		
	// 	socket.on('disconnect', function() {
	// 		console.log("disconnected " + socket.id)
	// 		clients.splice(clients.indexOf(client), 1);
	// 	})
	// });

	
	// socket.on('msg', function(message) {
	// 	console.log(message);
	// })
	// // socket.on('msg', (message) => {
	// // 	socket.emit('msg', "vindo do server " + message);
	// // });
	
	// socket.on('userConnected', (userId) => {
	// 	socket.broadcast.emit('userConnected', {;: userId, socketId: socket.id});
	// })

	// socket.on('setSocket', (socket) => {
	// 	socket.emit('setSocket', socket.id);
	// })

});


server.listen(4000);  

module.exports = app