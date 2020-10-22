const models = require("express-cassandra");
let cassandra = require('cassandra-driver');

// connect cassandra and return client
function connectCassandra(callback){
    const client = new cassandra.Client({contactPoints: ['127.0.0.1'], localDataCenter: 'datacenter1'});
    client.connect(function (err, result) {
        if(!err) {
            console.log('check_asset: cassandra connected');
            callback(client, err);
        } else {
            console.log('check_asset: error connecting to cassandra: '.concat(result));
            callback(undefined, err);
        }
    });
}

// get all assets
function getAssets() {
    connectCassandra(function (client, err) {
        if (client !== undefined) {
            models.instance.Asset.find({}, function (err, assets) {
                if (err) throw err;
                console.log('found ', assets);
            });
        } else {
            console.log('cassandra connect error');
            console.log(err);
        }
    });
}

module.exports = {getAssets};
