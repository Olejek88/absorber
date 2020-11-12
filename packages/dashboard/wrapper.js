const connectCassandra = require("../database/routes").connectCassandra;
const getAssetData = require("../database/routes/asset").getAssetData;
const getLastAssetData = require("../database/routes/asset").getLastAssetData;

//let sys = require('util');

function runDashboard(io) {
    console.log('[db] dashboard running');
    io.sockets.on('connection', function (socket) {
        connectCassandra(function (client, err) {
            console.log('[db] cassandra connect');
            if (client !== undefined) {
                console.log('[db] cassandra connected');
                getAllDataWrapper(client, "Bitcoin", io);
            } else {
                console.log('[db] check_asset: error connecting to cassandra: '.concat(err));
            }
        });
        return socket.on('disconnect', function () {
        });
    });
}

getAllDataWrapper = function (client, symbol, io) {
    return getAssetData(client, symbol, "rows", function (code, err, data) {
        let item, _i, _len;
        if (code === 0) {
            for (_i = 0, _len = data.length; _i < _len; _i++) {
                item = data[_i];
                if (typeof io !== "undefined" && io !== null) {
                    io.sockets.emit('chart', {
                        chartData: item,
                        symbol: symbol
                    });
                }
            }
        }
        return setInterval((function () {
            return getLastDataWrapper(client, symbol, io);
        }), 10000);
    });
};

getLastDataWrapper = function (client, symbol, io) {
    return getLastAssetData(client, symbol, "rows", function (code, err, data) {
        let item, _i, _len, _results;
        _results = [];
        if (code === 0) {
            for (_i = 0, _len = data.length; _i < _len; _i++) {
                item = data[_i];
                _results.push(typeof io !== "undefined" && io !== null ? io.sockets.emit('chart', {
                    chartData: item,
                    symbol: symbol
                }) : void 0);
            }
        }
        return _results;
    });
};

module.exports = {runDashboard};
