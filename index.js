const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

const arquivos = __dirname + '/arquivos/';

io.on('connection', function(socket){
  socket.on('SEND_MESSAGE', function(msg) {
    io.emit('MESSAGE', msg);
  });

  socket.on('LIST_FILES', function() {
    fs.readdir(arquivos, (err, files) => {
      io.emit('FILES', files);
    });
  });

  socket.on('REQUEST_DOWNLOAD', function(filename){
    var file = arquivos + filename;
    fs.readFile(file, function(err, buffer){
      io.emit('FILE', { filename, buffer });
      console.log(`send file ${filename}`);
    });
  });

});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
