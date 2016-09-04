var localData = {};
var requestStatus = {};
var query = getQueryParams(document.location.search);
var peer_id = query.p || 'p1';

function rtcInit(peerId) {
    peer = new Peer(peerId, {key: '7c5tmjerk7ec23xr'});
    peer.on('connection', function(conn) {
        if (peer.connections[conn.peer]) {
            //conn.close();
            //peer.connections[conn.peer].shift(); // remove any previous connections
        }
        conn.on('data', onDataCallback);
        conn.on('close', function() {
            conn.close();
            peer.connections[conn.peer].shift(); // remove connection
        });
    });
}
rtcInit(peer_id);

var onDataCallback = function(data) {
    if (data.action == 'get' && data.key) {
        console.log('data request from: ' + data.request_peer_id);
        if (localData[data.key]) {
            peer.connections[data.request_peer_id][0].send({
                'action': 'key-found',
                'status': 'ok',
                'key': data.key,
                'data': localData[data.key]
            });
        } else {
            peer.connections[data.request_peer_id][0].send({
                'status': 'not found',
                'data': ''
            });
        }
    }
    if (data.action == 'key-found' && data.key) {
        requestStatus[data.key] = 'found';
        saveData(data.key, data.data);
    }
    console.log(data);
};

function connectToPeers(prs) {
    for (var i = 0; i < prs.length; i++) {
        if (peer.connections[prs[i]]) {
            continue;
        }
        var c = peer.connect(prs[i]);
        c.on('data', onDataCallback);
    }
}

function requestData(key) {
    var prs = [];
    var requestsSent = 0;
    for (p in peer.connections) {
        prs.push(p);
    }
    var totalPeers = prs.length;
    requestStatus[key] = 'pending';

    return new Promise(function(resolve, reject) {
        var requestFn = function(prs) {
            var p = prs.shift();
            if (!p) {
                reject({"message":"data not found","resource":key});
                return false;
            }
            peer.connections[p][0].send({
                'action': 'get',
                'key': key,
                'request_peer_id': peer_id
            });
            requestsSent++;
            sleep(500).then(function() {
                if (requestStatus[key] == 'pending') {
                    requestFn(prs);
                } else {
                    resolve(localData[key]);
                }
            });
        }
        requestFn(prs);
    });
}

function saveData(key, data) {
    localData[key] = data;
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function getQueryParams(qs) {
    qs = qs.split('+').join(' ');
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;
    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }
    return params;
}