var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var url = require('url');

app.listen(8001);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      
      // invalidate resource
      var queryObject = url.parse(req.url, true).query;
      var resource = queryObject.resource;
      io.sockets.emit('invalidate', {resources: [resource]});

      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

var peerList = [];
var clients = {};

function generate() {
    return Math.floor(Math.random()*1000000001);
}

io.on('connection', function (socket) {
  var peer_id = socket.id.slice(15);
  peerList = [];
  for (var key in clients) {
      peerList.push(key.slice(15));
  }
  clients[socket.id] = socket;

  socket.emit('news', { peer_id: peer_id, peer_list: peerList });
  socket.broadcast.emit('update', {peer_list: peerList, info_only: true});
  socket.on('disconnect', function (data) {
      delete clients[socket.id];
      peerList = [];
      for (var key in clients) {
          peerList.push(key.slice(15));
      }
      socket.broadcast.emit('update', {peer_list: peerList});
  });
});