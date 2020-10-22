const models = require("express-cassandra");
let cassandra = require('cassandra-driver');

// connect cassandra and return client
function connectCassandra(callback){
    const client = new cassandra.Client({contactPoints: ['127.0.0.1'], localDataCenter: 'datacenter1'});
    client.connect(function (err, result) {
        if(!err) {
            console.log('check_asset: cassandra connected');
            callback(client);
        } else {
            console.log('check_asset: error connecting to cassandra: '.concat(result));
            callback(undefined);
        }
    });
}

// get all assets
function getAssets() {
    let client = new cassandra.Client({contactPoints: ['127.0.0.1'], localDataCenter: 'datacenter1'});
    client.connect(function (err, result) {
        if(!err) {
            console.log('check_asset: cassandra connected: '.concat(result));
        }
    });
    models.instance.Asset.find({}, function(err, assets){
        if(err) throw err;
        console.log('found ', assets);
    });
    client.disconnect(function (err, result) {
        if(!err) {
            console.log('check_asset: cassandra disconnected');
        } else {
            console.log('check_asset: error disconnected cassandra '.concat(result));
        }
    });
}
module.exports = {connectCassandra};
