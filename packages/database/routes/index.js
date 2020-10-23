const models = require("express-cassandra");
let cassandra = require('cassandra-driver');

// connect cassandra and return client
function connectCassandra(callback) {
    const client = new cassandra.Client({contactPoints: ['127.0.0.1'], localDataCenter: 'datacenter1'});
    client.connect(function (err, result) {
        if (!err) {
            console.log('check_asset: cassandra connected');
            callback(client, err);
        } else {
            console.log('check_asset: error connecting to cassandra: '.concat(result));
            callback(undefined, err);
        }
    });
}

// get all assets
function getAssets(callback) {
    let ret = "";
    let ass = [];
    let counts = 0;
    connectCassandra(function (client, err) {
        if (client !== undefined) {
            models.instance.Asset.find({}, function (err, assets) {
                if (err) throw err;
                if (assets !== undefined) {
                    assets.forEach(function (value) {
                        ret = ret.concat(value.name).concat(" ").concat(value.symbol).concat(" ").concat(value.supply).concat(" ").concat(value.price).concat(" ").concat(value.change).concat(" ").concat(value.created).concat("<br/>");
                        ass[counts]['name'] = value.name;
                        counts++;

                        /*
                        ass[counts]['name'] = value.name;
                        ass[counts]['symbol'] = value.symbol;
                        ass[counts]['supply'] = value.supply;
                        ass[counts]['price'] = value.price;
                        ass[counts]['change'] = value.change;
                        ass[counts]['created'] = value.created;
                        counts++;
*/
                    });
                    callback(0, "", ret);
                }
            });
        } else {
            console.log('cassandra connect error');
            callback(-1, err, "");
        }
    });
}

module.exports = {getAssets};
