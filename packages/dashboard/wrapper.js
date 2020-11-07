import {connectCassandra} from "../database/routes";
import {getAssetData, getLastAssetData} from "../database/routes/asset";

function runDashboard() {
    connectCassandra(function (client, err) {
        if (client !== undefined) {

        }
    });
}

getAllData = function (connection, pcId, callback) {
    console.log("querying for all data");
    return connection.query('SELECT m.* from data m where m.pc=? order by dat asc', [pcId], function (err, rows, fields) {
        if (err) {
            throw err;
        }
        return callback(rows);
    });
};

getAllDataWrapper = function (client, symbol, io) {
    return getAssetData(client, symbol, "rows", function (result) {
        let item, _i, _len;
        for (_i = 0, _len = result.length; _i < _len; _i++) {
            item = result[_i];
            if (typeof io !== "undefined" && io !== null) {
                io.sockets.emit('chart', {
                    chartData: item
                });
            }
        }
        return setInterval((function () {
            return getLastDataWrapper(client, symbol, "rows");
        }), 10000);
    });
};

getLastDataWrapper = function (client, symbol, io) {
    return getLastAssetData(client, symbol, function (result) {
        let item, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = result.length; _i < _len; _i++) {
            item = result[_i];
            _results.push(typeof io !== "undefined" && io !== null ? io.sockets.emit('chart', {
                chartData: item
            }) : void 0);
        }
        return _results;
    });
};

module.exports = {runDashboard};
