var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');

var oldUsername = "Anonymous";
var username = "Anonymous";

app.use('/static', express.static('./static/'))

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '/../', 'index.html'));
});

var getUsername = function(){
    console.log("Username is " + username);
    return username;
};

io.on('connection', function(socket){
    console.log('a user connected: ' + socket.id);
    io.emit('connected');
    socket.on('disconnect', function(){
        console.log('a user disconnected');
        io.emit('disconnected');
    });
    socket.on('chat message', function(msg){
        if(msg != "")
        {
            console.log('message:' + msg);
            socket.broadcast.emit('chat message', username + ": " + msg);
            //addMessage(username + ": " + msg);
        }
    });
    socket.on('nickname', function(nickname){
        if(nickname == "")
                nickname = "Anonymous";
        if(nickname != username)
        {
            oldUsername = username;
            username = nickname;
            console.log("username changed to " + username);
            io.emit('nickname', username, oldUsername);
        }
    })
    socket.on('user typing', function(nickname){
        socket.broadcast.emit('user typing', nickname);
    })
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});