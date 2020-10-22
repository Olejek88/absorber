const models = require("express-cassandra");
const tynt = require("tynt");

// check and add asset
function checkAsset(client, req) {
    console.log('name: ['.concat(req.name).concat('] : ').concat(req.priceUsd).concat(' supply ').concat(req.supply));
    const query = "SELECT * FROM asset WHERE name = ?";
    client.execute(query, [req.name], (err, result) => {
        if (err) {
            console.log('error: '.concat(err));
            return {msg: err, code: -1};
        }
        if (result.first() !== null) {
            updateAsset(client, result.first().name, result.first().symbol, req, function (err, code) {
                if (code !== 0) {
                    console.log(tynt.Red('error').concat(' update asset failed ').concat(err));
                }
            });
            insertData(client, result.first().id, req.priceUsd, function (err, code) {
                if (code !== 0) {
                    console.log(tynt.Red('error').concat(' saving data: ').concat(err));
                }
            });
        } else {
            insertAsset(client, req, function (err, code, uuid) {
                if (code === 0) {
                    console.log('asset '.concat(req.name).concat(' saved'));
                    insertData(client, uuid, result.first().priceUsd, function (err, code) {
                        if (code === 0) {
                            //console.log('data '.concat(' saved'));
                        } else {
                            console.log(tynt.Red('error').concat(' saving data: ').concat(err));
                        }
                    });
                } else {
                    console.log(tynt.Red('error').concat(' saving asset: ').concat(err));
                }
            });
        }
    });
}

// add asset
function insertAsset(client, req, callback) {
    let uuid = models.uuid();
    let insertAsset = 'INSERT INTO asset(id, name, symbol, supply, price, change, created) VALUES(?,?,?,?,?,?,?)';
    client.execute(insertAsset, [uuid.toString(), req.name, req.symbol, parseFloat(req.supply), parseFloat(req.priceUsd), parseFloat(req.changePercent24Hr), Date.now()], {prepare: true},
        function (err) {
            if (err) {
                callback(err, -1, undefined);
            } else {
                callback("", 0, uuid);
            }
        });
}

// update asset
function updateAsset(client, name, symbol, req, callback) {
    let updateAsset = 'UPDATE asset SET supply=?, price=?, change=?, created=? WHERE name=? AND symbol=?';
    client.execute(updateAsset, [parseFloat(req.supply), parseFloat(req.priceUsd), parseFloat(req.changePercent24Hr), Date.now(), name, symbol], {prepare: true},
        function (err) {
            if (err) {
                callback(err, -1);
            } else {
                callback("", 0);
            }
        });
}

// add data
function insertData(client, uuid, price, callback) {
    let id = models.uuid();
    let insertData = 'INSERT INTO data(uuid, asset, price, created) VALUES(?,?,?,?)';
    client.execute(insertData, [id.toString(), uuid.toString(), parseFloat(price), Date.now()], {prepare: true},
        function (err) {
            if (err) {
                callback(err, -1);
            } else {
                callback("", 0);
            }
        });
}

module.exports = {checkAsset};