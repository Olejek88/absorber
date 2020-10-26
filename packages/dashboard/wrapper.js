getAllDataWrapper = function (client, pcId) {
    return getAllData(client, pcId, function (result) {
        var item, _i, _len;
        for (_i = 0, _len = result.length; _i < _len; _i++) {
            item = result[_i];
            if (typeof io !== "undefined" && io !== null) {
                io.sockets.emit('chart', {
                    chartData: item
                });
            }
        }
        return setInterval((function () {
            return _this.getLastDataWrapper(connection, 'pc1');
        }), 10000);
    });
};

getLastDataWrapper = function (connection, pcId) {
    return getLastData(connection, pcId, function (result) {
        var item, _i, _len, _results;
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

module.exports = {getAllDataWrapper, getLastDataWrapper};
